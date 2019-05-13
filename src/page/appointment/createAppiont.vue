<template>
  <div class="createAppiont">
    <div class="step1">
        <!-- <x-header >创建预约</x-header> -->
        <back options=""></back>
        <div class="main">
          <div class="proTitle">
            <span>{{proInfo.productName}}</span>
          </div>
          <Group class="fromgroup specail">
              <cell class="from-cell" title="投保人信息" ></cell>
              <cell class="from-cell from-cell-dl smallsize" is-link :class="{emptyInfo:Policyholder.name == ''}" :title="Policyholder.name | checkName"  :value="Policyholder.IDCard" @click.native="showMoreholder('1')"></cell>
          </Group>
          <div  v-transfer-dom>
            <popup class="jtempop" v-model="showholderForm" position="left" width="100%">
              <div class="holderList" v-if="showHolderList">
                <div class="position-horizontal-demo jtempopHeader">
                  <span class="spanTitle" @click="addPeople('1')"> <img src="./icons/jiahao_03.png">添加投保人</span>
                  <span @click="showholderForm = false">关闭</span>
                </div>
                <div class="jtembody">              
                  <ul v-if="hasHolder">
                    <li v-for="(item, index) in allPolicyInfo" >
                      <check-icon :value="item.show" type="plain" @click.native="changeHolder(item.customerId)">
                        <div class="itemInfo">
                          <span class="namespan">{{item.chineseName}}</span>
                          <div class="idcode">
                            <span>身份证</span>
                            <span class="certiCode">{{item.certiCode | toHidden}}</span>
                          </div>
                        </div>
                      </check-icon>
                      <div class="imgBox">
                        <img src="./icons/write_03.png"  @click="watchDetail(item.customerId,'holderList')">
                      </div>
                    </li>
                  </ul>
                  <div class="hasnoList" v-else>
                    <divider >暂无可选投保人</divider>
                  </div>
                </div>
                <box class="savebtn"  >
                    <x-button  @click.native="sureHolder">确定</x-button>
                </box>
              </div>
              <div class="holderMain" v-if="addholder">
                <div class="position-horizontal-demo jtempopHeader">
                  <span @click="showholderForm = false">关闭</span>
                  <span class="spanTitle">添加投保人</span>
                </div>
                <div class="jtempopAdd">
                  <div class="groupwrap" v-for="(item,key) in PolicyholderArgs" :class="{isRequired:item.isRequired}" :key="key">
                      <Group v-if="item.param == 'birth'">
                          <Group>
                              <div class="inputFrom">
                                <div class="xinputclass">
                                    <div class="fromtitle">
                                      <span>年龄</span>
                                    </div>
                                    <div class="frominput">
                                        <input v-model="writeAge" @keyup="changeWritebirth" type="number" placeholder="填写年龄"/>
                                    </div>
                                </div>
                              </div>
                          </Group>
                          
                          <datetime v-model="chooseAge" @on-change="changeSelectbirth" start-date="1900-01-01" :end-date="nowDate" class="sss" title="出生日期" placeholder="请选择"></datetime>
                      </Group>
                      <Group v-else>
                          <div v-if="item.type == 'String'&&!item.options">
                            <x-input :title="item.name" v-model="item.value" :placeholder="`请输入${item.name}`"></x-input>
                          </div>
                          <div v-if="item.type == 'date'">
                            <datetime v-model="item.value" start-date="1900-01-01" :end-date="endDate" class="sss" :title="item.name"></datetime>
                          </div>
                          <div class="inputFrom" v-if="item.type=='int'">
                              <div v-if="item.param == 'cigarette' || item.param == 'smokeAge'">
                                <div class="xinputclass" v-show="showCigarette">
                                    <div class="fromtitle">
                                      <span>{{item.name}}</span>
                                    </div>
                                    <div class="frominput">
                                      <input v-model="item.value" type="number" :placeholder="`请输入${item.name}`"/>
                                    </div>
                                </div>
                              </div>
                              <div v-else>
                                  <div class="xinputclass">
                                      <div class="fromtitle">
                                        <span>{{item.name}}</span>
                                      </div>
                                      <div class="frominput">
                                        <input v-model="item.value" type="number" :placeholder="`请输入${item.name}`"/>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div v-if="item.options&&item.param!=='certiType'">
                            <div v-if="item.len > 2">
                              <popup-picker class="aaa"  :title="item.name" :data="item.values" v-model="item.model" placeholder="请选择" ></popup-picker>
                            </div>
                            <div class="checkiconWrap" v-else>
                              <div class="checkInner" v-if="item.param == 'smokeHabit'">
                                   <span>{{item.name}}</span>
                                    <div class="checkIcon">
                                        <check-icon :value="jtem.check" @click.native="selectXiyan(jtem.value,item.param,'1')" type="plain" v-for="(jtem,j) in item.options" :key="j">{{jtem.name}}</check-icon>
                                    </div>
                              </div>
                              <div class="checkInner" v-else>
                                  <span>{{item.name}}</span>
                                  <div class="checkIcon">
                                      <check-icon :value="jtem.check" @click.native="selectOne(jtem.value,item.param)" type="plain" v-for="(jtem,j) in item.options" :key="j">{{jtem.name}}</check-icon>
                                  </div>
                              </div>
                            </div>
                          </div>
                          <div v-if="item.param == 'certiType'">
                            <popup-picker class="aaa"  :title="item.name" :data="item.values" v-model="item.model" placeholder="请选择" ></popup-picker>
                          </div>
                      </Group>
                  </div>
                </div>
                <box class="savebtn"  >
                    <x-button  @click.native="isToChange&&saveHolder('1');!isToChange&&changeInfo('1')">保存</x-button>
                </box>
              </div>
            </popup>
          </div>
          <div class="checkIcon custom">
            <span class="custiomspan">是否回溯</span>
            <div class="checkIcon">
                <check-icon :value="ishuisu" type="plain" @click.native="changehuisu">是</check-icon>
                <check-icon :value="!ishuisu" type="plain" @click.native="changehuisu">否</check-icon>
            </div>
          </div>

          <group class="fromgroup xgroup specail" title="被保人信息" >
            <x-switch class="from-cell " title="为自己投保" v-model="isBuyself" @on-change="changePtype"></x-switch>
            <div class="selectedBox" v-show="!isBuyself">
                <div class="InsuredBox smallsize" v-for="(item , key) in selectedInsured" :key="key">
                  <cell class="from-cell from-cell-dl smallsize"  is-link :title="item.chineseName" :value="item.certiCode" @click.native="showMoreholder('2')"></cell>
                </div>
                <cell class="from-cell from-cell-dl emptyInfo smallsize" v-show="selectedInsured == ''"  title="添加被保人" is-link @click.native="showMoreholder('2')"></cell>
            </div>
            
            <div  v-transfer-dom>
              <popup class="jtempop" v-model="showInsuredForm" position="left" width="100%">
                <div class="holderList" v-if="showInsuredList">
                  <div class="position-horizontal-demo jtempopHeader">
                    <span class="spanTitle" @click="addPeople('2')"><img src="./icons/jiahao_03.png">添加被保人</span>
                    <span @click="showInsuredForm = false">关闭</span>
                  </div>
                  <div class="jtembody">
                    <ul v-if="hasInsured">
                      <li v-for="(item, index) in allInsuredInfo" >
                        <check-icon :value="item.show" type="plain" @click.native="changeInsured(item.customerId)">
                          <div class="itemInfo">
                            <span class="namespan">{{item.chineseName}}</span>
                            <div class="idcode">
                              <span>身份证</span>
                              <span class="certiCode">{{item.certiCode | toHidden}}</span>
                            </div>
                          </div>
                        </check-icon>
                        <div class="imgBox">
                          <img src="./icons/write_03.png" @click="watchDetail(item.customerId,'InsuredList')">
                        </div>
                      </li>
                    </ul>
                    <div class="hasnoList" v-else>
                      <divider >暂无可选被保人</divider>
                    </div>
                  </div>
                  <box class="savebtn"  >
                      <x-button  @click.native="sureInsured">确定</x-button>
                  </box>
                </div>
                <div class="holderMain" v-if="addInsured">
                  <div class="position-horizontal-demo jtempopHeader">
                    <span @click="showInsuredForm = false">关闭</span>
                    <span class="spanTitle">添加被保人</span>
                  </div>
                  <div class="jtempopAdd">
                      <div class="groupwrap" v-for="(item,key) in PolicyholderArgs" :class="{isRequired:item.isRequired}" :key="key">
                        <Group v-if="item.param == 'birth'">
                          <Group>
                              <div class="inputFrom">
                                <div class="xinputclass">
                                    <div class="fromtitle">
                                      <span>年龄</span>
                                    </div>
                                    <div class="frominput">
                                        <input v-model="writeAge" @keyup="changeWritebirth" type="number" placeholder="填写年龄"/>
                                    </div>
                                </div>
                              </div>
                          </Group>
                            
                            <datetime v-model="chooseAge" @on-change="changeSelectbirth" start-date="1900-01-01" :end-date="nowDate" class="sss" title="出生日期" placeholder="请选择"></datetime>
                        </Group>
                        <Group v-else>
                            <div v-if="item.type == 'String'&&!item.options">
                              <x-input :title="item.name" v-model="item.value" :placeholder="`请输入${item.name}`"></x-input>
                            </div>
                            <div v-if="item.type == 'date'">
                              <datetime v-model="item.value" start-date="1900-01-01" :end-date="endDate" class="sss" :title="item.name"></datetime>
                            </div>
                            <div class="inputFrom" v-if="item.type=='int'">
                                <div v-if="item.param == 'cigarette' || item.param == 'smokeAge'">
                                  <div class="xinputclass" v-show="showCigarette">
                                        <div class="fromtitle">
                                          <span>{{item.name}}</span>
                                        </div>
                                        <div class="frominput">
                                          <input v-model="item.value" type="number" :placeholder="`请输入${item.name}`"/>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <div class="xinputclass">
                                        <div class="fromtitle">
                                          <span>{{item.name}}</span>
                                        </div>
                                        <div class="frominput">
                                          <input v-model="item.value" type="number" :placeholder="`请输入${item.name}`"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="item.options&&item.param!=='certiType'">
                              <div v-if="item.len > 2">
                                <popup-picker class="aaa"  :title="item.name" :data="item.values" v-model="item.model" placeholder="请选择" ></popup-picker>
                              </div>
                              <div class="checkiconWrap" v-else>
                                <div class="checkInner" v-if="item.param == 'smokeHabit'">
                                     <span>{{item.name}}</span>
                                      <div class="checkIcon">
                                          <check-icon :value="jtem.check" @click.native="selectXiyan(jtem.value,item.param,'2')" type="plain" v-for="(jtem,j) in item.options" :key="j">{{jtem.name}}</check-icon>
                                      </div>
                                </div>
                                <div class="checkInner" v-else>
                                    <span>{{item.name}}</span>
                                    <div class="checkIcon">
                                        <check-icon :value="jtem.check" @click.native="selectOne(jtem.value,item.param)" type="plain" v-for="(jtem,j) in item.options" :key="j">{{jtem.name}}</check-icon>
                                    </div>
                                </div>
                                
                              </div>
                            </div>
                            <div v-if="item.param == 'certiType'">
                              <popup-picker class="aaa"  :title="item.name" :data="item.values" v-model="item.model" placeholder="请选择" ></popup-picker>
                            </div>
                        </Group>
                    </div>
                  </div>
                  <box class="savebtn"  >
                      <x-button  @click.native="isToChange&&saveHolder('2');!isToChange&&changeInfo('2')">保存</x-button>
                  </box>
                </div>
              </popup>
            </div>
          </group>

          <group class="fromgroup xgroup specail" >
            <cell class="from-cell" title="受益人信息" ><x-switch id="legalswitch" class="from-cell " title="法定受益人" v-model="isFading"></x-switch></cell>
            <div class="selectedBox" v-show="!isFading">
                <div class="InsuredBox smallsize shouyiren" v-for="(item , key) in beneficiary" :key="key">
                  <cell class="from-cell from-cell-dl" is-link  :title="`${item.chineseName}(${item.benefitRatio}%)`" :value="item.certiCode" @click.native="showMoreholder('3')"></cell>
                </div>
                <cell class="from-cell from-cell-dl emptyInfo smallsize"  title="添加受益人" is-link @click.native="showMoreholder('3')"></cell>
            </div>
            
            <div  v-transfer-dom>
              <popup class="jtempop" v-model="showBeneficiaryForm" position="left" width="100%">
                <div class="holderList" v-if="showBeneficiaryList">
                  <div class="position-horizontal-demo jtempopHeader">
                    <span class="spanTitle" @click="addPeople('3')"><img src="./icons/jiahao_03.png">添加受益人</span>
                    <span @click="showBeneficiaryForm = false">关闭</span>
                  </div>
                  <div class="jtembody">
                    <ul v-if="hasBeneficiary">
                      <li v-for="(item, index) in allBeneficiary" >
                        <check-icon :value="item.show" type="plain" @click.native="changeBeneficiary(item.customerId)">
                          <div class="itemInfo">
                            <span class="namespan">{{item.chineseName}}</span>
                            <div class="idcode">
                              <span>受益比例</span>
                              <span class="certiCode">{{item.benefitRatio}}%</span>
                            </div>
                            <div class="idcode">
                              <span>身份证</span>
                              <span class="certiCode">{{item.certiCode | toHidden}}</span>
                            </div>
                          </div>
                        </check-icon>
                        <div class="imgBox">
                          <img src="./icons/write_03.png" @click="watchDetail(item.customerId,'beneficiary')">
                        </div>
                      </li>
                    </ul>
                    <div class="hasnoList" v-else>
                      <divider >暂无可选受益人</divider>
                    </div>
                  </div>
                  <box class="savebtn"  >
                      <x-button  @click.native="sureBeneficiary">确定</x-button>
                  </box>
                </div>
                <div class="holderMain" v-if="addBeneficiary">
                  <div class="position-horizontal-demo jtempopHeader">
                    <span @click="showBeneficiaryForm = false">关闭</span>
                    <span class="spanTitle">添加受益人</span>
                  </div>
                  <div class="jtempopAdd">
                      <div class="groupwrap" v-for="(item,key) in PolicyholderArgs" :class="{isRequired:item.isRequired}" :key="key">
                        <Group v-if="item.param == 'birth'">
                            <Group>
                                <div class="inputFrom">
                                  <div class="xinputclass">
                                      <div class="fromtitle">
                                        <span>年龄</span>
                                      </div>
                                      <div class="frominput">
                                          <input v-model="writeAge" @keyup="changeWritebirth" type="number" placeholder="填写年龄"/>
                                      </div>
                                  </div>
                                </div>
                            </Group>
                            
                            <datetime v-model="chooseAge" @on-change="changeSelectbirth" start-date="1900-01-01" :end-date="nowDate" class="sss" title="出生日期" placeholder="请选择"></datetime>
                        </Group>
                        <Group v-else>
                            <div v-if="item.type == 'String'&&!item.options">
                              <x-input :title="item.name" v-model="item.value" :placeholder="`请输入${item.name}`"></x-input>
                            </div>
                            <div v-if="item.type == 'date'">
                              <datetime v-model="item.value" start-date="1900-01-01" :end-date="endDate" class="sss" :title="item.name"></datetime>
                            </div>
                            <div class="inputFrom" v-if="item.type=='int'">
                              <div class="xinputclass">
                                  <div class="fromtitle">
                                    <span>{{item.name}}</span>
                                  </div>
                                  <div class="frominput">
                                    <input v-model="item.value" type="number" :placeholder="`请输入${item.name}`"/>
                                  </div>
                              </div>
                            </div>
                            <div v-if="item.options&&item.param!=='certiType'">
                              <div v-if="item.len > 2">
                                <popup-picker class="aaa"  :title="item.name" :data="item.values" v-model="item.model" placeholder="请选择" ></popup-picker>
                              </div>
                              <div class="checkiconWrap" v-else>
                                <span>{{item.name}}</span>
                                <div class="checkIcon">
                                    <check-icon :value="jtem.check" type="plain" v-for="(jtem,j) in item.options" @click.native="selectOne(jtem.value,item.param)" :key="j">{{jtem.name}}</check-icon>
                                </div>
                              </div>
                            </div>
                            <div v-if="item.param == 'certiType'">
                              <popup-picker class="aaa"  :title="item.name" :data="item.values" v-model="item.model" placeholder="请选择" ></popup-picker>
                            </div>
                        </Group>
                    </div>
                  </div>
                  <box class="savebtn"  >
                      <x-button  @click.native="isToChange&&saveHolder('3');!isToChange&&changeInfo('3')">保存</x-button>
                  </box>
                </div>
              </popup>
            </div>
          </group>

          <group class="fromgroup xgroup" >
            <x-switch class="from-cell" title="是否添加附加险" v-model="isAdditional" @on-change="changeAdtType"></x-switch>
            <div class="addtionnalBox smallsize" v-show="isAdditional">
              <checklist  required :options="addtionnalList" v-model="checkAddtionnalList" @on-change="changeAddtion"></checklist>
            </div>
          </group>
          <group class="fromgroup xgroup" v-show="proInfo.typeCId == 'savings'">
            <x-switch class="from-cell" title="是否需要提取演示" v-model="isExtractDemo" ></x-switch>
            <x-textarea v-show="isExtractDemo" :max="200" name="detail" v-model="ExtractDemo" placeholder="请填写详细说明" :show-counter="false"></x-textarea>
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
            <popup-radio title="保费币种" :options="currency" v-model="checkedmyTye"  :placeholder="defaultmyType"></popup-radio>
          </group>
          <!-- <group class="fromgroup">
            <x-input title="保费" v-model="forehead" :placeholder="`请填入${payMin} - ${payMax}`"></x-input>
          </group> -->
          <div class="inputFrom">
            <div class="fromtitle">
              <span>{{textType}}</span>
            </div>
            <div class="frominput">
                <input v-model="forehead" type="number" :placeholder="`请填入${payMin} - ${payMax}`"></x>
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
          <group class="fromgroup">
            <x-input title="保费征税" v-model="premiumTax" placeholder="请输入保费征税"></x-input>
          </group>
          <group class="fromgroup">
            <datetime-range title="预约时间" :start-date="nowDate" :end-date="endRangeDate" :format="timeFormat" v-model="appointmentTime" placeholder="请选择" ></datetime-range>
          </group>
        </div>
        <box class="crtBtn" @click.native="createPlan">
            <x-button >下一步</x-button>
        </box>
    </div>
  </div>
