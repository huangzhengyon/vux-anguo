<template>
  <div class="policy">
    <!-- <x-header :left-options="{preventGoBack: true}" @on-click-back="gotoHome">我的保单</x-header> -->
    <back options="index"></back>
    <scroller class="scrollerwrap" use-pullup :pullup-config="pullupDefaultConfig" @on-scroll-bottom="loadMore"
              use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh"
              lock-x ref="scrollerBottom">
        <div class="box2">
            <search
              @on-change="getResult"
              v-model="sreachText"
              auto-scroll-to-top
              :autoFixed=false
              @on-submit="onSubmit"
              ref="search">  
            </search>
            <div class="policyList">
              <div class="haspolicy" v-if="ispolicyList">
                <ul class="tagul">
                    <li v-for="(item,key) in policyData" :key="key" @click.native="gotoDetail(item.orderNo)">
                      <div class="mixInfo down" @click="gotoDetail(item.orderNo,item.policyName)">
                        <span class="name" >{{item.policyName}}</span>
                        <span class="state" >{{item.policyStatus}}</span>
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
import _ from 'lodash'
import { Swiper,SwiperItem, Group, Cell,Search,PopupPicker,Scroller , Divider} from 'vux'

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
    Swiper,
    Group,
    Cell,
    Search,
    PopupPicker,
    Scroller,
    Divider
  },
  data () {
    return {
      sreachText:'',
      pullupDefaultConfig: pullupDefaultConfig,
      pulldownDefaultConfig: pulldownDefaultConfig,
      index:1,//页码
      pageCount:10,//每页查询条数
      ispolicyList:true,//是否展示保单列表
      policyData:'',//保单信息集合
      totality:'',//总数
      showDeeptext:false,//是否显示底部没有更多提示
      isSuretoAdd:false,//是否加载
    }
  },
  mounted(){
    let vm = this 
    vm.getInit()
    vm.$hideShare()
  },
  methods:{
    gotoHome(){
      let vm = this 
      vm.$router.push({path:'./'})
    },
    refresh() {
        let vm = this 
        vm.index = 1
        vm.getInit()
    },
    loadMore() {
      let vm = this 
      if(vm.isSuretoAdd){
        vm.index += 1
        vm.getInit('add')
      }
    },
    onSubmit () {
      this.$refs.search.setBlur()
    },
    getResult:_.throttle(function(val){
          let vm = this 
          vm.index = 1
          vm.sreachText = val
          vm.getInit()
        },1000)
    ,
    getInit(str){//获取产品列表
      var vm = this;
      vm.isSuretoAdd = false
      var obj = {
        servicePath: 'KINGWORKS_002_004_001',
        jsonData: {
            index:vm.index,
            pageCount:vm.pageCount,
            policyName:vm.sreachText
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
              vm.policyData = [...vm.policyData,...body.policyList]

              vm.$refs.scrollerBottom.reset()
              vm.$refs.scrollerBottom.enablePullup()
              vm.$refs.scrollerBottom.donePulldown()
              vm.isSuretoAdd = true
            }else{
              vm.policyData = new Array()
              vm.policyData = body.policyList
              vm.totality = body.totality
              vm.$refs.scrollerBottom.reset({top:0})
              vm.$refs.scrollerBottom.enablePullup()
              vm.$refs.scrollerBottom.donePulldown()
              if(body.policyList && body.policyList.length > 0){
                vm.isSuretoAdd = true
                vm.ispolicyList = true 
              }else{
                vm.isSuretoAdd = false
                vm.ispolicyList = false
                vm.$refs.scrollerBottom.disablePullup()
              }
              
            }
            if(vm.policyData.length >= vm.totality){
              vm.$refs.scrollerBottom.disablePullup()
              vm.showDeeptext = true 
              vm.isSuretoAdd = false
            }
            vm.$hideModel()
          },{
            'else':function(){
              vm.$toast(retMsg)
              vm.$hideModel()
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
    gotoDetail(id){//查看表单详情
      let vm = this 
      vm.$router.push({path:'./policyDetail',query:{orderNo:id}})

    }
  }
}
</script>

<style lang="less">
  @import "../../assets/css/comm";
  body{margin: 0;}
  .policy{
      min-height: 100%;
      background: #ececec;
      .scrollerwrap{
          .weui-search-bar{
            background: #ececec;
          }
          .xs-container{
          
          .xs-plugin-pulldown-container{
            font-size: 40/@r;
            color: #333;
          }
          .xs-plugin-pullup-container{
            font-size: 40/@r;
            color: #333;
          }
          .policyList{
            
            .haspolicy{
              
              .noMoreList{
                width: 80%;
                margin: 0 auto;
                font-size: 14px;
                color: #333;
              }
              .tagul{
                  margin: 0 10px;
                  background: #ececec;
                  margin-bottom: 49/@r;
                  padding-top: 10px;
                  li{
                    .start;
                    font-size: 40/@r;
                    flex-wrap: wrap;
                    height: 234/@r;
                    margin-bottom: 30/@r;
                    background: #fff;
                    border-radius: 5px;
                    &:last-child{
                      .mixInfo{
                        border-bottom: none;
                      }
                    }
                    .mixInfo{
                      width: 100%;
                      height: 100%;
                      .between;
                      padding: 30/@r 15px ;
                      border-bottom: solid 0.5px #ececec;
                      position: relative;
                      .name{
                        flex: 1.5;
                        color: #000;
                      }
                      .state{
                        flex: 1;
                        text-align: right;
                        padding-right: 12px;
                        color: #3594ee;
                      }
                      .greenFonts{
                        color: #4daa43;
                      }
                      .skyFonts{
                        color: #00599d;
                      }
                      .waringFonts{
                        color: #b62f8e;
                      }
                      .failFonts{
                        color: #f44040;
                      }
                      .missingFonts{
                        color: #2a9dae;
                      }
                      .waitFonts{
                        color: #9b7428;
                      }
                      &:after{
                        content: " ";
                        display: inline-block;
                        height: 6px;
                        width: 6px;
                        border-width: 2px 2px 0 0;
                        border-color: #C8C8CD;
                        border-style: solid;
                        -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(0deg);
                        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(0deg);
                        position: relative;
                        top: -2px;
                        position: absolute;
                        top: 50%;
                        margin-top: -4px;
                        right: 15px;
                      }
                    }
                  }
              }
              .weui-cells{
                margin-top: 0;
                font-size: 14px;
                .vux-label{padding-right: 50px;}
              }
              .vux-no-group-title{
                margin-top: 0;
              }
            }
          }
          .hasnolist{
            height: 50%;
            .center;
            // width: 80%;
            margin: 0 auto;
          }
        }
      }
  }
</style>
