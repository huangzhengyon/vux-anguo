<template>
  <div class="questionnaire">
    <!-- <x-header >健康问卷</x-header> -->
    <back options=""></back>
    <div class="questionlist" v-if="showtbAnswer">
        <div class="questionMain">
          <div class="questionBelong">
            <span>投保人健康信息问卷_({{cName}})</span>
            <span class="emspan">(请如实填写)</span>
          </div>
          <dl class="questionlist" v-for="(item,key) in questionData" :key="key">
            <dt>
              <div class="questionArrayTitle">{{item.groupName}}：</div>
            </dt>
            <dd>
              <ul>
                <li v-for="(jtem,i) in item.questionArray" :key="i" :id="jtem.questionId">
                  <div class="questionText">
                    <span class="redx" v-if="jtem.isRequired">*</span>
                    <span>{{jtem.orderNumber}}.</span>
                    {{jtem.questionContent}}
                  </div>
                  <div class="questionAnswers">
                    <div class="answerlist" v-for="(ktem,index) in jtem.detailArray" :key="index">
                        <check-icon :value="ktem.show" type="plain" @click.native="answerOne(jtem.questionId,ktem.detailName,jtem.orderNumber)"><span v-if="ktem.detailName!=='0'&&ktem.detailName!=='1'">{{ktem.detailName}}.</span>{{ktem.detailContent}}</check-icon>
                    </div>
                    <group v-show="jtem.haddetail == true ">
                      <x-textarea :max="100" @on-blur="changeDetail(jtem.questionId,'0',jtem.orderNumber,jtem.questionDetail)" v-model="jtem.questionDetail" :placeholder="jtem.placeholder"></x-textarea>
                    </group>
                  </div>
                </li>
              </ul>
            </dd>
          </dl>
          <box class="nextstepbtn">
            <x-button  @click.native="gotoInsuredAnswer">下一页</x-button>
          </box>
        </div>
    </div>
    <div class="questionlist" v-else>
        <div class="questionMain">
          <div class="questionBelong">
            <span>被保人健康信息问卷_({{bName}})</span>
            <span class="emspan">(请如实填写)</span>
          </div>
          <dl class="questionlist" v-for="(item,key) in questionData2" :key="key">
            <dt>
              <div class="questionArrayTitle">{{item.groupName}}：</div>
            </dt>
            <dd>
              <ul>
                <li v-for="(jtem,j) in item.questionArray" :key="j" :id="jtem.questionId">
                  <div class="questionText">
                    <span class="redx" v-if="jtem.isRequired">*</span>
                    <span>{{jtem.orderNumber}}.</span>
                    {{jtem.questionContent}}
                  </div>
                  <div class="questionAnswers">
                    <div class="answerlist" v-for="(ktem,index) in jtem.detailArray" :key="index">
                        <check-icon :value="ktem.show" type="plain" @click.native="answertwo(jtem.questionId,ktem.detailName,jtem.orderNumber)"><span v-if="ktem.detailName!=='0'&&ktem.detailName!=='1'">{{ktem.detailName}}.</span>{{ktem.detailContent}}</check-icon>
                    </div>
                    <group v-show="jtem.haddetail == true ">
                      <x-textarea :max="100" @on-blur="changeDetail2(jtem.questionId,'0',jtem.orderNumber,jtem.questionDetail)" v-model="jtem.questionDetail" :placeholder="jtem.placeholder"></x-textarea>
                    </group>
                  </div>
                </li>
              </ul>
            </dd>
          </dl>
          <box class="nextstepbtn">
            <x-button  @click.native="gotoNext">下一步</x-button>
          </box>
        </div>
    </div>
  </div>
</template>

<script>
import { throttle } from 'vux'
import _ from 'lodash'
import { Swiper,SwiperItem, Group, Cell,Search,PopupPicker,Scroller , Divider,Box,XButton,CheckIcon,XTextarea} from 'vux'

