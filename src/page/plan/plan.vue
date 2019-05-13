<template>
  <div class="plan">
    <!-- <x-header >创建计划书</x-header> -->
    <back options=""></back>
    <div class="main">
      <div class="proTitle">
        <span>{{proInfo.productName}}</span>
      </div>
      <div class="policyBox">
          <Group class="fromgroup selfbtn" title="投保人信息">
              <x-switch class="from-cell " title="为自己投保" v-model="isBuyself" @on-change="changePtype"></x-switch>
          </Group>
          <div class="policyitem" v-show="!isBuyself">
              <Group class="fromgroup">
                <x-input title="投保人姓名" v-model="policyHolder.name" placeholder="填写姓名"></x-input>
              </Group>
              <div class="birthInput">
                <cell-box class="cellBox">
                  <div class="writeInput">
                    <span>投保人年龄</span>
                    <input  type="number" @keyup="changewritet" v-model="policyHolder.age" placeholder="填写年龄"></input>
                  </div>
                  
                  <datetime v-model="policyHolder.birth" @on-change="changetbbirth" start-date="1900-01-01" :end-date="nowDate" class="sss" :placeholder="policyHolder.birth==''?'选择':policyHolder.birth"></datetime>
                </cell-box>
              </div>
              <div class="checkIcon custom">
                <span>投保人性别</span>
                <div class="checkIcon">
                    <check-icon :value="policyHolder.sex" type="plain" @click.native="changetbsex('1')">男</check-icon>
                    <check-icon :value="!policyHolder.sex" type="plain" @click.native="changetbsex('1')">女</check-icon>
                </div>
              </div>
              <Group class="fromgroup">
                <popup-radio title="投保人国籍" :options="policyHolder.nationalityOption" v-model="policyHolder.nationality"  :placeholder="policyHolder.nationalityOption[0].value"></popup-radio>
              </Group>
              <Group class="fromgroup">
                <popup-radio title="投保人居住地" :options="policyHolder.nationalityOption" v-model="policyHolder.tolive"  :placeholder="policyHolder.nationalityOption[0].value"></popup-radio>
              </Group>
              </Group>
              <div class="checkIcon custom">
                <span>投保人是否吸烟</span>
                <div class="checkIcon">
                    <check-icon :value="policyHolder.issomking" type="plain" @click.native="changetbsmk('1')">是</check-icon>
                    <check-icon :value="!policyHolder.issomking" type="plain" @click.native="changetbsmk('1')">否</check-icon>
                </div>
              </div>
          </div>
      </div>
      <div class="policyBox">
          <Group class="fromgroup selfbtn" title="被保人信息">
          </Group>
          <Group class="fromgroup">
            <x-input title="被保人姓名" v-model="policyInsured.name" placeholder="填写姓名"></x-input>
          </Group>
          <div class="birthInput">
            <cell-box class="cellBox">
              <!-- <x-input title="被保人年龄" type="number" @on-change="changewriteb" v-model="policyInsured.age" placeholder="填写年龄"></x-input> -->
              <div class="writeInput">
                <span>被保人年龄</span>
                <input  type="number" @keyup="changewriteb" v-model="policyInsured.age" placeholder="填写年龄"></input>
              </div>
              <datetime v-model="policyInsured.birth" @on-change="changebbbirth" start-date="1900-01-01" :end-date="nowDate" class="sss" :placeholder="policyInsured.birth==''?'选择':policyInsured.birth"></datetime>
            </cell-box>
          </div>
          <div class="checkIcon custom">
            <span>被保人性别</span>
            <div class="checkIcon">
                <check-icon :value="policyInsured.sex" type="plain" @click.native="changetbsex('2')">男</check-icon>
                <check-icon :value="!policyInsured.sex" type="plain" @click.native="changetbsex('2')">女</check-icon>
            </div>
          </div>
          <Group class="fromgroup">
            <popup-radio title="被保人国籍" :options="policyInsured.nationalityOption" v-model="policyInsured.nationality"  :placeholder="policyInsured.nationalityOption[0].value"></popup-radio>
          </Group>
          <Group class="fromgroup">
            <popup-radio title="被保人居住地" :options="policyInsured.nationalityOption" v-model="policyInsured.tolive"  :placeholder="policyInsured.nationalityOption[0].value"></popup-radio>
          </Group>
          <div class="checkIcon custom">
            <span>被保人是否吸烟</span>
            <div class="checkIcon">
                <check-icon :value="policyInsured.issomking" type="plain" @click.native="changetbsmk('2')">是</check-icon>
                <check-icon :value="!policyInsured.issomking" type="plain" @click.native="changetbsmk('2')">否</check-icon>
            </div>
          </div>
      </div>
      <div class="checkIcon custom">
        <span class="custiomspan">是否回溯</span>
        <div class="checkIcon">
            <check-icon :value="ishuisu" type="plain" @click.native="changehuisu">是</check-icon>
            <check-icon :value="!ishuisu" type="plain" @click.native="changehuisu">否</check-icon>
        </div>
      </div>
      <group class="fromgroup xgroup">
        <x-switch class="from-cell" title="是否添加附加险" v-model="isAdditional" @on-change="changeAdtType"></x-switch>
        <div class="addtionnalBox smallsize" v-show="isAdditional">
          <checklist  required :options="addtionnalList" v-model="checkAddtionnalList" @on-change="changeAddtion"></checklist>
        </div>
      </group>
      <group class="fromgroup">
        <div class="popupWrap" v-if="timeLimitType">
          <popup-radio title="缴费期限" :options="TimeLimit" v-model="checkedTime"  :placeholder="TimeLimit[0]"></popup-radio>
        </div>
        <div class="checkiconWrap" v-else>
          <div class="title"><span>缴费期限</span></div>
          <checker
          v-model="checkedTime"
          default-item-class="demo5-item"
          selected-item-class="demo5-item-selected"
          >
            <checker-item v-for="(item,key) in TimeLimit" :key="key" :value="item">{{item}}</checker-item>
          </checker>
        </div>        
      </group>
      <group class="fromgroup">
        <popup-radio :title="`${textType}币种`" :options="currency" v-model="checkedmyTye"  :placeholder="defaultmyType"></popup-radio>
      </group>
      <div class="inputFrom">
        <div class="fromtitle">
          <span>{{textType}}</span>
        </div>
        <div class="frominput">
            <input v-model="forehead" type="number" :placeholder="`请填入${payMin} - ${payMax}`"/>
        </div>
      </div>
      <div class="inputFrom">
        <div class="fromtitle">
          <span>{{premiumYearText}}</span>
        </div>
        <div class="frominput">
            <input v-model="premiumYear" type="number" :placeholder="`请填写${premiumYearText}`"/>
        </div>
      </div>
    </div>
    <box class="crtBtn" @click.native="createPlan">
        <x-button>生成计划书</x-button>
    </box>
  </div>
