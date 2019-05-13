<template>
  <div class="home">
    <!-- <x-header :left-options="{showBack: false}">首页</x-header> -->
 <!--    <swiper :aspect-ratio="486/1242" auto :list="swiperList" :interval=6000 v-model="swiperIndex" @on-index-change="onIndexChange"></swiper> -->
    <swiper class="swiperwrap" :aspect-ratio="500/1242">
      <swiper-item class="swiper-item" v-for="(item, index) in swiperList" :key="index" @click.native="gotoDetail(item.productId,'1')">
        <img :src="`../../${item.fileUrl}`">
      </swiper-item>
    </swiper>
    <div class="linkwrap">
      <router-link to="/homelist">
          <div class="item" >
            <div class="icon">
              <img class="icon1" src="./icons/01.png" />
            </div>
            <div class="label">在售产品</div>
          </div>
      </router-link>
      <router-link to="/policy">
          <div class="item">
            <div class="icon">
              <img class="icon1" src="./icons/02.png" />
            </div>
            <div class="label">我的保单</div>
          </div>
      </router-link>
      <router-link to="/myplan">
          <div class="item">
            <div class="icon">
              <img class="icon1" src="./icons/03.png" />
            </div>
            <div class="label">我的计划书</div>
          </div>
      </router-link>
      <router-link to="/appointment">
          <div class="item">
            <div class="icon">
              <img class="icon1" src="./icons/04.png" />
            </div>
            <div class="label">我的预约</div>
          </div>
      </router-link>
    </div>
    <div class="hotinline">
      <div class="hottilte">
        <p>优质产品</p>
        <!-- <div class="hottilte__ft"></div> -->
      </div>
    </div>
    <div class="pdlist">
      <ul>
        <li v-for="(item,key) in productList" :key="key" @click="gotoDetail(item.productId)">
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
    </div>
  </div>
</template>

<script>
import { Swiper,SwiperItem, Group, Cell } from 'vux'

const baseList = [{
  url: 'javascript:',
  img: require('./icons/u14.png'), // 404
  title: '轮播1',
  fallbackImg: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
}]

export default {
  components: {
    Swiper,
    SwiperItem,
    Group,
    Cell
  },
  data () {
    return {
      swiperList:'',//图片轮播列表
      swiperIndex:0,
      productList:[],//产品信息列表
    }
  },
  mounted(){
    let vm = this 
    vm.getMount()
    vm.$hideShare()
  },
  methods:{
    gotoDetail(id,type){
      let vm = this 
      if(type == '1'){
        vm.swiperList.map(item=>{
          if(item.productId !== ''){
            vm.$router.push({path:'/homeDetail',query:{id:id}})
          }
        })
      }else{
        vm.$router.push({path:'/homeDetail',query:{id:id}})
      }
    },
    getMount(){//获取登录信息
      let vm = this
      let isSessionId = vm.$getCookie('sessionId')
      if(isSessionId){
        vm.getInit()
        vm.getProd()
      }else{
        let tokenId = vm.$utils.getQueryString('tokenId')
        let loginId = vm.$utils.getQueryString('loginId')

        let obj = {
            servicePath:'KINGWORKS_000_000_002',
            jsonData: {
                tokenId:tokenId,
                loginId:loginId
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
              let sessionId = data.body.sessionId
              vm.$setCookie('sessionId', sessionId)
              vm.getInit()
              vm.getProd()
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
      }
    },
    onIndexChange(index){
      let vm = this 
      vm.swiperIndex = index
    },
    tohomelist(){
      let vm = this 
      console.log("去产品列表页面")
      vm.$router.push({path:'./homelist'})
    },
    getInit(){//获取轮播信息
      let vm = this 
      let obj = {
          servicePath:'KINGWORKS_000_001_001',
          jsonData: {
              
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
            vm.swiperList = body.fileList
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
    getProd(){//获取产品信息
      let vm = this 
      let obj = {
          servicePath:'KINGWORKS_000_001_002',
          jsonData: {
              
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
            vm.productList = body.productList
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
    }
  }
}
</script>

<style lang="less">
  @import "../../assets/css/comm";
 .center{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .between{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .around{
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .start{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }  
  body{margin: 0;}
  .home{
    .swiperwrap{
      .vux-swiper{
        height: 540/@r!important;
        .swiper-item{
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .copyright {
      font-size: 12px;
      color: #ccc;
      text-align: center;
    }
    .text-scroll {
      border: 1px solid #ddd;
      border-left: none;
      border-right: none;
    }
    .text-scroll p{
      font-size: 12px;
      text-align: center;
      line-height: 30px;
    }
    .black {
      background-color: #000;
    }
    .title{
      line-height: 100px;
      text-align: center;
      color: #fff;
    }
    .animated {
      animation-duration: 1s;
      animation-fill-mode: both;
    }
    .vux-indicator.custom-bottom {
      bottom: 30px;
    }
    @-webkit-keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
      }
      100% {
        opacity: 1;
        transform: none;
      }
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
      }
      100% {
        opacity: 1;
        transform: none;
      }
    }
    .fadeInUp {
      animation-name: fadeInUp;
    }
    .swiper-demo-img img {
      width: 100%;
    }
    .linkwrap{
      .around;
      padding: 60/@r 0/@r;
      a{
        text-decoration: none;
        display: inline-block;
      }
      .item{
        .center;
        flex-wrap: wrap;
        
        .icon{
          width: 100%;
          .center;
          img{
            width: 170/@r;
          }
        }
        .label{
          width: 100%;
          font-size: 44/@r;
          padding: 20/@r 0;
          color: #333;
          .center;
        }
      }
    }
    .hotinline{
      position: relative;
      border-top: solid 30/@r #f5f5f5;
      .hottilte{
        padding: 10px 50/@r;
        position: relative;
        p{
          padding: 0;
          margin: 0;
          // padding-left: 40/@r;
          font-size: 54/@r;
          color: #000;
        }
        .hottilte__ft{
          &::after{
            content: " ";
            display: inline-block;
            height: 6px;
            width: 6px;
            border-width: 2px 2px 0 0;
            border-color: #C8C8CD;
            border-style: solid;
            -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
            position: relative;
            top: -2px;
            position: absolute;
            top: 50%;
            margin-top: -4px;
            right: 15px;
          }
        }
        // &::before{
        //   content: " ";
        //   position: absolute;
        //   left: 50/@r;
        //   bottom: 0;
        //   right: 0;
        //   width: 5px;
        //   height: 100%;
        //   background-color: #ffbe00;
        //   -webkit-transform: scaleY(0.4);
        //   transform: scaleY(0.4);
        // }
      }
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
    }
    .pdlist{
      width: 100%;
      height: 100%;
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
        height: 100%;
        overflow: scroll;
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
        padding-bottom: 350/@r;
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
