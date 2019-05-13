<template>
  <div class="appointDetail">
    <!-- <x-header>预约详情</x-header> -->
    <back options=""></back>
    <div class="policyName">{{policyName}}</div>
    <div class="policyMain">
      <div class="title"><img src="./icons/jiben_03.png"><span>预约基本信息</span></div>
      <Group class="main">
        <cell title="保险计划：" :value="detail.productName"></cell>
        <cell title="投保人：" :value="detail.applicantName"></cell>
        <cell title="被保人：" :value="detail.insurantName"></cell>
        <cell title="受益人：" v-for="(item,key) in detail.favoreeArray" :key="key" :value="item.favoreeName"></cell>
        <cell title="保费：" :value="detail.coverage"></cell>
        <cell title="保费年期：" :value="detail.paymentTerm"></cell>
      </Group>
    </div>
    <div class="policyStep">
      <div class="title"><img src="./icons/jindu_03.png"><span>处理进度</span></div>
      <div class="main">
          <Group>
            <cell title="预约状态：" class="rightstate" :value="detail.statusName"></cell>
            <Group v-if="isshowRemark=='1'">
              <datetime title="预约时间：" :readonly="canselect" format="YYYY-MM-DD HH:mm" :start-date="nowDate" :end-date="endDate"  v-model="appointmentTime" placeholder="请选择"></datetime>
                        
            </Group>
            <cell title="预约时间：" v-if="isshowRemark!=='1'" :value="appointmentTime"></cell>
            <x-textarea title="备注：" class="beizhu" name="detail" v-show="detail.remark!==''" v-model="oldremark" readonly :show-counter="false"  autosize></x-textarea>
          </Group>
          <div class="statesWrap" v-if="isshowRemark=='0'|| isshowRemark=='1'">
            <div class="checkicon" v-for="(item,key) in stateDate" :key="key" @click="checkState(item.nextStatusCode)">
              <check-icon :value="item.show" type="plain">{{item.nextStatusName}}</check-icon>
            </div>
          </div>
          <div class="fujia">
            <group v-if="writemore">
              <x-textarea :max="200" name="detail" v-model="remark" placeholder="请填写详细说明" :show-counter="false"></x-textarea>
            </group>
          </div>
      </div>      
    </div>
    <div class="bottom-x-button" v-show="!emptyNext">
        <box class="submitBtn" v-if="isshowRemark=='1'|| isshowRemark=='0'" >
            <x-button class="default" :class="{active:btnState}" @click.native="submitChange">提交</x-button>
        </box>
        <box class="submitBtn" v-if="isshowRemark=='3'" >
            <x-button class="default active"  @click.native="gotoWrite">填写保单</x-button>
        </box>
        <box class="submitBtn"  v-if="isshowRemark=='2'">
            <x-button class="active"  @click.native="gotoUpload">补传资料</x-button>
        </box>
    </div>
    <div class="haswrited" v-if="!checkPolicy">
      <span>保单信息已填写，请到我的保单中查看</span>
    </div>
  </div>
</template>

<script>
import { Group, Cell,Search,Scroller,Divider,CheckIcon,Box,XButton,XTextarea,DatetimeRange,XInput,Datetime } from 'vux'


