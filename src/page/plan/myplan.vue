<template>
  <div class="myplan">
    <!-- <x-header :left-options="{preventGoBack: true}" @on-click-back="gotoHome" >我的计划书</x-header> -->
    <back options="index"></back>
    <scroller class="scrollerwrap" use-pullup :pullup-config="pullupDefaultConfig" @on-scroll-bottom="loadMore"
              use-pulldown :pulldown-config="pulldownDefaultConfig"   @on-pulldown-loading="refresh"
              lock-x ref="scrollerBottom" >
      <div class="box2">
        <search
          @on-change="getResult"
          v-model="sreachText"
          auto-scroll-to-top
          :autoFixed=false
          @on-submit="onSubmit"
          ref="search">  
        </search>
        <tab :animate="false">
          <tab-item @on-item-click="onItemClick" active-class="active-6-2" selected>全部</tab-item>
          <tab-item @on-item-click="onItemClick" active-class="active-6-2" >待生成</tab-item>
          <tab-item @on-item-click="onItemClick" active-class="active-6-2">已生成</tab-item>
        </tab>
        <div class="cellBox">
          <div class="noplan" v-if="!hasPlan">
            <emptyPage></emptyPage>
          </div>
          <div v-else>
            <div class="cell-item" v-for="(item,key) in planList" :key="key" >
              <cell :border-intent="false" :arrow-direction="item.showdown ? 'up' : 'down'"  :title="item.prospectusName" @click.native="getDetail(item.prospectusId,item.showdown)" :value="item.prospectusStatus" is-link ></cell>
              <template v-if="item.showdown">
                <cell class="oneMore" title="产品名称" :value="oneDetail.productName" v-show="oneDetail.productName"></cell>
                <cell class="oneMore" title="姓名" :value="oneDetail.chineseName" v-show="oneDetail.chineseName"></cell>
                <cell class="oneMore" title="出生日期" :value="oneDetail.birth" v-show="oneDetail.birth"></cell>
                <!-- <cell title="保费" :is-loading="!oneDetail.premium" :value="oneDetail.premium"></cell> -->
                <cell class="oneMore" title="保额" :is-loading="!oneDetail.coverage" :value="oneDetail.coverage" v-show="oneDetail.coverage"></cell>
                <cell class="oneMore" title="计划书" is-link @click.native="openUrl(oneDetail.fileUrl,oneDetail.fileName)"></cell>
              </template>
            </div>
            <divider class="noMoreList" v-show="showDeeptext">已经没有更多了</divider>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import { throttle } from 'vux'
