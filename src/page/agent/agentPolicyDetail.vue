<template>
  <div class="agentPolicyDetail">
    <!-- <x-header >保单详情</x-header> -->
    <back options=""></back>
    <div class="policyName" :class="{state3:policy.policyStatus=='2',state2:policy.policyStatus=='3',state1:policy.policyStatus=='1'}">
      <div class="title">
        <p>{{policy.productName}}</p>
        <span>NO.{{policy.policyNo}}</span>
      </div>
      <div class="status">
        <!-- <img src="./icons/bzz_03.png"> -->
      </div>
    </div>
    <div class="policyMain">
      <Group title="保单基本信息">
        <cell v-for="(item,key) in customer" :title="item.type | toName" :key="key" :value="item.chineseName"></cell>
        <cell title="年期：" :value="policy.paymentTerm"></cell>
        <cell title="签单时间：" :value="policy.appointmentTime"></cell>
        <cell title="保单号：" :value="policy.policyNo"></cell>
        <cell title="保单状态：" :value="policy.policyStatus"></cell>
        <cell title="保单生效时间：" :value="policy.policyEffectiveTime"></cell>
        <cell title="主险年缴费保费：" :value="`${policy.premium}`"></cell>
        <cell title="附加险年缴保费：" :value="`${policy.extraneousRiskPremium}`"></cell>
        <cell title="首次保费缴费日期：" :value="policy.paymentDate"></cell>
        <cell title="冷静期截止日期：" :value="policy.offPeriod"></cell>
      </Group>
    </div>
    <box class="crtBtn" gap="15px 10px" @click.native="gotoWrite">
        <x-button>修改保单</x-button>
    </box>
  </div>
</template>

<script>
import _ from 'lodash'
import { Swiper,SwiperItem,XButton,Box, Group, Cell,Search,PopupPicker, Divider} from 'vux'


export default {
  components: {
    Swiper,
    Group,
    Cell,
    Search,
    PopupPicker,
    Divider,
    XButton,Box
  },
  data () {
    return {
      orderNo:'',//订单号
      policy:'',//保单信息
      customer:'',//客户信息
    }
  },
  mounted(){
    let vm = this 
    vm.orderNo = vm.$route.query.orderNo
    vm.getInit()
    vm.$hideShare()
  },
  filters:{
     toName(str){
        let result 
        if(str == '1'){
          result = "投保人："
        }else if(str == '2'){
          result = "被保人："
        }else if(str == '3'){
          result = "受益人："
        }
        return result
     }
  },
  methods:{
    gotoWrite(){//goto修改保单
      let vm = this 
      vm.$router.push({path:'./agentWriteDetail',query:{orderNo:vm.orderNo}})
    },
    getInit(str){//获取产品详情
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
            console.log(vm.policy)
            console.log(vm.customer)
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
  .agentPolicyDetail{
    padding-top: 45/@r;
      .policyName{
        margin:0 10px 44/@r 10px;
        padding: 10px 15px;
        border-radius: 8px;
        border: solid 1px #3594ee;
        background: #eaf4fd;
        border-bottom: solid 2px #3594ee;
        .between;
        .title{
          p{
            font-size: 48/@r;
            color: #000;
          }
          span{
            font-size: 44/@r;
            color: #666;
          }
        }
        .status{
          width: 225/@r;
          height: 225/@r;
          // img{
          //   width: 225/@r;
          // }
        }
      }
      .state1{
        border: solid 1px #aaaaaa;
        background: #f6f6f6;
        border-bottom: solid 2px #aaaaaa;
        .status{
          background: url('./icons/state1.png')center no-repeat;
          background-size: 100%;
        }
      }
      .state2{
        border: solid 1px #e1a34a;
        background: #fffcf7;
        border-bottom: solid 2px #e1a34a;
        .status{
          background: url('./icons/state2.png')center no-repeat;
          background-size: 100%;
        }
      }
      .state3{
        border: solid 1px #3594ee;
        background: #eaf4fd;
        border-bottom: solid 2px #3594ee;
        .status{
          background: url('./icons/state3.png')center no-repeat;
          background-size: 100%;
        }
      }
      .policyMain{
        margin: 10px;
        border: solid 1px #ececec;
        border-radius: 8px;
        .weui-cells__title{
          font-size: 44/@r;
          color: #000;
          position: relative;
          padding-left: 50px;
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
        .vux-cell-primary{
          flex: none;
          width: 50%;
          color: #666;
        }
        .weui-cell__ft{
          color: #000;
        }
        .weui-cell{

          &:before{
            display: none;
          }
        }
      }
      .crtBtn{
        button{
          background: #3594ee;
          color: #fff;
        }
      }
  }
</style>