</template>

<script>
import {Group,Divider,Cell,Popup,XButton,Box,TransferDom,XSwitch,Checklist,PopupRadio,XInput,PopupPicker,Datetime,CheckIcon,Swipeout, SwipeoutItem, SwipeoutButton,Checker, CheckerItem,DatetimeRange,Step, StepItem,XTextarea} from 'vux'
import IDValidator from 'id-validator'

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
    CheckIcon,Swipeout, SwipeoutItem, SwipeoutButton,
    Checker, CheckerItem,
    Divider,
    DatetimeRange,
    Step, StepItem,XTextarea  
  },
  data () {
    return {
      proInfo:'',//产品相关信息,名称/id/类型/公司
      Policyholder:{
        name:'',//姓名
        IDCard:'',//生日
      },//投保人信息
      showholderForm:false,//是否展示投保人信息框
      isBuyself:false,//是否为本人投保
      isFading:false,//是否为法定受益人
      selectedInsured:[],//选中的被保人
      Insured:'',//受保人信息
      showInsuredForm:false,//是否展示选择被保人框
      allInsured:'',//所有被保人集合
      isAdditional:false,//是否添加附加险
      addtionnalList:[],//附加险集合
      checkAddtionnalList:[],//选中的附加险
      TimeLimit:[],//期限
      currency:[],//币种列表
      checkedTime:'',
      checkedmyTye:'',
      defaultmyType:'',//默认币种
      allPolicyInfo:'',//所有投保人信息
      allInsuredInfo:'',//所有被保人信息
      PolicyholderArgs:[],//客户参数列表
      backPolicyholderArgs:[],//客户参数列表备份
      showHolderList:false,//展示选择投保人列表
      addholder:false,//展示添加投保人
      addInsured:false,//展示添加被保人
      showInsuredList:false,//展示被保人选择列表
      holderListData:[],//所有投保人列表
      InsuredListData:[],//所有被被人列表
      checklist002: [],//被保人
      labelPosition:'',
      applicantId:'',//投保人ID
      reservedApplicantId:'',//投保人中间ID,先保留，点击确定在赋值
      reservedInsuredIdData:[],//被保人ID预存，点击确定再赋值
      InsuredIdData:[],//被保人Id数组
      addtionnalSureId:[],//附加险ID数组
      ishuisu:false,//是否回溯
      payMethod:true,//缴费方式 默认年缴
      forehead:'',//保额
      productRelationList:[],//附加险相关信息，期限，保额(最大值/最小值)
      payMin:'',//对应期限的最小值
      payMax:'',//对应期限的最大值
      watchPeopleholder:false,//查看投保人信息
      watchPeopleInsured:false,//查看被保人信息
      personnalDetail:'',//个人详情
      hasHolder:false,//是否有可选投保人
      hasInsured:false,//是否有可选被保人
      nowDate:'',//当前时间
      endDate:'',//预约限制enddate
      endRangeDate:'',//预约时间范围为1年
      timeLimitType:false,//显示选择缴费期限的格式 popup或check
      showBeneficiaryForm:false,//是否显示受益人模块
      beneficiary:[],//选中的受益人列表
      allBeneficiary:[],//所有的受益人列表
      addBeneficiary:false,//是否显示添加受益人页面
      showBeneficiaryList:false,//是否显示选择受益人列表
      watchBeneficiary:false,//是否显示受益人详情
      hasBeneficiary:false,//受益人列表是否有数据
      reservedBeneficiary:[],//保存预选中的受益人
      selectedBeneficiary:[],//已选中的受益人ID
      appointmentTime:[],//预约时间
      timeFormat:'YYYY-MM-DD',//时间格式
      orderNo:'',//预约生成的订单号
      statusCode:'',//预约生成的订单状态
      premiumTax:'',//保费征税
      writeAge:'',//填写的年龄
      chooseAge:'',//选择的年龄
      isExtractDemo:false,//是否需要提取演示
      ExtractDemo:'',//
      isToChange:true,//添加or修改客户,默认添加
      changeCustomerId:'',//选中的查看个人的id
      showCigarette:false,//投保人吸烟情况下多少根烟一天输入框展示
      textType:'',//保额还是保费
      premiumYear:'',//年缴保费or保额
      premiumYearText:'',//年缴保费or保额title
      minuteList:['00','30'],//自定义分钟
    }
  },
  mounted(){
    let vm = this 
    let oldOrderNo = vm.$utils.sessionStorage.getItem('oldOrderNo')
    if(oldOrderNo !== ''){
      vm.orderNo = oldOrderNo
      vm.getoldInfo()
    }else{
      let prodetail = vm.$utils.sessionStorage.getItem('product')
      vm.proInfo = JSON.parse(prodetail)
      vm.premiumYearText = vm.proInfo.typeCId == 'seriousIllness'?'年缴保费':'保额'
      vm.getAdditional()
    }
    vm.getmyType()
    vm.$hideShare()
  },
  filters:{
    toHidden(str){
      return str.substr(0,5)+'****'+str.substr(-4,4)
    },
    tolocalContent(str){
      let result 
      if(str == '1'){
        result = '未婚'
      }else if(str == '2'){
        result = '已婚'
      }else if(str == '3'){
        result = '离婚'
      }
      return result
    },
    tolocalRelation(str){
      let result 
      if(str == '1'){
        result = '父母'
      }else if(str == '2'){
        result = '配偶'
      }else if(str == '3'){
        result = '子女'
      }
      return result
    },
    tolocalType(str){
      let result 
      if(str == 'HKD'){
        result = '港元'
      }else if(str == 'USD'){
        result = '美元'
      }else if(str == 'CNY'){
        result = '人民币'
      }
      return result 
    },
    checkName(str){
      let result ;
      if(str == ''){
        result = "请选择投保人"
      }else{
        result = str 
      }
      return result
    }
  },
  methods:{
    getCheckedCustomer(str){//获取已填写的客户信息
      let vm = this 
      var obj ;
      if(str == '1'){
        obj = {
          servicePath: 'KINGWORKS_002_002_001',
          jsonData: {
            customerType:str
          }
        }
      }else if(str == '2'){

        if(vm.applicantId == ''){
          vm.$toast("请选择投保人")
          return 
        }
        
        obj = {
          servicePath: 'KINGWORKS_002_002_001',
          jsonData: {
            applicantId:vm.applicantId,
            customerType:str
          }
        }
      }else if(str == '3'){
        if(vm.isBuyself == false){
          if(vm.selectedInsured == ''){
            vm.$toast("请选择被保人")
            return 
          }
          obj = {
            servicePath: 'KINGWORKS_002_002_001',
            jsonData: {
              applicantId:vm.selectedInsured[0].customerId,
              customerType:str
            }
          }
        }else{
          if(vm.applicantId == ''){
            vm.$toast('请选择被保人')
          }
          obj = {
            servicePath: 'KINGWORKS_002_002_001',
            jsonData: {
              applicantId:vm.applicantId,
              customerType:str
            }
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
                vm.allPolicyInfo = body.customerList.map(item=>{
                  if(item.customerId == vm.applicantId){
                    return Object.assign({},{show:true},item)
                  }else{
                    return Object.assign({},{show:false},item)
                  }
                })
                vm.allPolicyInfo.map(item=>{
                  if(item.customerId == vm.applicantId){
                    vm.Policyholder.name = item.chineseName
                    vm.Policyholder.IDCard = item.certiCode
                  }
                })
                vm.getCheckedCustomer('2')
            }else if(str == '2'){
              vm.allInsuredInfo = body.customerList.map(item=>{
                if(vm.InsuredIdData.length > 0){
                    if(vm.InsuredIdData.indexOf(item.customerId)>-1){
                      return Object.assign({},{show:true},item)
                    }else{
                      return Object.assign({},{show:false},item)
                    }
                }else{
                  return Object.assign({},{show:false},item)
                }

              })
              vm.allInsuredInfo.map(item=>{
                vm.InsuredIdData.forEach((jtem,i)=>{
                  if(jtem == item.customerId){
                    vm.selectedInsured.push(item)
                  }
                })
              })
              vm.getCheckedCustomer('3')
            }else if(str == '3'){
              
              vm.allBeneficiary = body.customerList.map(item=>{
                if(vm.selectedBeneficiary.length > 0){
                    if(vm.selectedBeneficiary.indexOf(item.customerId)>-1){
                      return Object.assign({},{show:true},item)
                    }else{
                      return Object.assign({},{show:false},item)
                    }
                }else{
                  return Object.assign({},{show:false},item)
                }
              })
              vm.allBeneficiary.map(item=>{
                 vm.reservedBeneficiary.forEach(jtem=>{
                    if(jtem == item.customerId){
                      vm.beneficiary.push(item)
                    }
                 })
              })
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
    getoldInfo(){//获取已填写的主要信息
      let vm = this 
      let obj = {
          servicePath:'KINGWORKS_002_003_005',
          jsonData:{
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
            if(body.applicantId == body.insurantId){
              vm.isBuyself = true
            }else{
              vm.isBuyself = false
            }
            /*产品信息*/
            vm.proInfo = new Object()

            vm.proInfo.productId = body.productId
            vm.proInfo.productName = body.productName
            vm.proInfo.typeCId = body.typeCId
            vm.productId = body.productId
            vm.productName = body.productName
            vm.typeCId = body.typeCId
            /*保额*/
            vm.forehead = body.coverage
            /*币种类型*/
            vm.defaultmyType = body.coverageCurrencyCode
            vm.checkedmyTye = body.coverageCurrencyCode
            /*预约时间*/
            let day = body.appointmentTime.substring(0,4)+'-'+body.appointmentTime.substring(4,6)+'-'+body.appointmentTime.substring(6,8)
            let hour = body.appointmentTime.substring(8,10)
            let minites = body.appointmentTime.substring(10,12)
            vm.appointmentTime.push(day)
            vm.appointmentTime.push(hour)
            vm.appointmentTime.push(minites)
            /*附加险*/
            if(body.extrArray.length == 0){
              vm.isAdditional = false 
            }else{
              vm.isAdditional = true
              vm.checkAddtionnalList = body.extrArray.map(item=>{
                return item.extrId
              })
            }

            /*客户*/
            vm.checkedApplicantId = body.applicantId
            vm.reservedApplicantId = body.applicantId
            vm.applicantId = body.applicantId
            vm.InsuredId = body.insurantId
            vm.$utils.sessionStorage.setItem("applicantId",vm.applicantId)
            vm.$utils.sessionStorage.setItem("insurantId",vm.InsuredId)
            
            vm.checkedInsureId = body.insurantId
            vm.reservedInsuredIdData = body.insurantId
            vm.InsuredIdData.push(body.insurantId)

            vm.reservedBeneficiary = body.favoreeArray.map(item=>{
              return item.favoreeId
            })
            vm.checkedBeneficiary = body.favoreeArray
            vm.selectedBeneficiary = body.favoreeArray.map(item=>{
              return item.favoreeId
            })
            vm.getCheckedCustomer('1')
            /*是否回溯*/
            vm.ishuisu = body.recall == '1'? false:true
            /*是否为法定受益人*/
            vm.isFading = body.favoreeType == 'legal'?true:false
            /*保费征税*/
            vm.premiumTax = body.premiumTax
            /*是否需要提取演示*/
            vm.isExtractDemo = body.isExtractDemo == '0'?true:false
            vm.ExtractDemo = body.ExtractDemo
            vm.getAdditional()
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
    selectOne(val,type){
      let vm = this 
      vm.PolicyholderArgs.forEach(item=>{
        if(item.param == type){
          item.model = new Array()
          item.options.forEach(jtem=>{
            jtem.check = false 
            if(jtem.value == val){
              jtem.check = true 
              item.model.push(jtem.name)
            }
          })
        }
      })
    },
    selectXiyan(val,type,str){//改变是否吸烟
      let vm = this 
      vm.PolicyholderArgs.forEach(item=>{
        if(item.param == type){
          item.model = new Array()
          item.options.forEach(jtem=>{
            jtem.check = false 
            if(jtem.value == val){
              jtem.check = true 
              item.model.push(jtem.name)
              vm.showCigarette = val == 0 ? true : false 
            }
          })
        }
      })
    },
    changeWritebirth(){//修改填写的年龄
      let vm = this
      let now = new Date()
      let year = now.getFullYear()
      let result =  year - 1900
      if(vm.writeAge > result){
        vm.$toast('亲，您真是寿比南山，日历被限制了哦！')
        vm.writeAge = ''
      }else{
        let birthyear = year - vm.writeAge
        
          if(vm.chooseAge !== ''){
            let oldnum = vm.chooseAge.split('-')
            vm.chooseAge = birthyear+'-'+oldnum[1]+'-'+oldnum[2]
          }else{
            vm.chooseAge = birthyear+'-01-01'
          }
      }
    },
    changeSelectbirth(val){//修改控件选择的日期
      let vm = this 
      let resultarr = val.split('-')
      let now = new Date()
      let year = now.getFullYear()
      let month = now.getMonth()+1
      let resultage = year - resultarr[0]
      vm.writeAge = resultage 
      vm.chooseAge = val
      if(vm.writeAge < 18){
        vm.PolicyholderArgs.forEach(item=>{
          item.isRequired = false 
          if(item.param == 'chineseName' || item.param == 'englishName' || item.param == 'birth' || item.param == 'sex' || item.param == 'maritalStatus' || item.param == 'isHKidentityCard' || item.param == 'certiCode' || item.param == 'credentialsIndateYear' || item.param == 'contactAddress' || item.param == 'identityAddress' || item.param == 'smokeHabit' || item.param == 'height' || item.param == 'weight'||item.param == 'explainInsured'){
            item.isRequired = true 
          }
        })
      }else{
        vm.PolicyholderArgs.forEach(item=>{
          vm.backPolicyholderArgs.forEach(jtem=>{
            if(item.param == jtem.param){
              item.isRequired = jtem.isRequired
            }
          })
        })
      }
    },
    backtoBeneficiaryList(){//关闭受益人详细信息返回列表
      let vm = this 
      vm.watchBeneficiary = false 
      vm.showBeneficiaryList = true 
    },
    backtoInsuelist(){//关闭被保人详细信息返回列表
      let vm = this 
      vm.watchPeopleInsured = false 
      vm.showInsuredList = true 
    },
    backtoHoldlist(){//关闭投保人详细信息返回列表
      let vm = this 
      vm.watchPeopleholder = false 
      vm.showHolderList = true 
    },
    watchDetail(id,type){//查看客户个人信息
      let vm = this 
      vm.changeCustomerId = id
      let obj = {
        servicePath:'KINGWORKS_002_002_002',
        jsonData: {
          customerId:id
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
            vm.personnalDetail = body.customerDetail

            if(type == 'holderList'){
              vm.editorPeople('1')
            }else if(type == 'InsuredList'){
              vm.editorPeople('2')
            }else if(type == 'beneficiary'){
              vm.editorPeople('3')
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
    createPlan(){//新增预约填写基本信息
      let vm = this 
      let recall;
      if(vm.ishuisu == true){
        recall = '0'
      }else{
        recall = '1'
      }
      if(vm.applicantId == ''){
        vm.$toast('请选择投保人')
        return
      }else if(vm.isBuyself == false && vm.InsuredIdData.length == 0){
        vm.$toast('请选择被保人')
        return 
      }else if(vm.isFading == false && vm.selectedBeneficiary.length == 0){
        vm.$toast('请选择受益人')
        return 
      }else if(vm.checkedTime == ''){
        vm.$toast('请选择缴费期限')
        return 
      }else if(vm.checkedmyTye == ''){
        vm.$toast('请选择币种')
        return 
      }else if(vm.forehead == ''){
        vm.$toast('请填入保费')
        return 
      }else if(Number(vm.forehead) > vm.payMax || Number(vm.forehead) < vm.payMin){
        vm.$toast(`请填写${vm.payMin}和${vm.payMax}之间数值的${vm.textType}`)
        return 
      }else if(vm.premiumTax == ''){
        vm.$toast('请填写保费征税')
        return
      }else if(vm.appointmentTime == ''){
        vm.$toast('请选择预约时间')
        return
      }else{

        let yuyueTime = vm.appointmentTime.join('').replace(/-/g,'')
        let favoreeType = vm.isFading == false ? 'assign':'legal'
        let isExtractDemo = vm.isExtractDemo == true?0:1
        let obj ;
        if(vm.orderNo == ''){
            obj = {
              servicePath:'KINGWORKS_002_003_003',
              jsonData: {
                type:vm.proInfo.typeCId,
                productId:vm.proInfo.productId,
                recall:recall,
                paymentTerm:vm.checkedTime,
                coverageCurrencyCode:vm.checkedmyTye,
                coverage:vm.forehead,
                applicantId:vm.applicantId,
                extraneousRiskArray:vm.checkAddtionnalList,
                insurantIdArray:vm.InsuredIdData,
                appointmentTime:yuyueTime,
                favoreeIdArray:vm.selectedBeneficiary,
                favoreeType:favoreeType,
                premiumTax:vm.premiumTax,
                isExtractDemo:isExtractDemo,
                extractDemoRemark:vm.ExtractDemo,
                premiumYear:vm.premiumYear
              }
            }
        }else{
          obj = {
            servicePath:'KINGWORKS_002_003_004',
            jsonData: {
              orderNo:vm.orderNo,
              type:vm.proInfo.typeCId,
              productId:vm.proInfo.productId,
              recall:recall,
              paymentTerm:vm.checkedTime,
              coverageCurrencyCode:vm.checkedmyTye,
              coverage:vm.forehead,
              applicantId:vm.applicantId,
              extraneousRiskArray:vm.checkAddtionnalList,
              insurantIdArray:vm.InsuredIdData,
              appointmentTime:yuyueTime,
              favoreeIdArray:vm.selectedBeneficiary,
              favoreeType:favoreeType,
              premiumTax:vm.premiumTax,
              isExtractDemo:isExtractDemo,
              extractDemoRemark:vm.ExtractDemo,
              premiumYear:vm.premiumYear
            }
          }
        }
        
        // if(vm.isneedAnswer == true ){
        //   vm.InsuredAnswer = false
        //   vm.holderAnswer = true
        //   vm.getholderAnswered('1')
        // }else{
        //   vm.showHadsecurity = true
        //   vm.InsuredAnswer = false
        //   vm.holderAnswer = false
        // } 
        vm.$showModel()
        vm.$doajax(obj)
          .then(function (response) {
            var data = response.data,
              header = data.header,
              retCode = header.retCode,
              retMsg = header.retMsg;
            vm.$retCodeHandle(data, function () {
              var body = data.body 
              vm.orderNo = body.orderNo
              vm.statusCode = body.statusCode
              
              let cName,bName,cId ; 
              if(vm.isBuyself == true ){
                cName = vm.Policyholder.name
                bName = cName 
                cId = vm.applicantId
                vm.$utils.sessionStorage.setItem('tbId', vm.applicantId)
                vm.$utils.sessionStorage.setItem('bbId', vm.applicantId)
              }else{
                cName = vm.Policyholder.name
                bName = vm.selectedInsured[0].chineseName
                cId = vm.InsuredIdData[0]
                vm.$utils.sessionStorage.setItem('tbId', vm.applicantId)
                vm.$utils.sessionStorage.setItem('bbId', cId)
              }
              vm.$utils.sessionStorage.setItem('time', vm.appointmentTime)
              vm.$utils.sessionStorage.setItem('oldOrderNo', vm.orderNo)
              setTimeout(()=>{
                vm.$router.push({path:'./security',query:{orderNo:vm.orderNo,customerId:cId,statusCode:vm.statusCode,cname:cName,bname:bName,product:vm.proInfo.productId}})
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
    changePayMethod(){//改变缴费方式
      let vm = this 
      vm.payMethod = !vm.payMethod
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
            vm.defaultmyType = vm.currency[0].value
            vm.checkedmyTye = vm.currency[0].key
            vm.$hideModel()
            let now = new Date()
            let eyear = now.getFullYear() + 100
            let ryear = now.getFullYear() + 1
            let cmonth = now.getMonth() + 1
            let day = now.getDate()
            if (cmonth < 10) cmonth = '0' + cmonth
            if (day < 10) day = '0' + day
            vm.nowDate = now.getFullYear() + '-' + cmonth + '-' + day
            vm.endDate = eyear + '-' + cmonth + '-' + day
            vm.endRangeDate = ryear + '-' + cmonth + '-' + day
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
    changeHolder(val){//修改投保人
      let vm = this 
      vm.allPolicyInfo.forEach((item,i)=>{
        item.show = false 
        if(item.customerId == val){
          item.show = true 
        }
      })
      vm.reservedApplicantId = val
    },
    changeInsured(val){//修改被保人
      let vm = this
      vm.reservedInsuredIdData = new Array()
      vm.allInsuredInfo.forEach(index=>{
        index.show = false
        if(index.customerId == val){
          // index.show = !index.show
          // if(index.show == true ){
          //   vm.reservedInsuredIdData.push(val)
          // }else{
          //   vm.reservedInsuredIdData.forEach((item,i)=>{
          //     if(item == val){
          //       vm.reservedInsuredIdData.splice(i,1)
          //     }
          //   })
          // } 这里是多选的
          index.show = true
          vm.reservedInsuredIdData.push(val)
        }
      })
    },
    changeBeneficiary(val){//修改受益人
      let vm = this 
      vm.allBeneficiary.forEach(index=>{
        if(index.customerId == val){
          index.show = !index.show
          if(index.show == true ){
            vm.reservedBeneficiary.push(val)
          }else{
            vm.reservedBeneficiary.forEach((item,i)=>{
              if(item == val){
                vm.reservedBeneficiary.splice(i,1)
              }
            })
          }
        }
      })
    },
    sureBeneficiary(){//确定受益人ID
      let vm = this 
      if(vm.reservedBeneficiary.length == 0){
        vm.$toast('请选择至少一个受益人')
      }else{
        vm.selectedBeneficiary = vm.reservedBeneficiary
        vm.showBeneficiaryForm = false 
        vm.beneficiary = new Array()
        vm.allBeneficiary.map(item=>{
           vm.reservedBeneficiary.forEach(jtem=>{
              if(jtem == item.customerId){
                vm.beneficiary.push(item)
              }
           })
        })
        console.log(vm.beneficiary)
      }
    },
    sureInsured(){//确定被保人Id
      let vm = this 
      if(vm.reservedInsuredIdData.length == 0){
        vm.$toast('请选择至少一个被保人')
      }else{
        vm.InsuredIdData = vm.reservedInsuredIdData
        vm.showInsuredForm = false
        vm.selectedInsured = new Array()
        vm.allInsuredInfo.map(item=>{
          vm.InsuredIdData.forEach((jtem,i)=>{
            if(jtem == item.customerId){
              vm.selectedInsured.push(item)
            }
          })
        })
      }
    },
    sureHolder(){//确定投保人ID
      let vm = this 
      
      if(!vm.reservedApplicantId){
        vm.$toast('请选择一个作为投保人')
      }else{
        vm.applicantId = vm.reservedApplicantId
        vm.showholderForm = false
        vm.allPolicyInfo.map(item=>{
          if(item.customerId == vm.applicantId){
            vm.Policyholder.name = item.chineseName
            vm.Policyholder.IDCard = item.certiCode
          }
        })
        vm.selectedInsured = new Array()
        vm.allInsuredInfo = new Array()
        vm.InsuredIdData = new Array()
      }
    },
    editorPeople(str){//修改客户资料之前获取内容
      let vm = this 
      var obj = {
        servicePath: 'KINGWORKS_002_002_008',
        jsonData: {
          status:'2',
          customerType:str
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
            if(str == '1'){
              vm.showHolderList = false
              vm. addholder = true 
            }else if(str == '2'){
              vm.showInsuredList = false
              vm. addInsured = true 
            }else if(str == '3'){
              vm.showBeneficiaryList = false 
              vm.addBeneficiary = true
            }
            vm.PolicyholderArgs = body.showList.map(item=>{
              let result = new Array()
              let values = new Array()
              let model = new Array()

              if(item.options){
                let len = item.options.length
                item.options.forEach(item=>{
                  values.push(item.name)
                })
                result[0] = values

                item.options = item.options.map((m,q)=>{
                  for(let k in vm.personnalDetail){
                    if(item.param == k){
                      if(m.value == vm.personnalDetail[k]){
                        model.push(item.options[q].name)
                        return Object.assign({},{check:true},m)
                      }else{
                        return Object.assign({},{check:false},m)
                      }
                    }
                  }
                })
                
                return Object.assign({},{values:result,model:model,len:len},item)
              }else{
                
                for(let w in vm.personnalDetail){
                  if(item.param == w){
                    item.value = vm.personnalDetail[w]
                    if(item.param == 'birth'){
                      let ontime = new Date()
                      vm.chooseAge = vm.personnalDetail[w]
                      vm.writeAge = ontime.getFullYear() - Number(vm.personnalDetail[w].split('-')[0])
                    }
                  }
                }
                return Object.assign({},item)
              }
            })
            if(vm.writeAge < 18){
                  vm.PolicyholderArgs.forEach(item=>{
                    item.isRequired = false 
                    if(item.param == 'chineseName' || item.param == 'englishName' || item.param == 'birth' || item.param == 'sex' || item.param == 'maritalStatus' || item.param == 'isHKidentityCard' || item.param == 'certiCode' || item.param == 'credentialsIndateYear' || item.param == 'contactAddress' || item.param == 'identityAddress' || item.param == 'smokeHabit' || item.param == 'height' || item.param == 'weight' || item.param == 'explainInsured'){
                      item.isRequired = true 
                    }
                  })
                }else{
                  vm.PolicyholderArgs.forEach(item=>{
                    vm.backPolicyholderArgs.forEach(jtem=>{
                      if(item.param == jtem.param){
                        item.isRequired = jtem.isRequired
                      }
                    })
                  })
                }
            vm.isToChange = false
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
    addPeople(str){//获取添加客户的参数
      let vm = this 
      var obj = {
        servicePath: 'KINGWORKS_002_002_008',
        jsonData: {
          status:'2',
          customerType:str
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
            if(str == '1'){
              vm.showHolderList = false
              vm. addholder = true 
            }else if(str == '2'){
              vm.showInsuredList = false
              vm. addInsured = true 
            }else if(str == '3'){
              vm.showBeneficiaryList = false 
              vm.addBeneficiary = true
            }
            vm.PolicyholderArgs = body.showList.map(item=>{
              let result = new Array()
              let values = new Array()
              let model = new Array()

              if(item.options){
                let len = item.options.length
                item.options.forEach(item=>{
                  values.push(item.name)
                })
                result[0] = values
                item.options = item.options.map((m,q)=>{
                  if(q == 0){
                    return Object.assign({},{check:true},m)
                  }else{
                    return Object.assign({},{check:false},m)
                  }
                })
                if(item.param == 'smokeHabit'){
                  if(item.options[0].value == '0'){
                    vm.showCigarette = true 
                  }else{
                    vm.showCigarette = false
                  }
                }
                
                model.push(item.options[0].name)
                return Object.assign({},{values:result,model:model,len:len},item)
              }else{
                return Object.assign({},item)
              }
            })

            vm.backPolicyholderArgs = vm.$objDeepCopy(vm.PolicyholderArgs)
            vm.isToChange = true 
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
    saveHolder(str){//新增客户
      let vm = this
      let tObj = new Object()
      var Validator = new IDValidator();
      vm.PolicyholderArgs.forEach(item=>{
        if(item.isRequired == true){
          if(item.param == 'cigarette'&&vm.showCigarette == false ){
            tObj[item.param] = new Object()
            tObj[item.param].value  = '0'
            tObj[item.param].name = item.name
          }else if(item.param == 'smokeAge'&&vm.showCigarette == false){
            tObj[item.param] = new Object()
            tObj[item.param].value  = '0'
            tObj[item.param].name = item.name
          }else{
              if(!item.options){
                if(item.param == 'birth'){
                  tObj[item.param] = new Object()
                  tObj[item.param].value = vm.chooseAge
                  tObj[item.param].name = item.name 
                }else if(item.param == 'certiCode'){
                  if(Validator.isValid( item.value ) == false){
                    tObj[item.param] = new Object()
                    tObj[item.param].value = ''
                    tObj[item.param].name = item.name
                  }else{
                    tObj[item.param] = new Object()
                    tObj[item.param].value = item.value
                    tObj[item.param].name = item.name 
                  }
                }else{
                  tObj[item.param] = new Object()
                  tObj[item.param].value = item.value
                  tObj[item.param].name = item.name
                }
              }else{
                  item.options.forEach((jtem,n)=>{
                    if(jtem.name == item.model[0]){
                      tObj[item.param] = new Object()
                      tObj[item.param].value = jtem.value
                      tObj[item.param].name = jtem.name
                    }
                  })
              }
          }
        }else{
          if(!item.options){
              if(item.value !== ''){
                tObj[item.param] = new Object()
                tObj[item.param].value = item.value
                tObj[item.param].name = item.name 
              }
          }else{
              item.options.forEach((jtem,n)=>{
                if(jtem.name == item.model[0]){
                  tObj[item.param] = new Object()
                  tObj[item.param].value = jtem.value
                  tObj[item.param].name = jtem.name 
                }
              })
          }
        }
      })
      
      
      var obj; 
      if(str == '3'){
        if(vm.isBuyself == false){
          obj = {
            servicePath: 'KINGWORKS_002_002_003',
            jsonData: {
              "customerType": str,
              "applicantId":vm.selectedInsured[0].customerId
            }
          }
        }else{
          obj = {
            servicePath: 'KINGWORKS_002_002_003',
            jsonData: {
              "customerType": str,
              "applicantId":vm.applicantId
            }
          }
        }
          
      }else{
          obj = {
            servicePath: 'KINGWORKS_002_002_003',
            jsonData: {
              "customerType": str,
              "applicantId":vm.applicantId
            }
          }
      }
      let doupdate = true 
      for(let key in tObj){
        if(tObj[key].value == ''){
          doupdate = false
          if(key == 'certiCode'){
            vm.$toast("请填写正确的身份证号码")
          }else{
            vm.$toast(`请填写 ${tObj[key].name} ,带*号的为必填选项`)
          }
          return false
        }else{
          obj.jsonData[key] = tObj[key].value          
        }
      }
      if(doupdate){
        vm.$showModel()
        vm.$doajax(obj)
          .then(function (response) {
            var data = response.data,
              header = data.header,
              retCode = header.retCode,
              retMsg = header.retMsg;
            vm.$retCodeHandle(data, function () {
              vm.$toast(retMsg)
              setTimeout(()=>{
                if(str == '1'){
                  vm.addholder = false 
                  vm.showHolderList = true
                  vm.showMoreholder('1') 
                }else if(str == '2'){
                  vm.addInsured = false 
                  vm.showInsuredList = true
                  vm.showMoreholder('2')
                }else if(str == '3'){
                  vm.addBeneficiary = false 
                  vm.showBeneficiaryList = true
                  vm.showMoreholder('3') 
                }
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
      }
    },
    changeInfo(str){//修改客户
      let vm = this
      let tObj = new Object()
      var Validator = new IDValidator();
      vm.PolicyholderArgs.forEach(item=>{
        if(item.isRequired == true){
          if(item.param == 'cigarette'&&vm.showCigarette == false ){
            tObj[item.param] = new Object()
            tObj[item.param].value  = '0'
            tObj[item.param].name = item.name
          }else if(item.param == 'smokeAge'&&vm.showCigarette == false){
            tObj[item.param] = new Object()
            tObj[item.param].value  = '0'
            tObj[item.param].name = item.name
          }else{
              if(!item.options){
                if(item.param == 'birth'){
                  tObj[item.param] = new Object()
                  tObj[item.param].value = vm.chooseAge
                  tObj[item.param].name = item.name 
                }else if(item.param == 'certiCode'){
                  if(Validator.isValid( item.value ) == false){
                    tObj[item.param] = new Object()
                    tObj[item.param].value = ''
                    tObj[item.param].name = item.name
                  }else{
                    tObj[item.param] = new Object()
                    tObj[item.param].value = item.value
                    tObj[item.param].name = item.name 
                  }
                }else{
                  tObj[item.param] = new Object()
                  tObj[item.param].value = item.value
                  tObj[item.param].name = item.name
                }
              }else{
                  item.options.forEach((jtem,n)=>{
                    if(jtem.name == item.model[0]){
                      tObj[item.param] = new Object()
                      tObj[item.param].value = jtem.value
                      tObj[item.param].name = jtem.name
                    }
                  })
              }
          }
        }else{
          if(!item.options){
              if(item.value !== ''){
                tObj[item.param] = new Object()
                tObj[item.param].value = item.value
                tObj[item.param].name = item.name 
              }
          }else{
              item.options.forEach((jtem,n)=>{
                if(jtem.name == item.model[0]){
                  tObj[item.param] = new Object()
                  tObj[item.param].value = jtem.value
                  tObj[item.param].name = jtem.name 
                }
              })
          }
        }
      })
      
      
      var obj; 
      if(str == '3'){
        if(vm.isBuyself == false){
          obj = {
            servicePath: 'KINGWORKS_002_002_004',
            jsonData: {
              customerType: str,
              applicantId:vm.selectedInsured[0].customerId,
              customerId:vm.changeCustomerId
            }
          }
        }else{
          obj = {
            servicePath: 'KINGWORKS_002_002_004',
            jsonData: {
              customerType: str,
              applicantId:vm.applicantId,
              customerId:vm.changeCustomerId
            }
          }
        }
          
      }else{
          obj = {
            servicePath: 'KINGWORKS_002_002_004',
            jsonData: {
              customerType: str,
              applicantId:vm.applicantId,
              customerId:vm.changeCustomerId
            }
          }
      }
      let doupdate = true 
      for(let key in tObj){
        if(tObj[key].value == ''){
          doupdate = false
          if(key == 'certiCode'){
            vm.$toast("请填写正确的身份证号码")
          }else{
            vm.$toast(`请填写${tObj[key].name},带*号的为必填选项`)
          }
          return false
        }else{
          obj.jsonData[key] = tObj[key].value          
        }
      }
      if(doupdate){
        vm.$showModel()
        vm.$doajax(obj)
          .then(function (response) {
            var data = response.data,
              header = data.header,
              retCode = header.retCode,
              retMsg = header.retMsg;
            vm.$retCodeHandle(data, function () {
              vm.$toast(retMsg)
              setTimeout(()=>{
                if(str == '1'){
                  vm.addholder = false 
                  vm.showHolderList = true
                  vm.showMoreholder('1') 
                }else if(str == '2'){
                  vm.addInsured = false 
                  vm.showInsuredList = true
                  vm.showMoreholder('2')
                }else if(str == '3'){
                  vm.addBeneficiary = false 
                  vm.showBeneficiaryList = true
                  vm.showMoreholder('3') 
                }
                vm.isToChange = true 
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
      }
    },
    showMoreholder(str){//展示 (投保人/被保人) 选择页
      let vm = this 
      var obj ;
      if(str == '1'){
        obj = {
          servicePath: 'KINGWORKS_002_002_001',
          jsonData: {
            customerType:str
          }
        }
      }else if(str == '2'){

        if(vm.applicantId == ''){
          vm.$toast("请选择投保人")
          return 
        }
        
        obj = {
          servicePath: 'KINGWORKS_002_002_001',
          jsonData: {
            applicantId:vm.applicantId,
            customerType:str
          }
        }
      }else if(str == '3'){
        if(vm.isBuyself == false){
          if(vm.selectedInsured == ''){
            vm.$toast("请选择被保人")
            return 
          }
          obj = {
            servicePath: 'KINGWORKS_002_002_001',
            jsonData: {
              applicantId:vm.selectedInsured[0].customerId,
              customerType:str
            }
          }
        }else{
          if(vm.applicantId == ''){
            vm.$toast('请选择被保人')
          }
          obj = {
            servicePath: 'KINGWORKS_002_002_001',
            jsonData: {
              applicantId:vm.applicantId,
              customerType:str
            }
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
              vm.showholderForm = true 
              vm.showHolderList = true
              vm.addholder = false 
              vm.addInsured = false
              vm.addBeneficiary = false

              if(body.customerList.length > 0){
                vm.hasHolder = true 
                vm.allPolicyInfo = body.customerList.map(item=>{
                  if(item.customerId == vm.applicantId){
                    return Object.assign({},{show:true},item)
                  }else{
                    return Object.assign({},{show:false},item)
                  }
                })
              }else{
                vm.hasHolder = false
              }
            }else if(str == '2'){
              vm.showInsuredForm = true 
              vm.showInsuredList = true
              vm.addholder = false 
              vm.addInsured = false
              vm.addBeneficiary = false

              if(body.customerList.length > 0){
                vm.hasInsured = true 
                vm.allInsuredInfo = body.customerList.map(item=>{
                  if(vm.InsuredIdData.length > 0){
                      if(vm.InsuredIdData.indexOf(item.customerId)>-1){
                        return Object.assign({},{show:true},item)
                      }else{
                        return Object.assign({},{show:false},item)
                      }
                  }else{
                    return Object.assign({},{show:false},item)
                  }
                  
                })
              }else{
                vm.hasInsured = false
              }
            }else if(str == '3'){
              vm.showBeneficiaryForm = true
              vm.showBeneficiaryList = true
              vm.addholder = false 
              vm.addBeneficiary = false 
              vm.addInsured = false 
              if(body.customerList.length > 0){
                vm.hasBeneficiary = true 
                vm.allBeneficiary = body.customerList.map(item=>{
                  if(vm.selectedBeneficiary.length > 0){
                      if(vm.selectedBeneficiary.indexOf(item.customerId)>-1){
                        return Object.assign({},{show:true},item)
                      }else{
                        return Object.assign({},{show:false},item)
                      }
                  }else{
                    return Object.assign({},{show:false},item)
                  }
                  
                })
              }else{
                vm.hasBeneficiary = false
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
    changePtype(){//是否为自己购买保险
      let vm = this 
      if(vm.isBuyself == true){
        if(vm.applicantId == ''){
          setTimeout(()=>{
            vm.isBuyself = false
          },500)
          vm.$toast('请先选择投保人')
        }else{
          let arr = new Array()
          arr.push(vm.applicantId)
          vm.InsuredIdData = arr
        }
      }else{
        vm.InsuredIdData = vm.reservedInsuredIdData
      }
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
        console.log(vm.isAdditional)
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
  .vux-popup-picker{z-index: 505!important}
  .weui-toast{z-index: 10000!important}
  .smallsize{font-size: 40/@r!important}
  .weui-cell_radio{
    font-size: 48/@r;
  }
  .vux-popup-picker:before{
    content: '';
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
  .vux-popup-picker-container{
    position: relative;
    z-index: 510!important;
  }
  .jtempopAdd{
    padding-bottom: 4rem!important;
    .weui-input{
      text-align: right;
      font-size: 48/@r;
      // padding-right: 12px;
    }
    .groupwrap{
      .weui-cells{
          margin-top: 0!important;
          font-size: 48/@r;
          &:before{display: none}
      }
      .checkiconWrap{
        padding: 10px 15px;
        .between;
        .checkInner{
          width: 100%;
          .between;
        }
      }
      .inputFrom{
        background: #fff;
        .xinputclass{
          padding: 35/@r 15px;
          .between;
          font-size:48/@r;
          .fromtitle{
            line-height: 1;
          }
          .frominput{
            line-height: 1;
            input{
              font-size: 48/@r;
              text-align: right;
              // padding-right: 13px;
            }
          }
        }
        
      }
    }
    .sss{
      border-top: solid 0px #ececec;
    }
    .isRequired{
      position: relative;
      .checkiconWrap{
        &:before{
          content: '*';
          width: 8px;
          height: 100%;
          position: absolute;
          left: 5px;
          top: 0;
          color: #f00;
          .center;
        }
      }
      .weui-cell{
        &:before{
          content: '*';
          width: 8px;
          height: 100%;
          position: absolute;
          left: 5px;
          top: 0;
          color: #f00;
          padding: 20px 0;
          .center;
        }
      }
      .inputFrom{
        position: relative;
        &:before{
          content: '*';
          width: 8px;
          height: 100%;
          position: absolute;
          left: 5px;
          top: 0;
          color: #f00;
          .center;
        }
      }
    }
  }
  .jtempopHeader{
    background: #fff;
    padding: 0.32206119rem 15px;
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    z-index: 504;
    border-bottom: solid 1px #ececec;
    
    span{color: #337fcc;}
    .spanTitle{
      color: #337fcc;
      .center;
      img{
        width: 60/@r;
        margin: 30/@r;
      }
    }
  }
  .jtempopHeader3{
    .between;
    background: #fff;
    padding: 30/@r 15px;
    position: relative;
    span{
      font-size: 48/@r;
      color: #333;
    }
    .spanTitle{
      font-size: 50/@r;
      color: #000;
    }
  }
  .jtempop{
      background: #ececec!important;
      
      .holderList{
        border:solid 1px #fff;
        border-radius: 5px;
        margin: 50/@r 40/@r;
      }
      .savebtn{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3rem;
        padding: 0 1rem;
        background: #fff;
        z-index: 510;
        .center;
        .weui-btn{
          height: 120/@r;
          line-height: 1;
          background: #3594ee;
          color: #fff;
          font-size: 48/@r;
        }
      }
  }
  .jtembody{
    background: #fff;
    .checkwrap{
      .vux-checker-item{
        width: 100%;
      }
    }
    .hasnoList{
      height: 400/@r;
      width: 80%;
      .center;
      margin: 0 auto;
      font-size: 46/@r;
    }
    ul{
      li{
        .around;
        padding: 15/@r 60/@r;
        border-top: solid 1px #ececec;
        .vux-check-icon{
          flex: 3;
          font-size: 46/@r;
          .start;
          .itemInfo{
             padding:0 30/@r;
             span{
               width: 100%;
               display: inline-block;
             }
             .namespan{
                font-size: 48/@r;
                color: #000;
                font-weight: 600;
             }
             .idcode{
                color: #666;
                .start;
                .certiCode{
                  margin-left: 30/@r;
                }
             }
          }
        }
        .imgBox{
          flex: 1;
          .center;
          img{
            width: 76/@r;
            // border:solid 1px #ececec;
            // box-shadow: 1px 1px 1px 1px;
          }
        }
      }
    }
  }
  .watchsmo{
    // padding-top: 150/@r;
    .personnalMain{
      .weui-cells{
        margin-top: 0!important;
      }
    }
  }
  .createAppiont{
    background-color: #ececec;
    padding-bottom: 30/@r;
    .hadsecurity{
      position: relative;
      .nextstepbtn{
        position: fixed;
        left:0;
        right: 0;
        bottom: 0;
      }
    }
    .stepbox{
      background: #fff;
      font-size: 42/@r;
      padding: 7px 10px;
      margin-top: 5px;
      .vux-step-item-title{
        font-size: 42/@r;
      }
    }
    .step1{
        .main{
          width: 100%;
          padding: 60/@r 10px;
          .inputFrom{
            background: #fff;
            margin-top: 0.87rem;
            padding: 35/@r 15px;
            .between;
            font-size: 48/@r;
            position: relative;
            .fromtitle{
              line-height: 1;
            }
            .frominput{
              line-height: 1;
              input{
                font-size: 15px;
                text-align: right;
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
              font-size: 48/@r;
              color: #005189;
            }
          }
          .fromgroup{
            .weui-cell{
              padding: 30/@r 15px;
            }
            #legalswitch{
              padding: 0 !important;
              text-align: left;
            }
            .weui-cells{
              font-size: 48/@r;
              border:none;
              &::after{

              }
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
          .from-cell{
            border:solid 1px #fff;
            border-radius: 4px;
            font-size: 48/@r;
            color: #333;
            border: none;
          }
          .from-cell-dl{
            font-size: 44/@r;
            background: #dedede;
            border-radius: 0;
          }
          .emptyInfo{
            color: #3594ee;
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
            .weui-cell{
              &:first-child{
                p{
                  font-weight: 600;
                }
              }
            }
            .weui-cells__title{
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
              padding-left:15px;
              margin-top:7px;
              color: #000;
              font-weight: 600;
              font-size: 48/@r;
            }
            .weui-cell__bd{
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }
            .shouyiren{
              position: relative;
              &:after{
                content: " ";
                position: absolute;
                left: 0;
                bottom: 0;
                right: 0;
                height: 1px;
                border-bottom: 1px solid #fff;
                color: #D9D9D9;
                -webkit-transform-origin: 0 100%;
                transform-origin: 0 100%;
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
              }
            }
          }
          .custom{
            .between;
            font-size: 48/@r;
            background: #fff;
            padding: 30/@r 15px;
            margin-top: 0.77rem;
            .custiomspan{
              color: #000;
              font-weight: 600;
            }
          }
        }
        .crtBtn{
          
          bottom: 0;
          left: 0;
          right: 0;
          padding: 30/@r 10px;
          
          z-index: 11;
          button{
            height: 120/@r;
            line-height: 1;
            background: #3594ee;
            color: #fff;
            font-size: 48/@r;
          }
        }
    }
  }
</style>
