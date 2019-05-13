import axios from 'axios'
import _ from 'underscore'
import CryptoJS from 'crypto-js'
import wx from 'weixin-js-sdk'
var Utils = Utils||{};
Utils.address = 'http://192.168.0.113:8080';

/**
 * rem实现页面自适应
 * */
Utils.adaptive = function () {
  !function () {
    function e() {
      var e = document.documentElement.clientWidth, t = document.querySelector("html"), f = (e>414?414:e) / 20;
      window.fontSize = f;
      t.style.fontSize = f + "px"
    }

    e(), window.addEventListener("resize", e);
  }();
};
Utils.adaptive();

/**
 * 获取url链接上的参数
 * 注意：组件上请使用this.$route.query获取
 * */
Utils.getQueryString = function(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return r[2];
  return "";
};

/**
 * sessionStorage
 * */
Utils.sessionStorage={
  setItem : function (key,value) {
    try{
      sessionStorage.setItem(key,value);
    }catch(error){}
  },
  getItem : function (key) {
    try{
      return sessionStorage.getItem(key);
    }catch(error){}
  }
};

/**
 * 客户端存取内容
 * */
Utils.appStorage = {
  setItem : function (key,value, callback) {
    var reqJson = new Object();
    reqJson.servicename = 'OAJS_000_002_001_000';
    reqJson.reqData = {
      cacheKey: key,
      cacheData: value
    };
    appCommunication(reqJson, function (data) {
      callback && callback(data);
    })
  },
  getItem : function (key, callback) {
    var reqJson = new Object();
    reqJson.servicename = 'OAJS_000_002_002_000';
    reqJson.reqData = {
      cacheKey: key
    };
    appCommunication(reqJson, function (data) {
      callback && callback(data);
    })
  }
};

/*开启微信分享*/
function showShare(){
    function onBridgeReady(){
        WeixinJSBridge.call('showOptionMenu');
    }
    if(typeof WeixinJSBridge == "undefined"){
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
    } else {
        onBridgeReady();
    }
}

/*禁止微信分享*/
function hideShare(){
    function onBridgeReady(){
        WeixinJSBridge.call('hideOptionMenu');
    }
    if(typeof WeixinJSBridge == "undefined"){
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
    } else {
        onBridgeReady();
    }
}

//生成时间戳
var timestampStr = timestamp();
//生成随机串
var randomStringStr = randomString(16);//16代表16位
//获取签名
var signatureStr = "";

/**
 * 生成时间戳
 * @returns {number}
 */
function timestamp(){
    var dt = new Date();
    var ts = Date.UTC(dt.getFullYear(),dt.getMonth(),dt.getDay(),dt.getHours(),dt.getMinutes(),dt.getSeconds())/1000;
    return ts;
}

/**
 * 生成随机串
 * @param len
 * @returns {string}
 */
