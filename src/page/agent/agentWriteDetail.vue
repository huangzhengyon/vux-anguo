<template>
  <div class="agentWriteDetail">
    <!-- <x-header >填写保单</x-header> -->
    <back options=""></back>
    <div class="policyName">{{policy.productName}}</div>
    <div class="policyMain">
      <Group title="保单基本信息" class="wrap">
        <cell title="产品" :value="policy.productName"></cell>
        <cell v-for="(item,key) in customer" :title="item.type | toName" :key="key" :value="item.chineseName"></cell>
        <cell title="年期" :value="policy.paymentTerm"></cell>
        <cell title="签单时间" :value="policy.appointmentTime"></cell>
        <x-input class="xinput" title="保单号" v-model="policyNo" placeholder="请填写保单号"></x-input>
        <x-input class="xinput" type="number" title="主险保费" v-model="premium" placeholder="请填写主险保费"></x-input>
        <x-input class="xinput" type="number" title="附加险保费" v-model="extraneousRiskPremium" placeholder="请填写附加险保费"></x-input>
        <datetime v-model="policyEffectiveTime"  start-date="2000-01-01" :end-date="endDate" class="sss" title="保单生效时间" placeholder="请选择"></datetime>
        <datetime v-model="offPeriod"  start-date="2000-01-01" :end-date="endDate" class="sss" title="冷静期截止日期" placeholder="请选择"></datetime>
        <datetime v-model="paymentDate"  start-date="2000-01-01" :end-date="endDate" class="sss" title="当前缴费日期" placeholder="请选择"></datetime>
        <popup-radio class="aaa" title="保单状态" :options="pickerData" v-model="policyStatus" placeholder="请选择" ></popup-radio>
      </Group>
    </div>
    <box class="submitBtn">
        <x-button class="active"  @click.native="submitInfo">提交</x-button>
    </box>
  </div>
</template>

<script>
import _ from 'lodash'
import { Swiper,SwiperItem, Group, Cell,Search,PopupPicker,PopupRadio, Divider,XInput,Datetime,Box,XButton} from 'vux'

const popstate = [
  {
    key:1,
    value:'已取消'
  },{
    key:2,
    value:'保单生效'
  },{
    key:3,
    value:'搁置受保'
  }
]

