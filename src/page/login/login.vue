<template>
  <div id="login" class="login">
    <div class="login-inner">
      <h1>代理登录</h1>
      <div class="form">
        <div class="form-group userName">
          <div class="form-input">
            <input type="text" placeholder="用户名" v-model="account" @focus="accountTips=''">
          </div>
        </div>
        <div class="form-group password">
          <div class="form-input">
            <input type="password" placeholder="密码" v-model="password" @focus="passwordTips=''">
          </div>
        </div>
        <div class="form-handel">
          <div class="check-box fl" :class="{choose: rememberUserName}" @click="rememberUserName = !rememberUserName">
            <span class="checkbox fl"></span>
            <span class="value fl">记住账号</span>
          </div>
          <div class="check-box fl" :class="{choose: rememberPassword}" @click="remember">
            <span class="checkbox fl"></span>
            <span class="value fl">记住密码</span>
          </div>
        </div>
        <div class="btn" @click="login">
            登&nbsp;&nbsp;录
        </div>
      </div>
    </div>
  </div>
</template>

<script type="es6">
  export default {
    name: 'login',
    data() {
      return{
        rememberUserName: false,    //记住账号状态
        rememberPassword: false,    //记住密码状态
        account: '',                 //账号
        password: '',                 //密码
        accountTips: '',            //账号提示
        passwordTips: '',           //密码提示
        address: '',                //服务器地址
      }
    },
    methods: {
      remember(){//记住密码
        let vm = this 
        vm.rememberPassword = !vm.rememberPassword
        if(vm.rememberPassword == true ){
          vm.rememberUserName = true 
        }
      },
      login(){
        let vm = this 
        if(vm.account == ''){
          vm.$toast('请输入用户名')
          return
        }else if(vm.password == ''){
          vm.$toast('请输入密码')
          return
        }else{
          let obj = {
            servicePath:'KINGWORKS_000_000_001',
            jsonData: {
                loginName:vm.account,
                passwd:vm.password
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
                let sessionId = body.sessionId
                vm.$setCookie('sessionId', sessionId)
                if(vm.rememberUserName == true){
                  vm.$setCookie('userName', vm.account,1)
                }else{
                  vm.$delCookie('userName')
                  vm.$delCookie('password')
                }
                if(vm.rememberPassword == true){
                  vm.$setCookie('userName', vm.account,1)
                  vm.$setCookie('password', vm.password,1)
                }else{
                  vm.$delCookie('password')
                }
                vm.$toast(retMsg)
                setTimeout(()=>{
                  vm.$router.push({path:'./agentHome'})
                },1000)
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
    },
    mounted: function () {
      let vm = this 
      let account = vm.$getCookie('userName')
      let password = vm.$getCookie('password')
      if(account){
        vm.account = account
        vm.rememberUserName = true 
      }
      if(password){
        vm.password = password
        vm.rememberPassword = true 
      }
      vm.$hideShare()
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../assets/css/comm";
  .login{
    height: 100%;
    background: url("icons/bg.jpg") no-repeat center;
    background-size: 100%;
    padding: 0;
  }
  .login-inner{
    h1{
      padding: 350/@r 0 0;
      text-align: center;
      font-size: 70/@r;
      color: #2d92f1;
      margin-bottom: 108/@r;
    }
    .form{
      margin: 0 157/@s 0 145/@s;
      .form-group{
        padding-left:135/@r;
        background-color: #fdfdfd;
        background-repeat: no-repeat;
        margin-bottom: 55/@r;
        position: relative;
        .form-input{
          position: relative;
          padding: 0 35/@r;
          &:before{
            content: '';
            width:1px;
            height: 60%;
            position: absolute;
            left: 1px;
            top: 20%;
            background: #ccc;
          }
          input{
            width: 100%;
            height: 100/@r;
            line-height: 100/@r;
            background: #fdfdfd;
            font-size: 48/@r;
          }
          :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
            color: #c3c3c3;
          }

          ::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: #c3c3c3;
          }

          input:-ms-input-placeholder{
            color: #c3c3c3;
          }

          input::-webkit-input-placeholder{
            color: #c3c3c3;
          }
        }
      }
      .form-select{
        height: 122/@r;
        padding: 0 48/@r 0 48/@r;
        font-size: 48/@r;
        color: #353535;
        z-index: 10;
        .select{
          height: 100%;
          padding-right: 60/@r;
          line-height: 122/@r;
        }
        .arrow{
          position: absolute;
          width: 45/@r;
          right: 48/@r;
          top: 50%;
          transform: translateY(-50%);
        }
        .arrowT{
          transform: translateY(-50%) rotateZ(180deg);
        }
        .options{
          position: absolute;
          top:110%;
          left: 0;
          width: 100%;
          padding-top: 19/@r;
          background: url("icons/a.png") no-repeat 86.6% top;
          background-size: 60/@r;
          .option-inner{
            border-radius: 5px;
            padding-top: 30/@r;
            background-color: #ffffff;
            .option{
              height: 122/@r;
              line-height: 122/@r;
              color: #898989;
              font-size: 46/@r;
              padding: 0 48/@r 0 48/@r;
            }
          }
        }
      }
      .userName{
        background-image: url("./icons/icon1.png");
        background-position: 43/@r center;
        background-size: 56/@r;
      }
      .password{
        background-image: url("./icons/icon2.png");
        background-position: 43/@r center;
        background-size: 51/@r;
      }
      .form-handel{
        overflow: hidden;
        padding: 15/@r 10/@r;
        color: #2185e3;
        font-size: 40/@r;
        margin-bottom: 120/@r;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .check-box{
          margin-right: 165/@r;
          overflow: hidden;
          height: 60/@r;
          line-height: 60/@r;
          font-size: 40/@r;
          color: #2185e3;
          .start;
          .checkbox{
            width: 44/@r;
            height: 44/@r;
            background-color: #fdfdfd;
            margin-right: 24/@r;
            display: inline-block;
          }
        }
        .choose{
          .checkbox{
            background-image: url("./icons/icon3.png");
            background-repeat: no-repeat;
            background-size: 100%;
            background-position: center;
          }
        }
      }
      .btn{
        margin: 0 10/@r;
        background-color: #2d92f1;
        height: 116/@r;
        line-height: 116/@r;
        text-align: center;
        font-size: 54/@r;
        color: #fff;
        border-radius: 20/@r;
      }
    }
  }
</style>