function randomString(len) {
    var len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var ns = '';
    for (var i = 0; i < len; i++) {
        ns += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return ns;
}

/**
 * 获取签名
 * @param ticket
 * @returns {st}
 */
function signature(ticket) {
  var ui = window.location.href;
  var string1 ="jsapi_ticket="+ticket+"&noncestr="+randomStringStr+"&timestamp="+timestampStr+"&url="+ui+"";
  var signature = CryptoJS.SHA1(string1);
    var st = String(signature);
    return st;
}



/**
 * 微信分享配置方法一
 * @param data
 */
function weiXinConfig(data) {
  signatureStr = signature(data.ticket);
  wx.config({
    debug: false, //开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: "wx2d55d01afc9e54cc",  //必填，公众号的唯一标识
    timestamp: timestampStr,
    nonceStr: randomStringStr,
    signature: signatureStr,
    jsApiList: [
      'onMenuShareTimeline',
      'onMenuShareAppMessage'
    ] //必填，需要使用的JS接口列表，所有JS接口列表见附录2
  });
  wx.ready(function() {
        weiXinShare(data);  //微信分享
  });
}




/**
 * 微信分享
 */
function weiXinShare(data) {
    var name = data.name;
  var url = data.url;
  var productName = data.productName;
  var fileName = data.fileName;
    var userId = data.userId;
    var imageUrl = data.imageUrl;
    if(!imageUrl){imageUrl = location.href.split('anguo')[0]+"anguo/anguo/sop/hklifesop/comm/icon/icon-share.png";}
    if(!name){name = "";}
  var title = '顾问'+name+'给您分享'+productName+'产品';// 分享标题
  var desc = '顾问'+name+'给您分享'+productName+'产品文件['+fileName+']';// 分享描述
    var link = url;
    var imgUrl = imageUrl;
  
    /*分享朋友圈*/
    wx.onMenuShareTimeline({
        title: title,
        link: link,
        imgUrl: imgUrl,
        success: function() {
            // 用户确认分享后执行的回调函数
        },
        cancel: function() {
            // 用户取消分享后执行的回调函数
        }
    });
  
    /*分享朋友*/
    wx.onMenuShareAppMessage({
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl,
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，否则默认为空
        success: function() {
            // 用户确认分享后执行的回调函数
        },
        cancel: function() {
            // 用户取消分享后执行的回调函数
        }
    });
}
/**
 * 获取浏览器内核
 * */
Utils.browser = function () {
  var versions = '';
  return {
    getVersion : function(){
      if(!versions){
        var u = window.navigator.userAgent;
        versions = {
          trident: u.indexOf('Trident') > -1, //IE内核
          presto: u.indexOf('Presto') > -1, //opera内核
          webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
          gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
          iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者安卓QQ浏览器
          iPad: u.indexOf('iPad') > -1, //是否为iPad
          webApp: u.indexOf('Safari') == -1 ,//是否为web应用程序，没有头部与底部
          weixin: u.indexOf('MicroMessenger') == -1 //是否为微信浏览器
        };
      }
      return versions;
    }
  };
}();

/**
 * 获取浏览器终端
 * */
Utils.mobileForm = function () {
  var appType = '';
  return {
    getMobileForm: function () {
      if(!appType){
        var browser = Utils.browser.getVersion();
        //  1. 是否为移动终端
        if (browser.mobile) {
          if (browser.ios || browser.iPhone || browser.iPad) {
            //  3. 是否为ios移动终端
            appType = "ios";
          } else if (browser.android) {
            //  4. 是否为android移动终端
            appType = "android";
          } else {
            appType = "web";
          }
        } else {
          // 2. 是否为web 端
          appType = "web";
        }
      }
      return appType;
    }
  };
}();

/**
 * ajax请求
 * */
function doajax(obj) {
  var url = Utils.address+'/anguo/restfull/hklifesop/'+obj.servicePath,
    options = obj.options || {},
    reqKey = obj.reqKey || 'reqJson',
    jsonData = obj.jsonData || {},
    sessionid = getCookie('sessionId') || '1234';
  jsonData = JSON.stringify(jsonData);
  jsonData = jsonData.replace(/\+/g,"%2B");
  jsonData = jsonData.replace(/\&/g,"%26");
  
  var defaults = {
    method: 'post',
    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: url,
    timeout:60000,
    data: reqKey + '={"header": {"sessionId": "' + sessionid + '"},"body":' + jsonData + '}'
  };
  var opts = _.defaults(options, defaults);
  return axios(opts);
}
/**
 * 获取服务器域名
 */
function getServicer(){
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： /uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPath = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    var path = {
        localhostPath: localhostPath,
        projectName: projectName
    };
    return (path);
}
/**
 * 附件上传
 * code  文件base64编码
 * fileName 文件名称
 * fileType  附件类型 0:图片 1:其它附件
 */
function sys_doFileUpload(obj,base64Code,fileName,fileType=0){
  var url = Utils.address+'/anguo/restfull/hklifesop/'+obj.servicePath,
    options = obj.options || {},
    reqKey = obj.reqKey || 'reqJson',
    jsonData = obj.jsonData || {},
    sessionid = getCookie('sessionId') || '';
  jsonData = JSON.stringify(jsonData);
  jsonData = jsonData.replace(/\+/g,"%2B");
  jsonData = jsonData.replace(/\&/g,"%26");

  var code =base64Code;
	
  var formData = new FormData();
  if(fileType == 0){
    var newCode = code.split(',')[1];
    var type = code.split(',')[0];
    formData.append('file', convertBase64UrlToBlob(newCode,type),fileName);
  }else{
    formData.append('file', convertBase64UrlToBlob(code,''),fileName);
  }
  var newType = code.split(',')[0].replace(/data:([^;]+).*/i,'$1').split("/")[1];

  // console.log("newCode:",newCode)
  // console.log("type:",type)

  
  

  var defaults = {
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data; charset=UTF-8'},
    url: url,
    data: formData
  };
  var opts = _.defaults(options, defaults);
  return axios(opts);
}

/* base64转换Blob */
function convertBase64UrlToBlob(urlData,type) {
	//去掉url的头，并转换为byte
	var bytes = window.atob(urlData);
	//处理异常,将ascii码小于0的转换为大于0
	var ab = new ArrayBuffer(bytes.length);
	var ia = new Uint8Array(ab);
	for(var i = 0; i < bytes.length; i++) {
		ia[i] = bytes.charCodeAt(i);
  }
  if(type == ''){
    return new Blob([ab]);
  }else{
    return new Blob([ab], { type: type });

  }
}

/**
 * toast默认配置信息
 * */
var toastDefault = {
  position: 'bottom',
  duration: 2000
};

/**
 * indicator默认配置信息
 * */
var indicatorDefault = {
  text: '加载中...',
  spinnerType: 'fading-circle'
};

/**
 * 获取错误显示提示语
 * */
function getRetMsg(error) {
  if(error.response){
    return '系统繁忙，请稍后再试！'
  }else{
    return error.message;
  }
}

/**
 * 获取错误显示提示语
 * */
function getToastRetMsg(error) {
  if(error.response){
    var toast = _.defaults({message: '系统繁忙，请稍后再试！'}, toastDefault);
  }else{
    var toast = _.defaults({message: error.message}, toastDefault);
  }
  return toast
}

/**
 * 相关相应条件操作方法
 * @param {string} data 响应体
 * @param {function} successCallback 000标识下成功回调函数
 * @param {object} [options] 可选，其他标识下使用如果存在
 *  key: {function} 相应标识下回调函数(key相应响应标识，值为相应方法)
 *  'else': {function} 其他标识下回调函数
 * @return
 * */
function retCodeHandle(data, successCallback, options) {
  var vm = this,
    header = data.header,
    retCode = header.retCode,
    retMsg = header.retMsg,
    options = options || {},
    defaults = {
      '000': successCallback,
      '100': gotoLogin,
      'else': function () {
        var toast = _.defaults({message: retMsg}, toastDefault);
        vm.$toast(toast);
        vm.$indicator.close();
      }
    };
  var opts =  _.defaults(options, defaults);
  for(var key in opts){
    if(key == retCode){
      opts[key] && opts[key].call(vm);
      return;
    }
  }
  opts.else && opts.else();
}
function retCodeHandle2(data, successCallback, options) {
  var vm = this,
    header = data.header,
    retCode = header.retCode,
    retMsg = header.retMsg,
    options = options || {},
    defaults = {
      '000': successCallback,
      '100': gotoAgentLogin,
      'else': function () {
        var toast = _.defaults({message: retMsg}, toastDefault);
        vm.$toast(toast);
        vm.$hideModel();
      }
    };
  var opts =  _.defaults(options, defaults);
  for(var key in opts){
    if(key == retCode){
      opts[key] && opts[key].call(vm);
      return;
    }
  }
  opts.else && opts.else();
}
/**
 * 跳转登录页面
 * 组件内使用this.$gotoLoginPage();
 * @param {string} fullPath 可选， 跳转路由路径，如存在则无路由信息对象的其他如params等属性
 * @return
 * */
function gotoLogin(){
  var vm = this 
  window.location.href = 'login.html'
}

function gotoAgentLogin(fullPath) {
  var vm = this;
  vm.$hideModel()
  if(fullPath){
    vm.$store.commit('routeConfig',{fullPath: fullPath});
  }else{
    vm.$store.commit('routeConfig',vm.$route);
  }
  vm.$router.replace('/login');
}
/*对象的深拷贝*/
function objDeepCopy(source) {
    var sourceCopy = source instanceof Array ? [] : {};
    for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
    }
    return sourceCopy;
}
/*弹窗*/
function toast(str){
  return this.$vux.toast.show({
    type: 'text',
    position: 'middle',
    text: str
  })
}
/*loading*/
function showModel(str){
  return this.$vux.loading.show({
      text: str
    });
}
/*关闭loading*/
function hideModel(){
  return this.$vux.loading.hide()
}
/**
 * 路由后退
 * */