export default {
  components: {
    Swiper,
    Group,
    Cell,
    Search,
    PopupPicker,
    PopupRadio,
    Divider,XInput,Datetime,
    Box,XButton
  },
  data () {
    return {
      orderNo:'',//订单号
      policy:'',//保单信息
      customer:'',//客户信息
      policyNo:'',//保单号
      premium:'',//主险保费
      nowDate:'',//当前时间
      endDate:'',//可选最后时间
      extraneousRiskPremium:'',//附加险保费
      policyEffectiveTime:'',//保单生效时间
      offPeriod:'',//冷静期
      paymentDate:'',//当前缴费日期
      pickerData:popstate,//保单状态列表，
      policyStatus:'',//选中的保单状态
    }
  },
  mounted(){
    let vm = this 
    vm.orderNo = vm.$route.query.orderNo
    let now = new Date()
    let eyear = now.getFullYear() + 2
    let cmonth = now.getMonth() + 1
    let day = now.getDate()
    if (cmonth < 10) cmonth = '0' + cmonth
    if (day < 10) day = '0' + day
    vm.nowDate = now.getFullYear() + '-' + cmonth + '-' + day
    vm.endDate = eyear + '-' + cmonth + '-' + day
    vm.getInit()
    vm.$hideShare()
  },
  filters:{
     toName(str){
        let result 
        if(str == '1'){
          result = "投保人"
        }else if(str == '2'){
          result = "被保人"
        }else if(str == '3'){
          result = "受益人"
        }
        return result
     },
     toStatus(str){
      let result 
        if(str == '1'){
          result = "已取消"
        }else if(str == '2'){
          result = "保单生效"
        }else if(str == '3'){
          result = "搁置受保"
        }
        return result
     }
  },
  methods:{
    submitInfo(){
      let vm = this
      if(vm.policyNo == ''){
        vm.$toast('请填写保单号')
        return
      }else if(vm.premium == ''){
        vm.$toast('请填写主险保费')
        return
      }else if(vm.extraneousRiskPremium == ''){
        vm.$toast('请填写附加险保费')
        return
      }else if(vm.policyEffectiveTime == ''){
        vm.$toast('请选择保单生效时间')
        return
      }else if(vm.offPeriod == ''){
        vm.$toast('请选择冷静期')
        return
      }else if(vm.paymentDate == ''){
        vm.$toast('请选择当前缴费日期')
        return
      }else if(vm.policyStatus == ''){
        vm.$toast('请选择保单状态')
        return
      }else{
        let obj = {
            servicePath:'KINGWORKS_004_002_005',
            jsonData:{
              orderNo:vm.orderNo,
              policyNo:vm.policyNo,
              premium:vm.premium,
              extraneousRiskPremium:vm.extraneousRiskPremium,
              policyEffectiveTime:vm.policyEffectiveTime.replace(/-/g,''),
              offPeriod:vm.offPeriod.replace(/-/g,''),
              paymentDate:vm.paymentDate.replace(/-/g,''),
              policyStatus:vm.policyStatus
            }
        }
        vm.$showModel()
        vm.$doajax(obj)
          .then(function (response) {
            var data = response.data,
              header = data.header,
              retCode = header.retCode,
              retMsg = header.retMsg;
            vm.$retCodeHandle2(data, function () {
              var body = data.body;
              vm.$toast(retMsg)
              setTimeout(()=>{
                vm.$router.push({path:'./agentPolicy'})
                vm.$hideModel()
              },500)
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
    getInit(str){//获取保单详情
      var vm = this;
      var obj = {
        servicePath: 'KINGWORKS_002_004_002',
        jsonData: {
            orderNo:vm.orderNo
        }
      };
      vm.$showModel()
      vm.$doajax(obj)
        .then(function (response) {
          var data = response.data,
            header = data.header,
            retCode = header.retCode,
            retMsg = header.retMsg;
          vm.$retCodeHandle2(data, function () {
            var body = data.body;
            vm.policy = vm.$objDeepCopy(body.policyDetail)
            vm.customer = body.customerArray
            vm.policyNo = vm.policy.policyNo
            vm.premium = vm.policy.premium.replace(/[^0-9]/ig,'')
            vm.extraneousRiskPremium = vm.policy.extraneousRiskPremium.replace(/[^0-9]/ig,'')
            vm.policyEffectiveTime = vm.policy.policyEffectiveTime
            vm.offPeriod = vm.policy.offPeriod
            vm.paymentDate = vm.policy.paymentDate
            vm.policyStatus = vm.policy.policyStatus
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
  body{margin: 0;}
  .weui-cell_radio{font-size: 40/@r;}
  .vux-cell-value{color: #000!important}
  .agentWriteDetail{
    height: 100%;
    background-color: #fff;
    padding-top: 45/@r;
    .policyName{
      margin:0 10px 44/@r 10px;
      padding: 10px 15px;
        border-radius: 8px;
      background-color: #fff;
      font-size: 48/@r;
      color: #333;
      border:solid 0.5px #ececec;
      min-height: 1.7rem;
      .start;
      padding: 0px 15px;
      margin-top: 0;
    }
    .policyMain{
      margin: 10px;
      border: solid 1px #ececec;
      border-radius: 8px;
      .weui-cells{
        font-size: 42/@r;
        color: #333;
        .weui-cell{
          padding: 12px 15px;
        }
      }
      .wrap{
        .weui-cells__title{
            font-size: 44/@r;
            color: #000;
            position: relative;
            padding-left: 50px;
            margin-top: 0.77em;
            margin-bottom: 0.3em;
            &:before{
              content: '';
              width: 62/@r;
              height: 63/@r;
              background: url('./icons/jiben_03.png');
              display: block;
              position: absolute;
              left: 15px;
              top: 0;
              background-size: 100%;
            }
        }
        .xinput{
          .weui-input{
            text-align: right;
          }
        }
      }
    }
   .submitBtn{
      margin: 110/@r 10px;
      .active{
        color: #fff;
        font-size: 46/@r;
        background: #3594ee;
      }
    }
  }
</style>
