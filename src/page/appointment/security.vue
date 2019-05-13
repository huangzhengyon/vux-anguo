<template>
  <div class="security">
    <!-- <x-header >已有保障</x-header> -->
    <back options=""></back>
    <div class="securityList">
      <div class="fromgroup">
        <!-- <cell class="from-cell from-cell-dl smallsize" is-link  title="添加已有保障"  @click.native="addSecurity"></cell> -->
        <div class="addbtn" @click="addSecurity">
          <img src="./icons/jiahao_03.png">
          <span>添加已有保障</span>
        </div>
        <div class="addTips">
          <img src="./icons/gantanhao_03.png">
          <span>国内保障不算</span>
        </div>
      </div>
      <div class="listul" v-if="hasnoData">
        <Group class="listform" v-for="(item,key) in securityListData" :key="key">
          <cell :title="item.infoDetailName" @click.native="changeview(item.id)" is-link></cell>
        </Group>          
      </div>
      <div class="nosecurity" v-else>
        <divider>暂无数据，若无请点击下一步</divider>
      </div>
      <div class="poppupWrap" v-transfer-dom>
        <popup  v-model="showAddSecurity" position="left" width="100%">
          <div >
            <div class="pupTitle">
              <span @click="showAddSecurity = false">关闭</span>
            </div>
            <div class="pupbody">              
                <Group class="paramsBox" title="被保人" v-for="(item,key) in addParams" :key="key" v-if="item.name == 'insuredName'">
                  <x-input :title="item.key" v-model="bName" readonly></x-input>
                </Group>
                <Group class="paramsBox"  v-for="(item,key) in addParams" :title="item.key" :key="key" v-if="item.name =='coverage'">
                  <x-input v-for="(jtem,i) in item.option" type="number" :key="i" :title="jtem.key" v-model="jtem.value" placeholder="请输入金额" :readonly="isReadonly"></x-input>
                </Group>
                <Group class="paramsBox"  v-for="(item,key) in addParams" :key="key" v-if="item.name!=='insuredName'&& item.name!=='coverage'&&item.name!=='issueDate'">
                  <x-input :title="item.key" v-model="item.value" :placeholder="`请输入${item.key}`" :readonly="isReadonly"></x-input>
                </Group>
                <Group class="paramsBox"  v-for="(item,key) in addParams" :key="key" v-if="item.name =='issueDate'">
                  <datetime v-model="item.value" start-date="1900-01-01" :readonly="isReadonly" :end-date="nowDate" :title="item.key" placeholder="请选择"></datetime>
                </Group>
                <span class="tips">注：国内保险不算</span>
            </div>
            <box class="savebtn"  v-if="showbotttombtn">
                <x-button   @click.native="addSec">确定</x-button>
            </box>
            <box class="savebtn"  v-else>
                <x-button   @click.native="changeSec">修改</x-button>
            </box>
          </div>
        </popup>
      </div>
    </div>
    <box class="nextstepbtn" @click.native="gotoAnswerList">
      <x-button >下一步</x-button>
    </box>
  </div>
</template>

<script>
import _ from 'lodash'
import {Group,Box, Cell,Search,PopupPicker,Divider,XInput,XButton,Step, StepItem,TransferDom,Popup,Datetime,FormPreview } from 'vux'

