<template>
  <div class="homeDetail">
    <!-- <x-header >在售产品</x-header> -->
    <back options=""></back>
    <swiper class="slider" :aspect-ratio="500/1242" auto @on-index-change="onIndexChange" v-model="swiperIndex">
      <swiper-item class="swiper-item" v-for="(item, index) in swiperList" :key="index">
        <img :src="`../../${item.fileUrl}`">
      </swiper-item>
    </swiper>
    <div class="description">
      <p>{{productParam.productName}}</p>
      <span>{{productParam.productDesc}}</span>
    </div>
    <div class="detailData">
      <p class="desc">产品简介</p>
      <Group  class="celllist" v-for="(items , keys) in detailsData" :key="keys" v-if="keys > 1">
        <div class="tuwen" v-if="keys == 4">
            <ul>
              <li v-for="(jtem , index) in items" @click="jtem.show = true">
                <img :src="`../../${jtem.fileUrl}`">
                <span>{{jtem.name}}</span>
                <div  v-transfer-dom>
                  <popup class="jtempopDetail" v-model="jtem.show" position="bottom" max-height="50%">
                    <div class="jtempopMain">
                      <span v-html="jtem.desc"></span>
                    </div>
                  </popup>
                </div>
              </li>
            </ul>
        </div>
        <div v-else>
          <div class="cell-item-box" v-if="keys == 5">
            <Group title="相关资料">
              <div class="cell-item noleftborder" v-for="(item,key) in items" :key="key" >
                  <cell   :title="item.name"  value="" is-link  @click.native="viewPdf(item.fileUrl,item.name)"></cell>
              </div>
            </Group>
          </div>
          <div v-else>
            <div class="cell-item blue-item" v-for="(item,key) in items" :key="key" v-if="item.smallType == '1'">
              <cell :border-intent="false" :arrow-direction="item.show ? 'up' : 'down'"  :title="item.name" @click.native="item.show = !item.show" value="查看详情" is-link ></cell>
              <template v-if="item.show">
                <cell-box :class="item.show?'animate':''" :border-intent="false" class="sub-item" v-html="item.desc"></cell-box>
              </template>
            </div>
            <div class="cell-item" v-else>
              <Group v-show="item.name!=='产品简介'">
                  <cell  :title="item.name"><span v-html="item.desc"></span></cell>
              </Group>
            </div>
          </div>
        </div> 
      </Group>
    </div>
    
    <box class="crtBtn">
      <x-button @click.native="createAppiont" >创建预约</x-button>
      <x-button @click.native="createPlan" >创建计划书</x-button>
    </box>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import { Swiper,SwiperItem, Group, Cell,Popup, PopupHeader, CellBox ,XButton ,Box ,TransferDom} from 'vux'


