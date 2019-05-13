<template>
  <div class="orderDate">
    <!-- <x-header>确定预约时间</x-header> -->
    <back options=""></back>
    <div class="main">
      <Group class="timepicker" title="请确定您的预约时间：">
        <datetime-range title="预约时间" :start-date="nowDate" :end-date="endDate" :format="timeFormat" v-model="appointmentTime" placeholder="请选择"></datetime-range>
      </Group>
      <box class="nextstepbtn" @click.native="postOrder">
        <x-button >提交预约</x-button>
      </box>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Swiper,SwiperItem, Group, Cell,Box,XButton,DatetimeRange } from 'vux'
import  { ConfirmPlugin } from 'vux'
Vue.use(ConfirmPlugin)

export default {
  components: {
    Swiper,
    Group,
    Cell,
    Box,XButton,
    DatetimeRange
  },
  data () {
    return {
      productId:'',//产品Id
      orderNo:'',//订单号
      statusCode:'',//状态码
      appointmentTime:[],//预约时间
      nowDate:'',//当前时间
      endDate:'',//可选最后时间
      timeFormat:'YYYY-MM-DD',//时间格式
    }
  },
  mounted(){
    let vm = this 
    vm.productId = vm.$route.query.productId
    vm.orderNo = vm.$route.query.orderNo
    vm.statusCode = vm.$route.query.statusCode
    vm.appointmentTime = vm.$utils.sessionStorage.getItem('time').split(',')
    let now = new Date()
    let eyear = now.getFullYear() + 1
    let cmonth = now.getMonth() + 1
    let day = now.getDate()
    if (cmonth < 10) cmonth = '0' + cmonth
    if (day < 10) day = '0' + day
    vm.nowDate = now.getFullYear() + '-' + cmonth + '-' + day
    vm.endDate = eyear + '-' + cmonth + '-' + day
    vm.$hideShare()
  },
  methods:{
    postOrder(){//提交预约
      let vm = this 
      let yuyueTime = vm.appointmentTime.join('').replace(/-/g,'')
      let obj = {
          servicePath:'KINGWORKS_002_003_008',
          jsonData: {
             orderNo:vm.orderNo,
             orderStatus:vm.statusCode,
             appointmentTime:yuyueTime
          }
      }
      vm.$vux.confirm.show({
        content: '确定提交预约吗？',
        onCancel () {
        },
        onConfirm () {
          vm.$showModel()
          vm.$doajax(obj)
            .then(function (response) {
              var data = response.data,
                header = data.header,
                retCode = header.retCode,
                retMsg = header.retMsg;
              vm.$retCodeHandle(data, function () {
                var body = data.body;   
                vm.$toast(retMsg)
                setTimeout(()=>{
                  vm.$utils.sessionStorage.setItem('time',vm.appointmentTime)
                  vm.$router.push({path:'./appointment'})
                  vm.$hideModel()
                },1500)
                
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
      })
    }
  }
}
</script>

<style lang="less">
  @import "../../assets/css/comm";
  .orderDate{
    min-height: 100%;
    background: #ececec;
    .main{
      padding: 60/@r 15px;
      .timepicker{
        background: #fff;
      }
      .weui-cells__title{
        font-size: 46/@r;
        color: #000;
        margin: 0;
        padding: 30/@r;
      }
      .weui-cells{
        &:before{
          left: 10px;
          right: 10px;
        }
        &:after{
          left: 10px;
          right: 10px;
        }
        .vux-cell-box{
          .weui-cell__ft{
            height: 50/@r;
            width: 55/@r;
            margin-left: 10/@r;
            &:after{
              content: "";
              width: 52/@r;
              height: 50/@r;
              display: block;
              background: url('./icons/datepickericon_03.png')center no-repeat;
              background-size: 100%;
              border: none;
              transform:rotate(0deg);
              top: 0;
              margin: 0;
              right: 0;
            }
          }
        }
      }
      .nextstepbtn{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding:60/@r 1rem;
        z-index: 11;
        background: #fff;
        button{
          background: #3594ee;
          color: #fff;
          height: 130/@r;
          font-size: 54/@r;
        }
      }
      .weui-cells__title{
        font-size: 58/@r;
        color: #000;
      }
    }
  }
</style>