function routerBack() {
  this.$router.go(-1);
}

/*匹配图片格式类型*/
function checkImgType(arg){
  var typeArr = ['jpg','png','jpeg','bmp','tiff','gif','pcx','tga','webp','wmf','raw','svg'];
  if(typeArr.indexOf(arg.toLowerCase()) > -1){
    return true
  }else{
    return false
  }
}

/*匹配wps文档类型*/
function checkFileType(arg){
    var typeArr = ['ppt','pptm','pptx','pot','potx','pps','ppsx','dps','dpt','ppt','pot','pps','dps','dpt','wps','wpt','doc','docx','dot','dotx','docm','txt','rtf','pdf','xlsx','xlsm','xls','xlt','xltx','et','ett','csv','wpss','ets','dpss'];
    if(typeArr.indexOf(arg.toLowerCase()) > -1){
      return true
    }else{
      return false
    }
}

/**
 * 与客户端交互方法
 * reqJson:传给客户端的json对象
 * appDataCallbackObj ： 客户端回调
 * */
function appCommunication(reqJson,appDataCallbackObj) {
  var appType = Utils.mobileForm.getMobileForm();
  reqJson.reqData.userName = Utils.sessionStorage.getItem('user') && JSON.parse(Utils.sessionStorage.getItem('user')).account || "";
  if(appType=="android"){
    var reqJson = JSON.stringify(reqJson);
    // android 客户端回调
    window.appCallback = function (respJsonBack) {
      var respJsonBack = JSON.parse(respJsonBack);
      appDataCallbackObj && appDataCallbackObj(respJsonBack)
    };
    // android 调用客户端（传递字符串）
    try{
      window.mobileoa.commonServer(reqJson);
    }catch(error){
      console.log(error);
    }
  }else if(appType=="ios"){
    try{
      //ios 客户端回调
      jsBridge.bind('commonServer', function(respJsonBack){
        appDataCallbackObj && appDataCallbackObj(respJsonBack);
      });
      // ios 调用客户端(传递对象)
      jsBridge.postNotification('commonServer',reqJson);
    }catch(error){
      console.log(error);
      alert("jsBridge不存在！");
    }
  }
}
/**
 * 设置cookie元素
 * @param cname
 * @param cvalue
 * @param delay
 * @param timeUnit 时间单元（millisecond,second,minute,hour,day（默认））
 * @return
 */