export default {
  directives: {
    TransferDom
  },
  components: {
    Group,
    Cell,
    PopupPicker,
    Divider,
    Box,
    XInput,
    XButton,
    Step, StepItem,
    Popup,
    Datetime,
    FormPreview 
  },
  data () {
    return {
      appiontStep1:1,//预约步骤
      orderNo:'',//订单号
      customerId:'',//被保人Id
      chineseName:'',//被保人姓名
      bName:'',//被保人姓名
      cName:'',//投保人姓名
      statusCode:'',//订单状态码
      hasnoData:false,//是否有保障列表数据
      showAddSecurity:false,//是否显示添加已有保障
      addParams:[],//添加已有保障需要填写的参数
      endDate:'',//开始时间
      nowDate:'',//现在时间
      securityListData:[],//已有保障列表
      ListData:[],//formpreview
      showbotttombtn:true,//是否显示底部按钮
      isReadonly:false,//是否可以修改
      showchangebtn:false,//修改按钮
      changeId:'',//修改时的ID
      orderNumber:'',//序号
    }
  },
  mounted(){
    let vm = this 
    vm.orderNo = vm.$route.query.orderNo
    vm.customerId = vm.$route.query.customerId
    vm.statusCode = vm.$route.query.statusCode
    vm.cName = vm.$route.query.cname
    vm.bName = vm.$route.query.bname
    vm.productId =  vm.$route.query.product
    vm.getSecurityList()
    vm.$hideShare()
  },
  methods:{
    gotoAnswerList(){//下一步填写问卷
      let vm = this 
      vm.$router.push({path:'./questionnaire',query:{orderNo:vm.orderNo,customerId:vm.customerId,statusCode:vm.statusCode,cname:vm.cName,bname:vm.bName,product:vm.productId}})
    },
    changeview(id){//展示修改修
      let vm = this
      let result ;
      vm.changeId = id 
      vm.securityListData.forEach(item=>{
        if(item.id == id){
          result = item 
          vm.orderNumber = item.orderNumber
        }
      })
      let obj = {
          servicePath:'KINGWORKS_001_006_001',
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
            vm.addParams = body.showInfoTitleList
            vm.addParams.forEach(item=>{
              for(let key in result){
                if(item.option.length > 0){
                  item.option.forEach(jtem=>{
                    if(jtem.name == key){
                      jtem.value = result[key]
                    }
                  })
                }else{
                  if(item.name == key){
                    item.value = result[key]
                  }
                }
              }
            })
            vm.showAddSecurity = true 
            vm.showchangebtn = true
            vm.showbotttombtn = false 
            vm.isReadonly = false
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
    changeSec(){//修改保障内容
      let vm = this 
      
      let insuranceCompany,
          lifeInsurance,
          InjuriesIncome,
          seriousIllness,
          personalAccident,
          medicalHospital,
          issueDate,
          premium;
      vm.addParams.map(item=>{
        if(item.name == 'premium'){
          premium = item.value
        }else if(item.name == 'issueDate'){
          issueDate = item.value 
        }else if(item.name == 'insuranceCompany'){
          insuranceCompany = item.value 
        }else if(item.name == 'coverage'){
          item.option.map(jtem=>{
            if(jtem.name == 'lifeInsurance'){
              lifeInsurance = jtem.value
            }else if(jtem.name == 'InjuriesIncome'){
              InjuriesIncome = jtem.value
            }else if(jtem.name == 'seriousIllness'){
              seriousIllness = jtem.value 
            }else if(jtem.name == 'personalAccident'){
              personalAccident = jtem.value
            }else if(jtem.name == 'medicalHospital'){
              medicalHospital = jtem.value
            }
          })
        }
      })

      if(insuranceCompany == ''){
        vm.$toast('请填写承保公司')
        return
      }
      if(premium == ''){
        vm.$toast('请填写保费')
        return 
      }

      let obj = {
          servicePath:'KINGWORKS_001_006_004',
          jsonData: {
             id:vm.changeId,
             orderNo:vm.orderNo,
             customerId:vm.customerId,
             orderNumber:vm.orderNumber,
             insuranceCompany:insuranceCompany,
             lifeInsurance:lifeInsurance,
             injuriesIncome:InjuriesIncome,
             seriousIllness:seriousIllness,
             personalAccident:personalAccident,
             medicalHospital:medicalHospital,
             issueDate:issueDate,
             premium:premium
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
              vm.showAddSecurity = false
              vm.getSecurityList() 
              vm.$hideModel()
            },1000)
            
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
    addSec(){//添加已有保障
      let vm = this 
      let len = vm.securityListData.length + 1;
      let insuranceCompany,
          lifeInsurance,
          InjuriesIncome,
          seriousIllness,
          personalAccident,
          medicalHospital,
          issueDate,
          premium;
      vm.addParams.map(item=>{
        if(item.name == 'premium'){
          premium = item.value
        }else if(item.name == 'issueDate'){
          issueDate = item.value 
        }else if(item.name == 'insuranceCompany'){
          insuranceCompany = item.value 
        }else if(item.name == 'coverage'){
          item.option.map(jtem=>{
            if(jtem.name == 'lifeInsurance'){
              lifeInsurance = jtem.value
            }else if(jtem.name == 'InjuriesIncome'){
              InjuriesIncome = jtem.value
            }else if(jtem.name == 'seriousIllness'){
              seriousIllness = jtem.value 
            }else if(jtem.name == 'personalAccident'){
              personalAccident = jtem.value
            }else if(jtem.name == 'medicalHospital'){
              medicalHospital = jtem.value
            }
          })
        }
      })

      if(insuranceCompany == ''){
        vm.$toast('请填写承保公司')
        return
      }
      if(premium == ''){
        vm.$toast('请填写保费')
        return 
      }

      let obj = {
          servicePath:'KINGWORKS_001_006_003',
          jsonData: {
             orderNo:vm.orderNo,
             customerId:vm.customerId,
             orderNumber:len,
             insuranceCompany:insuranceCompany,
             lifeInsurance:lifeInsurance,
             injuriesIncome:InjuriesIncome,
             seriousIllness:seriousIllness,
             personalAccident:personalAccident,
             medicalHospital:medicalHospital,
             issueDate:issueDate,
             premium:premium
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
              vm.showAddSecurity = false
              vm.getSecurityList() 
              vm.$hideModel()
            },1000)
            
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
    addSecurity(){//保障获取参数
      let vm = this 
      let obj = {
          servicePath:'KINGWORKS_001_006_001',
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
            vm.addParams = body.showInfoTitleList
            vm.showAddSecurity = true 
            vm.showbotttombtn = true 


            let now = new Date()
            let eyear = now.getFullYear() + 10
            let cmonth = now.getMonth() + 1
            let day = now.getDate()
            if (cmonth < 10) cmonth = '0' + cmonth
            if (day < 10) day = '0' + day
            vm.nowDate = now.getFullYear() + '-' + cmonth + '-' + day
            vm.endDate = eyear + '-' + cmonth + '-' + day
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
    getSecurityList(){//获取已有保障列表
      let vm = this 
      let obj = {
          servicePath:'KINGWORKS_001_006_002',
          jsonData: {
             orderNo:vm.orderNo,
             customerId:vm.customerId
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
            if(body.infoDetailList.length > 0 ){
              vm.hasnoData = true 
              vm.securityListData = body.infoDetailList.map(item=>{
                let arr = new Array()
                let name ;
                for(let key in item){
                  if(key == 'insuranceCompany'){
                    name = '承保公司'
                    arr.push({label:name,value:item[key]})
                  }else if(key == 'lifeInsurance'){
                    name = '人寿'
                    arr.push({label:name,value:item[key]})
                  }else if(key == 'injuriesIncome'){
                    name = '伤病入息'
                    arr.push({label:name,value:item[key]})
                  }else if(key == 'seriousIllness'){
                    name = '严重疾病'
                    arr.push({label:name,value:item[key]})
                  }else if(key == 'personalAccident'){
                    name = '个人意外'
                    arr.push({label:name,value:item[key]})
                  }else if(key == 'medicalHospital'){
                    name = '医疗/住院'
                    arr.push({label:name,value:item[key]})
                  }else if(key == 'issueDate'){
                    name = '签发日'
                    arr.push({label:name,value:item[key]})
                  }else if(key == 'premium'){
                    name = '保费'
                    arr.push({label:name,value:item[key]})
                  }
                }
                return Object.assign({},{option:arr},item)
              })

            }else{
              vm.hasnoData = false
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
    }
  }
}
</script>

<style lang="less">
  @import "../../assets/css/comm";
  body{margin: 0;}
  .poppupWrap{
    .vux-popup-dialog{
      z-index: 505;
      padding-bottom: 3rem;
      .pupTitle{
        background-color: #fff;
        padding: 8px 15px;
        position: relative;
        line-height: 1;
        .start;
        span{
          font-size: 42/@r;
          color: #3594ee;
          padding: 8px;
        }
        .spanTitle{
          font-size: 48/@r;
          color: #fff;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%);
        }
      }
      .pupbody{
        .tips{
          font-size: 40/@r;
          color: #666;
          margin: 0 15px;
        }
      }
      .savebtn{
        /* position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3rem;
        z-index: 11; */
        padding: 15px 10px;
        .weui-btn{
          font-size: 44/@r;
          background: #3594ee;
          color: #fff;
          height: 120/@r;
          line-height: 1;
        }
      }
      .paramsBox{
        background: #fff;
        margin:15px 10px;
        border-radius: 5px;
        .weui-cells__title{
          display: inline-block;
          color: #000;
          width: 100%;
          font-size: 44/@r;
          padding: 10px 15px;
          margin: 0;
        }
        .weui-cells{
          font-size: 40/@r;
          .weui-cell{
            padding: 12px 15px;
          }
          .weui-input{
            text-align: right;
          }
        }
      }
    }
  }
  .security{
    padding-bottom: 2rem;
    background: #ececec;
    min-height: 100%;
    .step2{
      padding: 90/@r 60/@r;
      .stepbox{
        font-size: 42/@r;
        .vux-step-item-title{
          font-size: 42/@r;
        }
      }
    }
    
    .nextstepbtn{
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      background: #fff;
      padding: 30/@r;
      z-index: 11;
      .weui-btn{
        border-radius: 3px 3px 0 0;
        font-size: 48/@r!important;
        background: #3594ee;
        color: #fff;
        height: 120/@r;
        line-height: 1;
        /* height: 149/@r; */
        font-size: 54/@r;
      }
    }
    .securityList{
        .listul{
          padding-bottom: 139/@r;
          font-size: 46/@r;
          .weui-cells{
            margin-top: 0;
            &:before{
              display: none;
            }
          }
        }
        .nosecurity{
          width: 80%;
          min-height: 8rem;
          margin: 0 auto;
          font-size: 40/@r;
          .center;
        }
        .fromgroup{
          .addbtn{
            .center;
            background: #fff;
            padding: 30/@r 0;
            position: relative;
            &:after{
                content: " ";
                position: absolute;
                left: 0;
                bottom: 0px;
                right: 0;
                height: 1px;
                border-bottom: 1px solid #D9D9D9;
                color: #D9D9D9;
                -webkit-transform-origin: 0 100%;
                transform-origin: 0 100%;
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
            }
            img{
              width: 70/@r;
            }
            span{
              color: #337fcc;
              font-size: 48/@r;
              padding: 0 10px;
            }
          }
          .addTips{
            .start;
            background: #fff;
            padding: 30/@r 15px;
            position: relative;
            &:after{
                content: " ";
                position: absolute;
                left: 0;
                bottom: 0px;
                right: 0;
                height: 1px;
                border-bottom: 1px solid #D9D9D9;
                color: #D9D9D9;
                -webkit-transform-origin: 0 100%;
                transform-origin: 0 100%;
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
            }
            img{
              width: 1rem;
            }
            span{
              color: #337fcc;
              font-size: 48/@r;
              padding: 0 10px;
            }
          }
        }

    }
  }
</style>