import { debounce } from 'vux'
import _ from 'lodash'
import { Swiper,SwiperItem, Group, Cell,Search,PopupPicker,Scroller , Tab, TabItem ,Divider} from 'vux'

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
    Tab,
    TabItem,
    Divider
  },
  data () {
    return {
      sreachText:'',//搜索内容
      pullupDefaultConfig: pullupDefaultConfig,
      pulldownDefaultConfig: pulldownDefaultConfig,
      tabstatus:0,//默认选中全部，1待生成，2已生成
      index:1,//查询页码
      pageCount:10,//每页查询条数
      planList:[],//计划书列表
      hasPlan:false,//是否有计划书
      allplan:'',//总计划书条数
      oneDetail:'',//某一条计划书的详情
      isSuretoAdd:false,//是否加载
      showDeeptext:false
    }
  },
  mounted(){
    let vm = this 
    vm.$nextTick(() => {
        vm.$refs.scrollerBottom.reset()
        vm.$hideShare()
    })
    vm.getInit()
    
  },
  methods:{
    gotoHome(){//回首页
      let vm = this 
      vm.$router.push({path:'./'})
    },
    openUrl(url,name){//打开pdf链接
      let vm = this
      if(url==''){
        vm.$toast('计划书生成中，请稍后查看')
      }else{
        let pdfObj = new Object()
        pdfObj.url = url 
        pdfObj.name = name 
        pdfObj.productName = vm.oneDetail.productName
        vm.$utils.sessionStorage.setItem('pdf', JSON.stringify(pdfObj))
        window.location.href = "viewpdf.html"
        // let obj = {
        //   servicePath:'KINGWORKS_000_000_004',
        //   jsonData: {
              
        //   }
        // }
        // vm.$showModel()
        // vm.$doajax(obj)
        //   .then(function (response) {
        //     var data = response.data,
        //       header = data.header,
        //       retCode = header.retCode,
        //       retMsg = header.retMsg;
        //     vm.$retCodeHandle(data, function () {
        //       var da = {
        //             ticket: data.body.ticket,
        //             url:url,
        //             productName:vm.oneDetail.productName,
        //             fileName:name
        //           };
        //       vm.$weiXinConfig(da)
        //       vm.$router.push({path:'./nocpdf',query:{id:url}})
        //       vm.$hideModel()
        //     },{
        //       'else':function(){
        //         vm.$toast(retMsg)
        //         vm.$hideModel()
        //       }
        //     });
        //   })
        //   .catch(function (error) {
        //     vm.$hideModel()
        //     var toast = vm.$getRetMsg(error);
        //     vm.$toast(toast);
        //   });
      }
    },
    getDetail(id,statu){//获取详情
      let vm = this 
      var obj = {
        servicePath: 'KINGWORKS_002_001_002',
        jsonData: {
          prospectusId:id
        }
      };
      if(statu == false){
        // vm.$showModel()
        vm.$doajax(obj)
          .then(function (response) {
            var data = response.data,
              header = data.header,
              retCode = header.retCode,
              retMsg = header.retMsg;
            vm.$retCodeHandle(data, function () {
              var body = data.body;
              vm.oneDetail = Object.assign({},body.prospectusDetail)
              vm.planList.map(item=>{
                if(item.prospectusId == id){
                  item.showdown = !item.showdown
                }
              })
              vm.$hideModel()
            },{
              'else':function(){
                vm.$toast(retMsg)
                vm.$hideModel()
              }
            });
          })
          .catch(function (error) {
            vm.$hideModel()
            var toast = vm.$getRetMsg(error);
            vm.$toast(toast);
          });
      }else{
        vm.planList.map(item=>{
          if(item.prospectusId == id){
            item.showdown = !item.showdown
          }
        })
      }
    },
    onItemClick (index) {
      let vm = this 
      vm.tabstatus = index
      vm.index = 1 
      vm.getInit()
    },
    refresh() {
        let vm = this 
        // vm.tabstatus = 0 
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
    getResult:_.debounce(function(val){
          let vm = this 
          vm.sreachText = val
          vm.index = 1 
          vm.getInit()
        },2000)
    ,
    onSubmit () {
      this.$refs.search.setBlur()
    },
    getInit(str){//获取计划书列表
      var vm = this;
      vm.isSuretoAdd = false
      var obj = {
        servicePath: 'KINGWORKS_002_001_001',
        jsonData: {
          prospectusName: vm.sreachText,
          status:vm.tabstatus,
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
            vm.allplan = body.totality
            if(str == 'add'){
              if(body.prospectusList.length > 0){
                body.prospectusList.map(item=>{
                  let result = Object.assign({},{showdown:false},item)
                  vm.planList.push(result)
                })
                vm.$refs.scrollerBottom.reset()
                vm.$refs.scrollerBottom.enablePullup()
                vm.$refs.scrollerBottom.donePulldown()
                
              }else{
                vm.isSuretoAdd = false
              }
            }else{
              if(body.prospectusList.length > 0){
                vm.hasPlan = true
                vm.planList = new Array()
                body.prospectusList.map(item=>{
                  let result = Object.assign({},{showdown:false},item)
                  vm.planList.push(result)
                })
                vm.$refs.scrollerBottom.reset()
                vm.$refs.scrollerBottom.enablePullup()
                vm.$refs.scrollerBottom.donePulldown()
                if(vm.planList.length >= vm.allplan){
                  vm.$refs.scrollerBottom.disablePullup()
                  vm.isSuretoAdd = true
                }else{
                  vm.isSuretoAdd = false
                }
              }else{
                vm.hasPlan = false
                vm.isSuretoAdd = false 
                vm.$refs.scrollerBottom.disablePullup()
              }
              vm.$refs.scrollerBottom.reset({top:0})
            }
            if(vm.planList.length >= vm.allplan){
                vm.$refs.scrollerBottom.disablePullup()
                vm.isSuretoAdd = false
                vm.showDeeptext = true 
              }else{
                vm.isSuretoAdd = true
                vm.showDeeptext = false 
              }
            vm.$hideModel()
          },{
            'else':function(){
              vm.$toast(retMsg)
              vm.$hideModel()
              vm.$refs.scrollerBottom.reset({top:0})
            }
          });
        })
        .catch(function (error) {
          vm.$hideModel()
          var toast = vm.$getRetMsg(error);
          vm.$refs.scrollerBottom.reset({top:0})
          vm.$toast(toast);
        });
    }
  }
}
</script>

<style lang="less">
  @import "../../assets/css/comm";
  body{margin: 0;}
  .active-6-2 {
    color: #04be02 !important;
    border-color: #04be02 !important;
  }
  .myplan{
    min-height: 100%;
    .scrollerwrap{
      padding-bottom: 160/@r;
      background: #ececec;
      .xs-plugin-pulldown-container{
            font-size: 14px;
            color: #333;
          }
          .xs-plugin-pullup-container{
            font-size: 14px;
            color: #333;
            bottom: -100px!important;
          }
      .box2{
        .vux-tab-wrap{
          margin: 0 10px;
          margin-top: 10px;
        }
        .cellBox{
          margin: 0 10px;
          .cell-item{
            margin-bottom: 30/@r;
            background: #fff;
            font-size: 48/@r;
            .weui-cell__ft{
              flex: 0.5;
            }
          }
          .noMoreList{
            width: 80%;
            margin: 0 auto;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