function setCookie(cname, cvalue, delay, timeUnit) {
    var pathName = window.document.location.pathname;
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);

    var delayTimes;
    if (timeUnit == undefined) {
        delayTimes = Number(delay * 24 * 60 * 60 * 1000);
    } else if (timeUnit == "hour") {
        delayTimes = Number(delay * 60 * 60 * 1000);
    } else if (timeUnit == "minute") {
        delayTimes = Number(delay * 60 * 1000);
    } else if (timeUnit == "second") {
        delayTimes = Number(delay * 1000);
    } else if (timeUnit == "millisecond") {
        delayTimes = Number(delay);
    }

    var d = new Date();
    d.setTime(d.getTime() + delayTimes);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + ";path=" + projectName;
}

/**
 * 获取cookie元素
 * @param cname
 * @return
 */
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

/**
 * 删除cookie元素
 * @param name
 * @return
 */
function delCookie(name) {
    setCookie(name, "", -1);
}
/**
 * 转成字符串
 * */
function jsonStringify(data) {
  var appType = Utils.mobileForm.getMobileForm();
  if(appType=="android"){
    return JSON.stringify(data).replace(/\"/g, '\\\"');
  }else if(appType == "ios"){
    return JSON.stringify(data);
  }
}

var common = {};
common.install = function (Vue, options) {
  Vue.prototype.$doajax = doajax;
  Vue.prototype.$axios = axios;
  Vue.prototype.$appCommunication = appCommunication;
  Vue.prototype.$_ = _;
  Vue.prototype.$utils = Utils;
  Vue.prototype.$toast = toast;
  Vue.prototype.$getServicer = getServicer;
  Vue.prototype.$showModel = showModel;
  Vue.prototype.$hideModel = hideModel;
  Vue.prototype.$gotoLoginPage = gotoAgentLogin;
  Vue.prototype.$retCodeHandle2 = retCodeHandle2;
  Vue.prototype.$retCodeHandle = retCodeHandle;
  Vue.prototype.$indicatorDefault = indicatorDefault;
  Vue.prototype.$getRetMsg = getRetMsg;
  Vue.prototype.$getToastretMsg = getToastRetMsg;
  Vue.prototype.$routerBack = routerBack;
  Vue.prototype.$checkFileType = checkFileType;
  Vue.prototype.$checkImgType = checkImgType;
  Vue.prototype.$objDeepCopy = objDeepCopy;
  Vue.prototype.$jsonStringify = jsonStringify;
  Vue.prototype.$sys_doFileUpload=sys_doFileUpload;
  Vue.prototype.$setCookie=setCookie;
  Vue.prototype.$getCookie=getCookie;
  Vue.prototype.$delCookie=delCookie;
  Vue.prototype.$weiXinConfig=weiXinConfig;
  Vue.prototype.$hideShare=hideShare;
  Vue.prototype.$showShare=showShare;
};
export {
  common
}
