<template>
  <div class="homeList">
    <!-- <x-header >在售产品</x-header> -->
    <back options=""></back>
    <scroller class="scrollerwrap" use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore"
              use-pulldown :pulldown-config="pulldownDefaultConfig"  @on-pulldown-loading="refresh"
              lock-x ref="scrollerBottom" :class="{ecback:!isproList}">
        <div class="box2">
            <search
              @on-change="getResult"
              v-model="sreachText"
              auto-scroll-to-top
              :autoFixed=false
              @on-submit="onSubmit"
              ref="search">  
            </search>
            <Group class="poppickerBox">
              <popup-picker  :data="companyList" v-model="value1"  @on-change="onChange1" :placeholder="znselect"></popup-picker>
              <popup-picker  :data="typeCList" v-model="value2"  @on-change="onChange2" :placeholder="cnselect"></popup-picker>
            </Group>
            <div class="pdlist">
              <div class="hasList" v-if="isproList">
                <ul>
                  <li v-for="(item , index) in proList" :key="index" :id="item.productId" @click="getProDetail(item.productId)">
                    <div class="liImgbox">
                      <img :src="`../../${item.fileUrl}`">
                    </div>
                    <div class="liConbox">
                      <div class="contitle">
                        <p>{{item.productName}}</p>
                        <div class="comp">{{item.companyName}}</div>
                      </div>
                      <div class="content">
                        <p>{{item.productDesc}}</p>
                      </div>
                      <div class="label">
                        <a :class="{bgYellow:item.typeCId=='savings',bgBlue:item.typeCId=='seriousIllness',bgGreen:item.typeCId=='profit'}">{{item.typeCName}}</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <divider class="noMoreList" v-show="showDeeptext">已经没有更多了</divider>
              </div>
              <div class="hasnolist" v-else>
                <emptyPage></emptyPage>
              </div>
            </div>
        </div>
    </scroller>
    
  </div>
</template>

<script>
import { throttle } from 'vux'
import _ from 'lodash'
import { Group, Cell,Search,PopupPicker,Scroller , Divider} from 'vux'

  const pulldownDefaultConfig = {
    content: '下拉刷新',
    height: 40,
    autoRefresh: false,
    downContent: '下拉刷新',
    upContent: '释放后刷新',
    loadingContent: '正在刷新...',
    clsPrefix: 'xs-plugin-pulldown-'
  }

  const pullupDefaultConfig = {
    content: '上拉加载更多',
    pullUpHeight: 60,
    height: 40,
    autoRefresh: false,
    downContent: '释放后加载',
    upContent: '上拉加载更多',
    loadingContent: '加载中...',
    clsPrefix: 'xs-plugin-pullup-'
  }