export default {
  components: {
    Swiper,
    Group,
    Cell,
    Search,
    PopupPicker,
    Scroller,
    Divider,
    Box,
    XButton,
    CheckIcon,
    XTextarea
  },
  data () {
    return {
      productId:'',//产品Id
      orderNo:'',//订单号
      tcustomerId:'',//投保人ID
      bcustomerId:'',//被保人ID
      bName:'',//被保人姓名
      cName:'',//投保人姓名
      statusCode:'',//状态码
      questionData:[],//被保人答卷题目列表
      questionData2:[],//投保人答卷题目列表
      showtbAnswer:true,//显示投保人健康问卷
    }
  },
  mounted(){
    let vm = this 
    vm.orderNo = vm.$route.query.orderNo
    vm.bcustomerId = vm.$route.query.customerId
    vm.statusCode = vm.$route.query.statusCode
    vm.productId =  vm.$route.query.product
    vm.bName =  vm.$route.query.bname
    vm.cName =  vm.$route.query.cname
    vm.tcustomerId = vm.$utils.sessionStorage.getItem('tbId')
    if(vm.bcustomerId == vm.tcustomerId){
      vm.showtbAnswer = false
      vm.getQuestions('2')
    }else{
      vm.getQuestions('1')
    }
    vm.$hideShare()
  },
  methods:{
    gotoNext(){//去下一步上传图片
      let vm = this 
      let answerLen=0,questionLen=0;
      vm.questionData2.map(item=>{
        item.questionArray.map(m=>{
          if(m.isRequired == true ){
            questionLen += 1
            m.detailArray.map(n=>{
              if(n.show == true){
                answerLen += 1
              }
            })
          }
        })
      })
      if(answerLen < questionLen){
        vm.$toast('您还有未填完的选项,带*号的为必填,请补充')
        return 
      }else{
        vm.$router.push({path:'./uploadView',query:{orderNo:vm.orderNo,productId:vm.productId,statusCode:vm.statusCode}})
      }
    },
    changeDetail(qid,aid,key,word){//选择答案 填 单个题目回答 投保人
          let vm = this 
          let obj = {
              servicePath:'KINGWORKS_001_005_003',
              jsonData: {
                orderNo:vm.orderNo,
                productId:vm.productId,
                customerId:vm.tcustomerId,
                customerType:'1',
                questionId:qid,
                detailName:aid,
                detailContent:word,
                orderNumber:key
              }
            }
            vm.$doajax(obj)
              .then(function (response) {
                var data = response.data,
                  header = data.header,
                  retCode = header.retCode,
                  retMsg = header.retMsg;
                vm.$retCodeHandle(data, function () {
                  var body = data.body;
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
    changeDetail2(qid,aid,key,word){//选择答案 填 单个题目回答 被保人
          let vm = this 
          let obj = {
              servicePath:'KINGWORKS_001_005_003',
              jsonData: {
                orderNo:vm.orderNo,
                productId:vm.productId,
                customerId:vm.bcustomerId,
                customerType:'2',
                questionId:qid,
                detailName:aid,
                detailContent:word,
                orderNumber:key
              }
            }
            vm.$doajax(obj)
              .then(function (response) {
                var data = response.data,
                  header = data.header,
                  retCode = header.retCode,
                  retMsg = header.retMsg;
                vm.$retCodeHandle(data, function () {
                  var body = data.body;
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
    getQuestions(str){//获取问卷列表
      let vm = this 
      let obj ;
      if(str == '1'){
        obj = {
          servicePath:'KINGWORKS_001_005_001',
          jsonData: {
            productId:vm.productId,
            customerId:vm.tcustomerId
          }
        }
      }else{
        obj = {
          servicePath:'KINGWORKS_001_005_001',
          jsonData: {
            productId:vm.productId,
            customerId:vm.bcustomerId
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
            if(str == '1'){
              if(body.questionList.length > 0){
                vm.questionData = vm.$objDeepCopy(body.questionList)
                vm.questionData.forEach(item=>{
                  item.questionArray.forEach(jtem=>{
                    jtem.haddetail = false
                    jtem.detailArray.forEach(ktem=>{
                      ktem.show = false
                    })
                  })
                })
                vm.$vux.alert.show({
                  title: '提示',
                  content: '您现在填写的是投保人健康问卷，请如实填写'
                  
                })
              }else{
                vm.$router.push({path:'./uploadView',query:{orderNo:vm.orderNo,productId:vm.productId,statusCode:vm.statusCode}})
              }
            }else{
              if(body.questionList.length > 0){
                vm.questionData2 = vm.$objDeepCopy(body.questionList)
                vm.questionData2.forEach(item=>{
                  item.questionArray.forEach(jtem=>{
                    jtem.haddetail = false
                    jtem.detailArray.forEach(ktem=>{
                      ktem.show = false
                    })
                  })
                })
                vm.$vux.alert.show({
                  title: '提示',
                  content: '您现在填写的是被保人健康问卷，请如实填写'
                  
                })
            }else{
              vm.$router.push({path:'./uploadView',query:{orderNo:vm.orderNo,productId:vm.productId,statusCode:vm.statusCode}})
            }
            }
            
            vm.getholderAnswered()
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
    gotoInsuredAnswer(){//填写投保人健康问卷
      let vm = this 
      let answerLen=0,questionLen=0;
      vm.questionData.map(item=>{
        
        item.questionArray.map(m=>{
          if(m.isRequired == true ){
            questionLen += 1
            m.detailArray.map(n=>{
              if(n.show == true){
                answerLen += 1
              }
            })
          }
        })
      })
      
      if(answerLen < questionLen){
        vm.$toast('您还有未填完的选项,带*号的为必填,请补充')
        return 
      }else{
        vm.showtbAnswer = false 
        vm.getQuestions('2')
      }
    },
    getholderAnswered(){//获取已做题目的答案
      let vm = this 
      let obj ;
      if(vm.showtbAnswer == true){
        obj = {
          servicePath:'KINGWORKS_001_005_002',
          jsonData: {
            orderNo:vm.orderNo,
            productId:vm.productId,
            customerId:vm.tcustomerId,
            customerType:'1'
          }
        }
      }else{
        obj = {
          servicePath:'KINGWORKS_001_005_002',
          jsonData: {
            orderNo:vm.orderNo,
            productId:vm.productId,
            customerId:vm.bcustomerId,
            customerType:'2'
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
            var body = data.body.answerArray;
            if(body.length > 0){

              if(vm.showtbAnswer == true){
                vm.questionData.forEach(item=>{
                  item.questionArray.forEach(jtem=>{
                    for(let i = 0 ; i < body.length ; i++){
                      if(jtem.questionId == body[i].questionId){
                        jtem.detailArray.forEach(ktem=>{
                          if(ktem.detailName == body[i].answerContent){
                            ktem.show = true
                            if(body[i].answerContent == '0'){
                              jtem.haddetail = true 
                              jtem.questionDetail = body[i].answerDesc
                            }else{  
                              jtem.haddetail = false 
                            }
                          }
                        })
                      }
                    }
                  })
                })
              }else{
                vm.questionData2.forEach(item=>{
                  item.questionArray.forEach(jtem=>{
                    for(let i = 0 ; i < body.length ; i++){
                      if(jtem.questionId == body[i].questionId){
                        jtem.detailArray.forEach(ktem=>{
                          if(ktem.detailName == body[i].answerContent){
                            ktem.show = true
                            if(body[i].answerContent == '0'){
                              jtem.haddetail = true 
                              jtem.questionDetail = body[i].answerDesc
                            }else{  
                              jtem.haddetail = false 
                            }
                          }
                        })
                      }
                    }
                  })
                })
              }
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
    answerOne(qid,aid,key){//选择答案 不填 单个题目回答 投保人
      let vm = this
      let resultTxt 
      vm.questionData.forEach(item=>{
        item.questionArray.forEach((jtem,i)=>{
          if(jtem.questionId == qid){
            jtem.detailArray.forEach(d=>{
              d.show = false
              if(d.detailName == aid){
                d.show = true 
                if(d.detailName == '0'){
                  jtem.haddetail = true 
                }else{
                  /*这里是单选不填详细内容的*/
                  jtem.haddetail = false
                  let obj = {
                      servicePath:'KINGWORKS_001_005_003',
                      jsonData: {
                        orderNo:vm.orderNo,
                        productId:vm.productId,
                        customerId:vm.tcustomerId,
                        customerType:'1',
                        questionId:qid,
                        detailName:aid,
                        detailContent:'',
                        orderNumber:key
                      }
                    }
                    vm.$doajax(obj)
                      .then(function (response) {
                        var data = response.data,
                          header = data.header,
                          retCode = header.retCode,
                          retMsg = header.retMsg;
                        vm.$retCodeHandle(data, function () {
                          var body = data.body;
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
            })
          }
        })
      })
    },
    answertwo(qid,aid,key){//选择答案 不填 单个题目回答 被保人
      let vm = this 
      let resultTxt 
      vm.questionData2.forEach(item=>{
        item.questionArray.forEach((jtem,i)=>{
          if(jtem.questionId == qid){
            jtem.detailArray.forEach(d=>{
              d.show = false
              if(d.detailName == aid){
                d.show = true 
                if(d.detailName == '0'){
                  jtem.haddetail = true 
                }else{
                  jtem.haddetail = false
                  let obj = {
                      servicePath:'KINGWORKS_001_005_003',
                      jsonData: {
                        orderNo:vm.orderNo,
                        productId:vm.productId,
                        customerId:vm.bcustomerId,
                        customerType:'2',
                        questionId:qid,
                        detailName:aid,
                        detailContent:'',
                        orderNumber:key
                      }
                    }
                    vm.$doajax(obj)
                      .then(function (response) {
                        var data = response.data,
                          header = data.header,
                          retCode = header.retCode,
                          retMsg = header.retMsg;
                        vm.$retCodeHandle(data, function () {
                          var body = data.body;
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
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="less">
  @import "../../assets/css/comm";
  body{margin: 0;}
  .questionnaire{
    /* padding-bottom: 5rem; */
    .questionlist{
      .questionMain{
        padding: 40/@r 60/@r;
        .nextstepbtn{
          /* position: fixed;
          left: 1rem;
          right: 1rem;
          bottom: 0;
          height: 4rem; */
          padding: 1rem 0;
          background: #fff;
          z-index: 11;
          button{
            background: #3594ee;
            color: #fff;
          }
        }
        .questionBelong{
          margin-bottom: 50/@r;
          border:solid 1px #fff;
          border-radius: 5px;
          background: #fff;
          padding: 15/@r 15px;
          .between;
          span{
            font-size: 48/@r;
          }
          .emspan{
            font-size: 40/@r;
            color: #ccc;
          }
        }
        .questionlist{
          border: solid 1px #fff;
          border-radius: 5px;
          background: #fff;
          padding: 15/@r 15px;
          dt{
            color: #333;
            font-size: 48/@r;
            padding: 10/@r 0;
          }
          dd{
            font-size: 45/@r;
            color: #333;
            ul{
              li{
                .start;
                flex-wrap: wrap;
                border-top: solid 1px #ececec;
                padding: 20/@r 0;
                .questionText{
                  width: 100%;
                  .redx{color: red;}
                }
                .questionAnswers{
                  width: 100%;
                  padding: 40/@r 0;
                  .weui-textarea{
                    font-size: 14px;
                  }
                  .weui-cells{
                    &:after{
                      display: none;
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