</template>

<script>
import {Group,Divider,Cell,CellBox,Popup,XButton,Box,TransferDom,XSwitch,Checklist,PopupRadio,XInput,PopupPicker,Datetime,CheckIcon,Checker, CheckerItem} from 'vux'


export default {
  directives: {
    TransferDom
  },
  components: {
    Group,
    Cell,
    PopupPicker,
    XButton,
    Box,
    Popup,
    XSwitch,
    Checklist,
    PopupRadio,
    XInput,
    Datetime,
    CheckIcon,CellBox,
    Checker, CheckerItem,
    Divider  
  },
  data () {
    return {
      proInfo:'',//产品相关信息,名称/id/类型/公司
      isAdditional:false,//是否添加附加险
      isBuyself:false,//是否为本人投保
      addtionnalList:[],//附加险集合
      checkAddtionnalList:[],//选中的附加险
      currency:[],//币种列表
      TimeLimit:[],//期限
      checkedTime:'',
      checkedmyTye:'',
      defaultmyType:'',//默认币种
      addtionnalSureId:[],//附加险ID数组
      ishuisu:false,//是否回溯
      forehead:'',//年缴保额或者保费

      productRelationList:[],//附加险相关信息，期限，保额(最大值/最小值)
      payMin:'',//对应期限的最小值
      payMax:'',//对应期限的最大值
      nowDate:'',//当前时间
      timeLimitType:false,//显示选择缴费期限的格式 popup或check
      policyHolder:{
        name:'',
        age:'',
        sex:false,
        birth:'',
        nationality:'',
        nationalityOption:[{key:1,value:'中国内地'},{key:2,value:'中国香港'}],
        tolive:'',
        issomking:false
      },//投保人信息
      policyInsured:{
        name:'',
        sex:false,
        age:'',
        birth:'',
        nationality:'',
        nationalityOption:[{key:1,value:'中国内地'},{key:2,value:'中国香港'}],
        tolive:'',
        issomking:false
      },//被保人信息
      textType:'',//保额还是保费
      ishuisu:false,//是否回溯
      premiumYear:'',//年缴保费or保额
      premiumYearText:'',//年缴保费or保额title
    }
  },
  mounted(){
    let vm = this 
    let prodetail = vm.$utils.sessionStorage.getItem('product')
    vm.proInfo = JSON.parse(prodetail)
    vm.premiumYearText = vm.proInfo.typeCId == 'seriousIllness'?'年缴保费':'保额'
    vm.getAdditional()
    vm.getmyType()
    let now = new Date()
    let cmonth = now.getMonth() + 1
    let day = now.getDate()
    if (cmonth < 10) cmonth = '0' + cmonth
    if (day < 10) day = '0' + day
    vm.nowDate = now.getFullYear() + '-' + cmonth + '-' + day
    vm.$hideShare()
  },
  filters:{
    
  },
  methods:{
    changehuisu(){//是否回溯
      let vm = this 
      vm.ishuisu = !vm.ishuisu
    },
    createPlan(){//生成计划书
      let vm = this 
      let obj;
      if(vm.isBuyself == true){
        if(vm.policyInsured.name == ''){
          vm.$toast('请填写姓名')
          return 
        }else if(vm.policyInsured.birth == ''){
          vm.$toast('请选择生日')
          return 
        }else if(vm.policyInsured.nationality == ''){
          vm.$toast('请选择国籍')
          return
        }else if(vm.policyInsured.tolive == ''){
          vm.$toast('请选择居住地')
          return 
        }else if(vm.checkedTime == ''){
          vm.$toast('请选择续费期限')
          return 
        }else if(vm.checkedmyTye == ''){
          vm.$toast('请选择币种')
          return 
        }else if(vm.forehead == '' || Number(vm.forehead) > vm.payMax || Number(vm.forehead) < vm.payMin){
          vm.$toast(`请填写${vm.payMin}和${vm.payMax}之间数值的${vm.textType}`)
          return 
        }
        let sectp,smktype,recall ;
        sectp = vm.policyInsured.sex == false ? 2 : 1;
        smktype = vm.policyInsured.issomking == false ? 1 : 0;
        recall = vm.ishuisu == false ? 1 : 0 ;
        obj = {
          servicePath:'KINGWORKS_002_001_003',
          jsonData: {
              productId:vm.proInfo.productId,
              typeCId:vm.proInfo.typeCId,
              paymentTerm:vm.checkedTime,
              coverageCurrencyCode:vm.checkedmyTye,
              coverage:vm.forehead,
              extraneousRiskArray:vm.checkAddtionnalList,
              isInsure:0,
              insuredName:vm.policyInsured.name,
              insuredBirth:vm.policyInsured.birth,
              insuredSex:sectp,
              insuredNationality:vm.policyInsured.nationality,
              insuredPlaceAbode:vm.policyInsured.tolive,
              insuredSmokeHabit:smktype,
              recall:recall,
              premiumYear:vm.premiumYear
          }
        }
      }else{
        if(vm.policyHolder.name == ''){
          vm.$toast('请填写投保人姓名')
          return 
        }else if(vm.policyHolder.birth == ''){
          vm.$toast('请选择投保人生日')
          return 
        }else if(vm.policyHolder.nationality == ''){
          vm.$toast('请选择投保人国籍')
          return
        }else if(vm.policyHolder.tolive == ''){
          vm.$toast('请选择投保人居住地')
          return 
        }else if(vm.policyInsured.name == ''){
          vm.$toast('请填写被保人姓名')
          return 
        }else if(vm.policyInsured.birth == ''){
          vm.$toast('请选择被保人生日')
          return 
        }else if(vm.policyInsured.nationality == ''){
          vm.$toast('请选择被保人国籍')
          return
        }else if(vm.policyInsured.tolive == ''){
          vm.$toast('请选择被保人居住地')
          return 
        }else if(vm.checkedTime == ''){
          vm.$toast('请选择续费期限')
          return 
        }else if(vm.checkedmyTye == ''){
          vm.$toast('请选择币种')
          return 
        }else if(vm.forehead == '' || Number(vm.forehead) > vm.payMax || Number(vm.forehead) < vm.payMin){
          vm.$toast(`请填写${vm.payMin}和${vm.payMax}之间数值的${vm.textType}`)
          return
        }
        let sectp,smktype,sectp2,smktype2;
        sectp = vm.policyInsured.sex == false ? 2 : 1;
        smktype = vm.policyInsured.issomking == false ? 1 : 0;
        sectp2 = vm.policyHolder.sex == false ? 2 : 1;
        smktype2 = vm.policyHolder.issomking == false ? 1 : 0;

        obj = {
          servicePath:'KINGWORKS_002_001_003',
          jsonData: {
              productId:vm.proInfo.productId,
              typeCId:vm.proInfo.typeCId,
              paymentTerm:vm.checkedTime,
              coverageCurrencyCode:vm.checkedmyTye,
              coverage:vm.forehead,
              extraneousRiskArray:vm.checkAddtionnalList,
              isInsure:1,
              insuredName:vm.policyInsured.name,
              insuredBirth:vm.policyInsured.birth,
              insuredSex:sectp,
              insuredNationality:vm.policyInsured.nationality,
              insuredPlaceAbode:vm.policyInsured.tolive,
              insuredSmokeHabit:smktype,
              applicantName:vm.policyHolder.name,
              applicantBirth:vm.policyHolder.birth,
              applicantSex:sectp2,
              applicantNationality:vm.policyHolder.nationality,
              applicantPlaceAbode:vm.policyHolder.tolive,
              applicantSmokeHabit:smktype2,
              premiumYear:vm.premiumYear
          }
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
            setTimeout(()=>{
              vm.$router.push({path:'./myplan'})
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
    },
    changetbbirth(val){//修改投保人年龄
      let vm = this 
      let resultarr = val.split('-')
      let now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth()+1
      let resultage = year - resultarr[0]
      vm.policyHolder.age = resultage
      vm.policyHolder.birth = val
    },
    changewritet(){//修改投保人年龄
      let vm = this
      let now = new Date()
      let year = now.getFullYear()
      let result =  year - 1900
      if(vm.policyHolder.age > result){
        vm.$toast('亲，您真是寿比南山，日历被限制了哦！')
      }else{
        let birthyear = year - vm.policyHolder.age
        if(vm.policyHolder.birth !== ''){
          let oldnum = vm.policyHolder.birth.split('-')
          vm.policyHolder.birth = birthyear+'-'+oldnum[1]+'-'+oldnum[2]
        }else{
          vm.policyHolder.birth = birthyear+'-01-01'
        }
      }      
    },
    changewriteb(){//修改被保人年龄
        let vm = this
        let now = new Date()
        let year = now.getFullYear()
        let result =  year - 1900
        if(vm.policyInsured.age > result){
          vm.$toast('亲，您真是寿比南山，日历被限制了哦！')
        }else{
          let birthyear = year - vm.policyInsured.age
          if(vm.policyInsured.birth !== ''){
            let oldnum = vm.policyInsured.birth.split('-')
            vm.policyInsured.birth = birthyear+'-'+oldnum[1]+'-'+oldnum[2]
          }else{
            vm.policyInsured.birth = birthyear+'-01-01'
          }
        }
    },
    changebbbirth(val){//修改被保人年龄
      let vm = this 
      let resultarr = val.split('-')
      let now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth()+1
      let resultage = year - resultarr[0]
      vm.policyInsured.age = resultage
      vm.policyInsured.birth = val
    },
    changetbsex(str){//修改性别
      let vm = this
      if(str == '1'){
        vm.policyHolder.sex = !vm.policyHolder.sex
      }else if(str == '2'){
        vm.policyInsured.sex = !vm.policyInsured.sex
      } 
    },
    changetbsmk(str){//修改是否吸烟
      let vm = this 
      if(str == '1'){
        vm.policyHolder.issomking = !vm.policyHolder.issomking
      }else if(str == '2'){
        vm.policyInsured.issomking = !vm.policyInsured.issomking
      }
    },
    changehuisu(){//改变是否回溯
      let vm = this 
      vm.ishuisu = !vm.ishuisu
    },
    getAdditional(){//获取附加险列表
      let vm = this 
      let obj = {
        servicePath:'KINGWORKS_001_003_001',
        jsonData: {
          productId:vm.proInfo.productId
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
            vm.addtionnalList = body.extraneousRiskList.map(item=>{
              return Object.assign({},{value:item.extrName,key:item.extrId})
            })
            vm.productRelationList = body.productRelationList
            if(vm.productRelationList.length > 2){
              vm.timeLimitType = true
            }else{
              vm.timeLimitType = false 
            }
            vm.TimeLimit = body.productRelationList.map(item=>{
              return item.paymentTerm
            })
            vm.payMax = vm.productRelationList[0].payMax
            vm.payMin = vm.productRelationList[0].payMin
            vm.checkedTime = vm.productRelationList[0].paymentTerm
            vm.textType = body.textType
            
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
    getmyType(){//获取币种列表
      let vm = this 
      let obj = {
        servicePath:'KINGWORKS_001_004_001',
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
            vm.currency = body.currencyList.map(item=>{
              return Object.assign({},{value:item.currencyName,key:item.currencyCode})
            })

            vm.policyHolder.nationalityOption = body.nationalityList.map(item=>{
              return Object.assign({},{key:item.nationalityCode,value:item.nationalityName})
            })
            vm.policyHolder.nationality = vm.policyHolder.nationalityOption[0].key
            vm.policyHolder.tolive = vm.policyHolder.nationalityOption[0].key

            vm.policyInsured.nationalityOption = body.nationalityList.map(item=>{
              return Object.assign({},{key:item.nationalityCode,value:item.nationalityName})
            })

            vm.policyInsured.nationality = vm.policyInsured.nationalityOption[0].key
            vm.policyInsured.tolive = vm.policyInsured.nationalityOption[0].key

            vm.defaultmyType = vm.currency[0].value
            vm.checkedmyTye = vm.currency[0].key
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
    changePtype(){//是否为自己购买保险
      let vm = this 
      console.log(vm.isBuyself)
    },
    changeAdtType(){//是否添加附加险
      let vm = this 
      
      if(vm.isAdditional == true){
        vm.addtionnalSureId = new Array()
        if(vm.addtionnalList.length == 0){
          setTimeout(()=>{
            vm.isAdditional = false
          },500)
          vm.$toast('该产品无附加险')
        }
      }else{
        vm.addtionnalSureId = vm.checkAddtionnalList
      }
    },
    changeAddtion(){//改变选中的附加险
      let vm = this 
      vm.addtionnalSureId = vm.checkAddtionnalList
    }
  }
}
</script>

<style lang="less">
  @import "../../assets/css/comm";
  body{margin: 0;}
  .vux-popup-bottom{
    font-size: 46/@r;
    color: #333;
  }
  .plan{
    background-color: #ececec;
    padding-bottom: 170/@r;
    .main{
      width: 100%;
      padding: 60/@r 10px;
      .inputFrom{
        background: #fff;
        margin-top: 0.87rem;
        padding: 35/@r 10px;
        .between;
        font-size: 48/@r;
        .fromtitle{
          line-height: 1;
        }
        .frominput{
          line-height: 1;
          input{
            font-size: 48/@r;
            text-align: right;
          }
        }
      }
      .policyBox{
        margin-top: 0.77rem;
        .birthInput{
          .writeInput{
            border-right: solid 1px #D9D9D9;
            flex: 2;
            .between;
            span{
              flex: 1;
              width: 4rem;
            }
            input{
              text-align: right;
              flex: 1;
              width: 4rem;
              padding-right: 10px;
              font-size: 48/@r;
            }
          }
          &:after{
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
          position: relative;
          .between;
          background: #fff;
          .cellBox{
            padding: 30/@r 10px;
            font-size: 48/@r;
            width: 100%;
            .vux-x-input{
              flex: 2;
              .weui-cell__bd{
                .weui-input{
                  text-align: right;
                  border-right: solid 1px #ececec;
                  padding-right: 15px;
                }
              }
            }
            .vux-datetime{
              flex: 1;
              &:before{
                display: none;
              }
            }
            .weui-cell{
              padding: 0;
            }
          }
        }
        .custom{
            .between;
            font-size: 48/@r;
            background: #fff;
            padding: 30/@r 10px;
            margin-top: 0;
          }
        .fromgroup{
          .weui-cells{
            margin-top: 0!important;
            &:after{
              // display: none;
            }
          }
        }
      }
      .proTitle{
        background: #fff;
        border:solid 1px #fff;
        border-radius: 4px;
        padding: 6px 10px;
        overflow: hidden;
        .center;
        span{
          width: 100%;
          display: inline-block;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          font-size: 54/@r;
          color: #005189;
        }
      }
      .fromgroup{
        .weui-cells__title{
          color: #000;
          font-size: 48/@r;
          font-weight: 600;
          background: #fff;
          margin-bottom: 0;
          padding: 30/@r 10px;
        }
        .weui-cells{
          font-size: 48/@r;
          border:none;
          border-radius: 5px;
        }
        .weui-cell{
          padding: 35/@r 10px;
        }
        .weui-input{
          text-align: right;
        }
        .vux-cell-placeholder,.vux-cell-value{color: #333;}
        .demo5-item {
          width: 60px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          border-radius: 3px;
          border: 1px solid #ccc;
          background-color: #fff;
          margin-right: 6px;
        }
        .demo5-item-selected {
          background: #ffffff url(./icons/active_check.png) no-repeat right bottom;
          border-color: #ff4a00;
        }
        .checkiconWrap{
          padding: 7px 10px;
          .between;
        }
      }
      .selfbtn{
        .vux-no-group-title{
          .between;
        }
        .weui-switch{
            width: 37px;
            &::before{
              width: 35px!important;
            }
          }
      }
      .from-cell-dl{
        font-size: 44/@r;
        background: #dedede;
        border-radius: 0;
      }
      .emptyInfo{
        color: #bc5a03;
      }
      .xgroup{
        .weui-switch{
            width: 37px;
            &::before{
              width: 35px!important;
            }
          }
        .addtionnalBox{
          p{
            font-size: 42/@r!important;
          }
        }
      }
      .specail{
        position: relative;
        margin-top: 0.77rem;

        .weui-cells__title{
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          padding-left:10px;
          margin-top:7px;
          color: #333;
          font-size: 48/@r;
        }
        .weui-cell__bd{
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }
      }
      .custom{
        .between;
        font-size: 48/@r;
        background: #fff;
        padding: 30/@r 10px;
        margin-top: 0.77rem;
        border-radius: 3px;
        .custiomspan{
          color: #000;
          font-weight: 600;
        }
      }
    }
    .crtBtn{
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 30/@r 10px;
      background: #fff;
      z-index: 11;
      button{
        height: 120/@r;
        line-height: 1;
        background: #3594ee;
        color: #fff;
        font-size: 54/@r;
      }
    }
  }
</style>