export default {
  components: {
    Group,
    Cell,
    Search,
    PopupPicker,
    Scroller,
    Divider
  },
  data () {
    return {
      swiperList:[],
      swiperIndex:0,
      listTitle:'标题',
      showContent004:false,
      results:[],
      sreachText:'',
      companyList: [],//公司名称集合
      companyData:[],//公司ID和名称的集合
      typeCList: [],//险种名称集合
      typeCData:[],//险种ID和名称的集合
      companyId:'',
      typeCId:'',
      value1:[],
      value2:[],
      znselect:'全部公司',
      cnselect:'保险类型',
      list: [],
      pullupDefaultConfig: pullupDefaultConfig,
      pulldownDefaultConfig: pulldownDefaultConfig,
      index:1,//页码
      pageCount:10,//每页查询条数
      proList:[],//产品列表集合
      totality:'',//产品列表总数
      isproList:true,//是否有查询到数据
      showDeeptext:false,//展示没有更多数据提醒
      isSuretoAdd:false,//是否加载
    }
  },
  mounted(){
    let vm = this 
    vm.$nextTick(() => {
        vm.$refs.scrollerBottom.reset({top: 0})
        vm.$hideShare()
    })
    vm.getInit()
    vm.getCmpy()
  },
  methods:{
    refresh() {
        let vm = this 
        vm.index = 1 
        vm.showDeeptext = false 
        vm.getInit()
        vm.$nextTick(() => {
            vm.$refs.scrollerBottom.reset()
            vm.$refs.scrollerBottom.donePulldown()
        })
    },
    loadMore() {
      let vm = this 
      if(vm.isSuretoAdd){
          vm.index += 1
          vm.getInit('add')
      }
    },
    onChange1 (val) {
      let vm = this 
      vm.companyData.map(item=>{
        if(item.companyName == val){
          vm.companyId = item.companyId
        }
      })
      vm.getInit()
    },
    onChange2 (val) {
      let vm = this
      vm.typeCData.map(item=>{
        if(item.typeCName == val){
          vm.typeCId = item.typeCId
        }
      }) 
      vm.getInit()
    },
    getResult:_.throttle(function(val){
          let vm = this 
          vm.sreachText = val
          vm.getInit()
        },2000)
    ,
    onSubmit () {
      this.$refs.search.setBlur()
    },
    getInit(str){//获取产品列表
      var vm = this;
      var obj = {
        servicePath: 'KINGWORKS_001_001_001',
        jsonData: {
          productName: vm.sreachText,
          companyId:vm.companyId,
          typeCId:vm.typeCId,
          index:vm.index,
          pageCount:vm.pageCount
        }
      };
      vm.$showModel()
      vm.$doajax(obj)
        .then(function (response) {
          var data = response.data,
            header = data.header,
            retCode = header.retCode,
            retMsg = header.retMsg;
          vm.$retCodeHandle(data, function () {
            var body = data.body;
            if(str == 'add'){
              vm.proList = [...vm.proList,...body.productList]
              vm.$refs.scrollerBottom.reset({top:0})
              vm.$refs.scrollerBottom.enablePullup()
              vm.$refs.scrollerBottom.donePulldown()
            }else{
              vm.proList = new Array()
              vm.proList = body.productList
              vm.$refs.scrollerBottom.reset({top:0})
              vm.$refs.scrollerBottom.enablePullup()
              vm.$refs.scrollerBottom.donePulldown()
              if(body.productList && body.productList.length > 0 ){
                vm.isproList = true 
              }else{
                vm.isproList = false
              }
            }
            
            vm.totality = body.totality
            if(vm.proList.length >= vm.totality){
              vm.$refs.scrollerBottom.disablePullup()
              vm.showDeeptext = true 
            }
            
            vm.$hideModel()
          },{
            'else':function(){
              vm.$toast(retMsg)
              vm.$hideModel()
              vm.isproList = false
              vm.$refs.scrollerBottom.reset({top:0})
              vm.$refs.scrollerBottom.enablePullup()
              vm.$refs.scrollerBottom.donePulldown()
            }
          });
        })
        .catch(function (error) {
          vm.$hideModel()
          var toast = vm.$getRetMsg(error);
          vm.$toast(toast);
          vm.$refs.scrollerBottom.reset({top:0})
            vm.$refs.scrollerBottom.enablePullup()
            vm.$refs.scrollerBottom.donePulldown()
        });
    },
    getCmpy(){//获取公司列表
      var vm = this;
      var obj = {
        servicePath: 'KINGWORKS_001_002_001',
        jsonData: {
          
        }
      };
      vm.$doajax(obj)
        .then(function (response) {
          var data = response.data,
            header = data.header,
            retCode = header.retCode,
            retMsg = header.retMsg;
          vm.$retCodeHandle(data, function () {
            var body = data.body;
            if(body.companyList.length > 0){
              let newArr1 = new Array()
              newArr1.push('全部公司')
              body.companyList.map(item=>{
                newArr1.push(item.companyName)
              })
              vm.companyList.push(newArr1)
              let allcbj = [{companyName:'全部公司',companyId:''}]
              vm.companyData = allcbj.concat(body.companyList)
            }
            
            if(body.typeCList.length > 0){
              let newArr2 = new Array()
              newArr2.push('全部类型')
              body.typeCList.map(item=>{
                newArr2.push(item.typeCName)
              })
              vm.typeCList.push(newArr2)
              let allobj = [{typeCName:'全部类型',typeCId:''}]
              vm.typeCData = allobj.concat(body.typeCList)
            }
          },{
            'else':function(){
              vm.$toast(retMsg)
            }
          });
        })
        .catch(function (error) {
          var toast = vm.$getRetMsg(error);
          vm.$toast(toast);
        });
    },
    getProDetail(id){//获取某个产品的详情
      let vm = this 
      vm.$router.push({path:'/homeDetail',query:{id:id}})
    }
  }
}
</script>