export default {
  directives: {
    TransferDom
  },
  components: {
    Swiper,
    Group,
    Cell,
    SwiperItem,
    PopupHeader,
    CellBox,
    XButton,
    Box,
    Popup,
    pdf
  },
  data () {
    return {
      swiperList:[],//头部图片列表
      swiperIndex:0,
      detailsData:[],//除去图片部分的所有信息
      productParam:'',//产品信息，名称/id/类型/公司
      listTitle:'标题',
      showContent004:false,
      productId:''
    }
  },
  mounted(){
    let vm = this 
    vm.productId = vm.$route.query.id
    vm.getProDetail()
    vm.$hideShare()
  },
  methods:{
    onIndexChange(index){
      let vm = this 
      vm.swiperIndex = index
    },
    viewPdf(str,name){
      let vm = this 
      let pdfObj = new Object()
      pdfObj.url = str 
      pdfObj.name = name 
      pdfObj.productName = vm.productParam.productName
      vm.$utils.sessionStorage.setItem('pdf', JSON.stringify(pdfObj))
      window.location.href = "viewpdf.html"
      /*let obj = {
          servicePath:'KINGWORKS_000_000_004',
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
            var da = {
                  ticket: data.body.ticket,
                  url:str,
                  productName:vm.productParam.productName,
                  fileName:name
                };
            vm.$weiXinConfig(da)
            vm.$router.push({path:'./nocpdf',query:{id:str}})
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
        });*/
    },
    getProDetail(){//获取产品详情
      let vm = this 
      var obj = {
        servicePath: 'KINGWORKS_001_001_002',
        jsonData: {
          productId: vm.productId
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

            vm.productParam = body.productParam
            vm.$utils.sessionStorage.setItem('product', JSON.stringify(vm.productParam))
            vm.swiperList = body.productDetail[1]

            Object.keys(body.productDetail).forEach((key,i)=>{
              if(key !== '1'){
                for(var n = 0 ; n < body.productDetail[key].length ; n++){
                  body.productDetail[key][n] = Object.assign({},{show:false},body.productDetail[key][n])
                }
              }
            })

            vm.detailsData = body.productDetail
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
    createPlan(){//创建计划书
      let vm = this 

      vm.$router.push({path:'./plan'})
    },
    createAppiont(){//创建预约
      let vm = this 
      vm.$utils.sessionStorage.setItem('oldOrderNo','')
      vm.$router.push({path:'./createAppiont'})
    }
  }
}
</script>

<style lang="less">
  @import "../../assets/css/comm";
  body{margin: 0;}
  .jtempopDetail{
        .jtempopMain{
          padding: 60/@r 45/@r;
          font-size: 48/@r;
          padding-bottom: 2rem;
        }
  }

  .homeDetail{
    padding-bottom: 260/@r;
    background: #ececec;
    min-height: 100%;
    .vux-slider{
      background: #fff;
      .vux-swiper-item{
        img{
          width: 100%;
        }
      }
    }
    .description{
      padding: 10px 15px;
      background: #fff;
      p{
        font-size: 56/@r;
        color: #000;
        font-weight: 600;
      }
      span{
        font-size: 44/@r;
        color: #999;
      }
    }
    .detailData{
      position: relative;
      border-top: solid 20/@r #ececec;
      .desc{
        background: #fff;
        font-size: 58/@r;
        padding: 20/@r 15px;
        font-weight: 600;
      }
      .celllist{
        border-bottom: solid 20/@r #ececec;
      }
      .vux-no-group-title{margin-top: 0!important;}
      .cell-item-box{
        .weui-cells__title{
          color: #000;
          font-size: 54/@r;
          font-weight: 600;
        }
      }
      .blue-item{
        .weui-cell__ft{
          color: #3594ee;
          font-size: 48/@r;
        }
      }
      .cell-item{
        .vux-label{
          padding-left: 15px;
          position: relative;
          font-size: 48/@r;
          &:before{
            content: "";
            width: 4px;
            height: 60%;
            position: absolute;
            left: 0;
            top: 20%;
            background:#3594ee;
            border-radius: 8px;
          }
        }
        .weui-cell__ft{
          font-size: 40/@r;
          max-width: 60%;
        }
        .sub-item{
          padding: 50/@r 110/@r;
          font-size: 40/@r;
        }
        .weui-cell{
          padding: 30/@r 15px;
          flex-wrap: wrap;
          &:before{
            display: block;
          }
        }
      }
      .noleftborder{
          .vux-label{
            padding-left: 0;
            color: #666;
            &:before{
              display: none;
            }
          }
        }
      a{color: #333;display: block;}
      .tuwen{
        padding: 120/@r 0;
        ul{
          .around;
          li{
            .center;
            flex-wrap: wrap;
            img{
              width: 120/@r;
            }
            span{
              font-size: 48/@r;
              color: #000;
              display: inline-block;
              width: 100%;
              text-align: center;
              padding: 12/@r 0;
            }
          }
          .jtempop{
            z-index: 9999;
          }
        }
      }
    }
    .crtBtn{
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 40/@r 0;
      background: #fff;
      button{
        height: 125/@r;
        line-height: 1;
        margin-top: 0;
        border-radius: 0;
        font-size: 46/@r;
        background: #3594ee;
        color: #fff;
        border-radius: 3px;
        width: 44%;
      }
    }
  }
</style>