export default {
  components: {
    Group,
    Cell,
    Search,
    Scroller,
    Divider,
    CheckIcon,
    Box,XButton,
    XTextarea,
    DatetimeRange,
    XInput,
    Datetime 
  },
  data () {
    return {
      orderNo:'',//订单号
      policyName:'',//预约名称
      detail:'',//详情
      stateDate:[],//状态列表
      btnState:false,//默认置灰按钮
      isshowRemark:'',//显示对应操作的附加框
      nowDate:'',//当前时间
      endDate:'',//可选最后时间
      appointmentTime:'',//预约时间
      remark:'',//补充说明
      oldremark:'',//获取的说明
      orderStatus:'',//选择的状态节点
      showSubmit:true,//是否展示为提交
      emptyNext:'',//下一节点是否为空
      ischeck:true,//是否显示底部按钮
      canselect:true,//是否可以修改时间
      writemore:false,//添加备注输入框
      checkPolicy:false,//是否完成填写保单,true 出现按钮
    }
  },
  mounted(){
    let vm = this 
    vm.orderNo = vm.$route.query.orderNo
    vm.policyName = vm.$route.query.name
    let now = new Date()
    let eyear = now.getFullYear() + 2
    let cmonth = now.getMonth() + 1
    let day = now.getDate()
    if (cmonth < 10) cmonth = '0' + cmonth
    if (day < 10) day = '0' + day
    vm.nowDate = now.getFullYear() + '-' + cmonth + '-' + day
    vm.endDate = eyear + '-' + cmonth + '-' + day
    vm.getDetail()
    vm.$hideShare()
  },
  methods:{
    gotoWrite(){//去填写保单信息
      let vm = this 
      vm.$router.push({path:'./writeDetail',query:{orderNo:vm.orderNo}})
    },
    gotoUpload(){//补传资料
      let vm = this 
      vm.$utils.sessionStorage.setItem('oldOrderNo',vm.orderNo)
      vm.$router.push({path:'./createAppiont',query:{orderNo:vm.orderNo}})
    },
    submitChange(){//提交处理状态
      let vm = this 
      if(vm.btnState == true){
        if(vm.isshowRemark == '1'){
          // let yuyueTime = vm.appointmentTime.join('').replace(/-/g,'')
          let yuyueTime = vm.appointmentTime.replace(/[^0-9]/ig,"")
          let obj = {
              servicePath:'KINGWORKS_002_003_008',
              jsonData: {
                  orderNo:vm.orderNo,
                  orderStatus:vm.orderStatus,
                  appointmentTime:yuyueTime,
                  remark:vm.remark
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
                vm.$toast(retMsg)
                setTimeout(()=>{
                  vm.$router.push({path:'./'})
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
        }else if(vm.isshowRemark == '0'){
          let obj = {
              servicePath:'KINGWORKS_002_003_008',
              jsonData: {
                  orderNo:vm.orderNo,
                  orderStatus:vm.orderStatus,
                  remark:vm.remark
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
                vm.$toast(retMsg)
                setTimeout(()=>{
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
      }
    },
    checkState(state){//选择处理状态
      let vm = this 
      vm.stateDate.forEach((item,i)=>{
        item.show = false 
        if(item.nextStatusCode == state){
          vm.stateDate[i].show = true 
          vm.btnState = true 
          vm.orderStatus = state
        }
      })
      if(state == '140' || state == '160'|| state == '145'){
        vm.canselect = false
      }else{
        vm.canselect = true 
      }

      if(vm.ischeck == true ){
        vm.writemore = true 
      }else{
        vm.writemore = false
      }

    },
    getDetail(){//获取预约详情
      let vm =  this 
      let obj = {
            servicePath:'KINGWORKS_002_003_009',
            jsonData: {
                orderNo:vm.orderNo
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
              vm.detail = vm.$objDeepCopy(body)
              vm.oldremark = vm.detail.remark
              vm.stateDate = vm.detail.nextStatus.map(item=>{
                return Object.assign({},{show:false},item)
              })

              if(vm.detail.orderStatus == 140 || vm.detail.orderStatus == 160){//选择时间
                vm.isshowRemark = '1'
              }else if(vm.detail.orderStatus == 50 || vm.detail.orderStatus == 120 || vm.detail.orderStatus == 350){//补充资料
                vm.isshowRemark = '2'
              }else if(vm.detail.orderStatus == 600 || vm.detail.orderStatus == 610){//补全保单信息
                vm.isshowRemark = '3'
              }else{
                vm.isshowRemark = '0'
              }

              if(vm.detail.nextStatus.length == 0){
                vm.emptyNext = true
              }else{
                vm.emptyNext = false
              }

              vm.ischeck = vm.detail.check
              vm.checkPolicy = data.body.checkPolicy
              
              let day = vm.detail.appointmentTime.substring(0,4)+'-'+vm.detail.appointmentTime.substring(4,6)+'-'+vm.detail.appointmentTime.substring(6,8)
              let hour = vm.detail.appointmentTime.substring(8,10)
              let minites = vm.detail.appointmentTime.substring(10,12)
              // vm.appointmentTime.push(day)
              // vm.appointmentTime.push(hour)
              // vm.appointmentTime.push(minites)
              vm.appointmentTime = day+' ' + hour + ':'+minites
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
  .appointDetail{
      height: 100%;
      background-color: #fff;
      padding-bottom: 4rem;
      padding-top: 45/@r;
      .submitBtn{
        padding:45/@r 60/@r;
        /* position: fixed;
        left: 0;
        right: 0;
        bottom: 0; */
        margin-top: 100/@r;
        background: #fff;
        z-index: 20;
        .default{
          color: #fff;
          background: rgba(228, 228, 228, 1);
          font-size: 46/@r;
        }
        .active{
          color: #fff;
          font-size: 46/@r;
          background: rgba(51, 204, 255, 1);
        }
      }
      .policyName{
        margin: 45/@r 60/@r;
        margin-top: 0;
        background-color: #fff;
        font-size: 48/@r;
        color: #333;
        border:solid 0.5px #ececec;
        min-height: 1.7rem;
        .start;
        padding: 60/@r 15px;
        border-radius: 8px;
      }
      .policyMain{
        margin: 0 60/@r;
        background: #fff;
        border:solid 0.5px #ececec;
        border-radius: 8px;
        box-sizing: border-box;
        .weui-cells{
          margin-top: 0;
          font-size: 14px;
        }
        .main{
          width: 99%;
          margin: 0 auto;
          .weui-cell{
            font-size: 44/@r;
            .vux-cell-bd{
              width: 40%;
              flex: none;
              color: #666;
            }
            .weui-cell__ft{
              color: #000;
            }
            &:before{
              display: none;
            }
          }
        }
        .title{
          color: #000;
          padding: 5px 0;
          padding-left: 15px;
          .start;
          img{
            width: 57/@r;
          }
          span{
            font-size: 44/@r;
            display: inline-block;
            margin-left: 33/@r;
            position: relative;
            font-weight: 600;
            /* &:before{
                content: '';
                width: 84/@r;
                height: 84/@r;
                background: url('./icons/jiben_03.png')center no-repeat;
                display: block;
                position: absolute;
                left: 2px;
                top: 0;
                background-size: 100%;
            } */
            
          }
        }
      }
      .policyStep{
        margin: 55/@r 60/@r;
        background: #fff;
        border:solid 0.5px #ececec;
        border-radius: 8px;
        box-sizing: border-box;
        padding-bottom: 10px;
        .title{
          color: #000;
          padding: 5px 0;
          position: relative;
          padding-left: 15px;
          .start;
          img{
            width: 57/@r;
          }
          span{
            font-size: 44/@r;
            display: inline-block;
            margin-left: 33/@r;
            position: relative;
            font-weight: 600;
            /* &:before{
                content: '';
                width: 84/@r;
                height: 84/@r;
                background: url('./icons/jindu_03.png')center no-repeat;
                display: block;
                position: absolute;
                left: 2px;
                top: 0;
                background-size: 100%;
            } */
          }
          &:after{
            content: " ";
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
            height: 1px;
            border-top: 1px solid #D9D9D9;
            color: #D9D9D9;
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
          }
        }
        .main{
          width: 99%;
          margin: 0 auto;
          .weui-cell{
            font-size: 44/@r;
            .vux-cell-bd{
              width: 40%;
              flex: none;
              color: #666;
            }
            .weui-cell__ft{
              color: #000;
            }
            &:before{
              display: none;
            }
            .vux-datetime-value{
              text-align: center;
              padding-right: 18px;
            }
          }
          .fujia{
            .xinput{
                .weui-input{
                  text-align: right;
                }
              }
          }
          .beizhu{
            textarea{
              text-align: left;
              color: #000;
            }
            .weui-cell__hd{
              width: 40%;
              color: #666;
            }
          }
          .weui-cells{
            margin-top: 0;
            font-size: 14px;
            &:after{
              display: none;
            }
            &:before{
              display: none;
            }
          }
          .rightstate{
            .weui-cell__ft{
              background: #9082cd;
              color: #fff;
              padding: 5/@r 30/@r;
              border-radius: 3px;
            }
          }
          .statesWrap{
            padding: 10px 15px;
            .between;
            flex-wrap: wrap;
            .checkicon{
              font-size: 42/@r;
              color: #333;
              width: 50%;
              margin: 20/@r 0;
              span{
                font-size: 42/@r;
              }
            }
          }
        }
      }
      .bottom-x-button{
        .submitBtn{
          .active{
            height: 130/@r;
            background: #3594ee;
            color: #fff;
            font-size: 50/@r;
          }
        }
      }
      .haswrited{
          margin: 45/@r 60/@r;
          font-size: 44/@r;
          text-align: center;
          color: #ccc;
          .weui-cells{
            margin-top: 0;
            font-size: 44/@r;
          }
        }
  }
</style>