<style lang="less">
  @import "../../assets/css/comm";
  body{margin: 0;}
  .homeList{
    height: 100%;
    .ecback{background: #ececec;}
    .scrollerwrap{

      .xs-container{
        height: 100%;
        .xs-plugin-pulldown-container{
          font-size: 46/@r;
          color: #333;
        }
        .xs-plugin-pullup-container{
          font-size: 46/@r;
          color: #333;
        }
      }
    }
    .swiper-demo-img img {
      width: 100%;
    }
    .poppickerBox{
      .vux-no-group-title{
        .center;
        .vux-cell-box{
          .center;
          flex:1;
          .weui-cell{
            flex:1;
            .vux-popup-picker-select{
              .center;
            }
          }
        }
      }
      .weui-cells{
        margin-top: 0;
        .vux-cell-box{
          &:before{
            display: none;
          }
          .weui-cell{padding: 15px;}
          .weui-cell__ft{
            &:after{
              transform: rotate(135deg);
            }
          }
        }
      }
    }
    .pdlist{
      width: 100%;
      height: 100%;
      background: #fff;
      .hasnolist{
          // height: 50%;
          .center;
          background: #ececec;
        .vux-divider{
          font-size: 46/@r;
          width: 80%;
          
        }
      }
      .hasList{
        height: 100%;
        background: #fff;
        .noMoreList{
          position: absolute;
          font-size: 42/@r;
          width: 80%;
          left: 10%;
        }
      }
      ul{
        padding: 60/@r;
        height: 100%;
        overflow: scroll;
        // padding-bottom: 350/@r;
        padding-top: 0;
        li{
          .between;
          flex-wrap: nowrap;
          position: relative;
          padding: 20/@r 0;
          &::after{
              content: " ";
              position: absolute;
              left: 0;
              bottom: 0;
              right: 0;
              height: 1px;
              border-bottom: 1px solid #D9D9D9;
              color: #D9D9D9;
              -webkit-transform-origin: 0 100%;
              transform-origin: 0 100%;
              -webkit-transform: scaleY(0.5);
              transform: scaleY(0.5);
          }
          .liImgbox{
            width: 340/@r;
            height: 340/@r;
            overflow: hidden;
            flex:1;
            .center;
            img{
              width: 90%;
              height: 100%;
            }
          }
          .liConbox{
            .center;
            flex-wrap: wrap;
            flex:2;
            height: 340/@r;
            align-items: stretch;
            .contitle{
              width: 100%;
              .start;
              p{
                font-size: 50/@r;
                color:#333;
                position: relative;
              }
              .comp{
                padding: 7.5px 5px;
                padding-bottom: 6.5px;
                border-radius: 3px;
                color: #3594ee;
                margin: 0;
                line-height: 0;
                font-size: 8px;
                margin-left: 10px;
                .center;
                border:solid 0.5px #3594ee;
              }
            }
            .content{
              width: 100%;
              display: flex;
              justify-content: flex-start;
              align-items: baseline ;
              p{
                font-size: 42/@r;
                color: #ccc;
                overflow : hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
              }
            }
            .label{
              width: 100%;
              position: relative;
              .start;
              a{
                top: 0;
                left: 0;
                font-size: 12px;
                padding: 10/@r 20/@r;
                border: 1px solid #fff;
                border-radius: 24px;
                color: #fff;
                line-height: 1;
                display: inline-block;
                text-decoration: none;
              }
              em{
                font-size: 40/@r;
                color: #009fff;
                font-style: normal;
                display: inline-block;
                position: absolute;
                right: 0;
                border:solid 1px #009fff;
                border-radius: 3px;
                padding: 0 15/@r;
              }
              .bgBlue{
                background: #3981ff;
              }
              .bgYellow{
                background: #ffc039;
              }
              .bgGreen{
                background: #45b402;
              }
            }
          }
        }
      }
    }
  }
</style>
