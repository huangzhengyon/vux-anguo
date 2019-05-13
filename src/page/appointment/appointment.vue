<template>
  <div class="appointment">
    <!-- <x-header :left-options="{preventGoBack: true}" @on-click-back="gotoHome">我的预约</x-header> -->
    <back options="index"></back>
    <scroller lock-x class="scrollerwrap"  ref="scrollerBottom" :pullup-config="pullupDefaultConfig" @on-scroll-bottom="loadMore" :pulldown-config="pulldownDefaultConfig" :scroll-bottom-offst="10"  @on-pulldown-loading="refresh" use-pullup use-pulldown>
      <div class="box2">
        <search class="searchbox" @on-change="getResult" v-model="sreachText" auto-scroll-to-top :autoFixed=false @on-submit="onSubmit" ref="search"></search>
        <div class="pdlist"  v-if="isproList">
          <div class="hasList">
              <ul>
                <li v-for="(item,key) in aptDataList" :key="key">
                  <div class="mixInfo down" @click="gotoDetail(item.orderNo,item.policyName)">
                    <span class="name" >{{item.policyName}}</span>
                    <span class="state" :class="{greenFonts:item.orderStatus == '200',skyFonts:item.orderStatus=='300',waringFonts:item.orderStatus=='350',failFonts:item.orderStatus=='160'||item.orderStatus=='700'||item.orderStatus=='500'||item.orderStatus=='170',missingFonts:item.orderStatus=='140',waitFonts:item.orderStatus=='120'||item.orderStatus=='100'}">{{item.statusName}}</span>
                  </div>
                </li>
              </ul>
            <divider class="noMoreList" v-show="showDeeptext">已经没有更多了</divider>
          </div>
        </div>
        <div class="hasnolist" v-else>
            <emptyPage></emptyPage>
          </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import { Group, Cell,Search,Scroller,Divider } from 'vux'

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
    Scroller,
    Divider
  },
  data () {
    return {
      index:1,//页码
      pageCount:10,//每页查询条数
      aptDataList:[],//我的预约数据列表
      pullupDefaultConfig: pullupDefaultConfig,
      pulldownDefaultConfig: pulldownDefaultConfig,
      showDeeptext:false,//展示没有更多数据提醒
      isproList:false,//是否有查询到数据
      sreachText:'',//搜索内容
      totality:'',//所有数据总数
      isSuretoAdd:true,//是否加载
    }
  },
  mounted(){
    let vm = this 
    vm.$nextTick(() => {
        vm.$refs.scrollerBottom.reset({top: 0})
    })
    vm.getaptList()
    vm.$hideShare()
  },
  methods:{
    gotoHome(){
      let vm = this 
      vm.$router.push({path:'./'})
    },
    gotoDetail(orderNo,policyName){
      let vm = this 
      vm.$router.push({path:'./appiontDetail',query:{orderNo:orderNo,name:policyName}})
    },
    moreDetail(orderNo,state){
      let vm = this 
      if(state == false ){
        vm.aptDataList.forEach((item,i)=>{
          if(item.orderNo == orderNo){
            if(JSON.stringify(item.detail) == '{}'){
              let obj = {
                  servicePath:'KINGWORKS_002_003_002',
                  jsonData: {
                      orderNo:orderNo
                  }
              }
              vm.$showModel()
              vm.$doajax(obj)
                .then(function (response) {
                  var data = response.data,
                    header = data.header,
                    retCode = header.retCode,
                    retMsg = header.retMsg;
                  vm.$retCodeHandle(data, function () {
                    var body = data.body;
                    vm.aptDataList.forEach((item,i)=>{
                      if(item.orderNo == orderNo){
                        item.detail = vm.$objDeepCopy(body.orderDetail)
                        item.showdown = true 
                      }else{
                        item.showdown = false
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
              item.showdown = true 
            }
          }else{
            item.showdown = false
          }
        })
        
      }else{
        vm.aptDataList.forEach((item,i)=>{
            if(item.orderNo == orderNo){
              item.showdown = false 
            }
          })
      }
    },
    getaptList(str){//获取我的预约列表
      let vm = this 
      vm.isSuretoAdd = false
      let obj = {
          servicePath:'KINGWORKS_002_003_001',
          jsonData: {
              index:vm.index,
              pageCount:vm.pageCount,
              policyName:vm.sreachText
          }
      }
      vm.$showModel()
      vm.$doajax(obj)
        .then(function (response) {
          var data = response.data,
            header = data.header,
            retCode = header.retCode,
            retMsg = header.retMsg;
          vm.$retCodeHandle(data, function () {
            var body = data.body;  
            vm.totality = body.totality 
            let nobj = new Object()
            if(str == 'add'){
              if(body.orderList && body.orderList.length > 0){
                let addList = body.orderList.map(item=>{
                  return Object.assign({},{showdown:false,detail:nobj},item)
                })
                vm.aptDataList = [...vm.aptDataList,...addList]
                vm.$refs.scrollerBottom.reset()
                vm.$refs.scrollerBottom.enablePullup()
                vm.$refs.scrollerBottom.donePulldown()
                vm.isSuretoAdd = true
              }else{
                vm.$refs.scrollerBottom.reset({bottom:0})
                vm.$refs.scrollerBottom.disablePullup()
                vm.isSuretoAdd = false
              }
              
            }else{
              vm.aptDataList = new Array()
              vm.aptDataList = body.orderList.map(item=>{
                return Object.assign({},{showdown:false,detail:nobj},item)
              })
              vm.$refs.scrollerBottom.reset({top:0})
              vm.$refs.scrollerBottom.enablePullup()
              vm.$refs.scrollerBottom.donePulldown()
              if(body.orderList && body.orderList.length > 0 ){
                vm.isproList = true 
                vm.isSuretoAdd = true
              }else{
                vm.isproList = false
                vm.isSuretoAdd = false
                vm.$refs.scrollerBottom.disablePullup()
              }
            }
            if(vm.aptDataList.length >= vm.totality){
              vm.$refs.scrollerBottom.disablePullup()
              vm.showDeeptext = true 
              vm.isSuretoAdd = false
            }
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
    },
    refresh(){
      let vm = this 
      vm.index = 1
      vm.showDeeptext = false
      vm.getaptList()
    },
    loadMore(){
      let vm = this 
      if(vm.isSuretoAdd){
        vm.index += 1 
        vm.getaptList('add')
      }
    },
    getResult:_.throttle(function(val){
          let vm = this
          vm.index = 1  
          vm.sreachText = val
          vm.getaptList()
        },2000)
    ,
    onSubmit(){
      this.$refs.search.setBlur()
    }
  }
}
</script>

<style lang="less">
  @import "../../assets/css/comm";
  body{margin: 0;}
  .appointment{
      min-height: 100%;
      background: #ececec;
      .scrollerwrap{
        height: 100%;
         padding-bottom: 60/@r;
         .box2{
          min-height: 100%;
        }

        .xs-container{
          min-height: 100%;
          .xs-plugin-pulldown-container{
            font-size: 14px;
            color: #333;
          }
          .xs-plugin-pullup-container{
            font-size: 14px;
            color: #333;
            bottom: -100px!important;
          }
          .vux-search-box{
            .weui-search-bar{
              background: #ececec!important;
            }
            z-index: 10;
            .weui-search-bar{
              padding: 30/@r 10px;
            }
          }
          .pdlist{
            min-height: 100%;
            background: #fff;
            
            .hasnolist{
                height: 50%;
                .center;
              .vux-divider{
                font-size: 46/@r;
                width: 80%;
                
              }
            }
            .hasList{
              background: #ececec;
              .noMoreList{
                position: fixed;
                left: 0;
                right: 0;
                bottom: -40px;
                width: 80%;
                margin: 0 auto;
                font-size: 12px;
              }
              .timeselect{
                position: fixed;
                top: 2.5rem;
                left: 0;
                right: 0;
                z-index: 6;
                background-color: #EFEFF4;
                .daterange{
                  font-size: 46/@r;
                }
              }
              .weui-cells{
                margin-top: 0;
                &:after{
                  bottom: 1px;
                }
              }
              ul{
                margin: 0 10px;
                background: #ececec;
                li{
                  flex-wrap: wrap;
                  height: 234/@r;
                  border-left: solid 4px #3594ee;
                  margin-bottom: 30/@r;
                  background: #fff;
                  border-radius: 5px;
                  &:last-child{
                    .mixInfo{
                      border-bottom: none;
                    }
                  }
                  .down:after{
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
                  .start;
                  font-size: 40/@r;
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
                  }
                  .maxInfo{
                    width: 100%;
                    padding: 20px 15px;
                    border-bottom: solid 1px #ececec;
                    .detailcell{
                      width: 100%;
                      padding: 7px 0;
                      .between;
                      .detailactor{
                        img{
                          width: 50/@r;
                          vertical-align: top;
                        }
                        .bulefonts{
                          color: #1296db;
                          padding-left: 15px;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
  }
</style>
