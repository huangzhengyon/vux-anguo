// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import emptyPage from './components/emptyPage'
import back from './components/back'
// import CPdf from './components/CPdf'

import router from './router/index.js'
import App from './App'
import store from './vuex/index.js'
import {common} from './assets/js/comm.js'
import {XHeader, LoadingPlugin, ToastPlugin, AlertPlugin,LoadMore } from 'vux'
import wx from 'weixin-js-sdk'

Vue.use(wx)
Vue.component(emptyPage.name, emptyPage);
Vue.component(back.name, back);
// Vue.component(CPdf.name, CPdf);

Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(router)
Vue.use(common);
Vue.component('x-header', XHeader)
Vue.component('load-more', LoadMore)
FastClick.attach(document.body)

Vue.config.productionTip = true;//设置为 true 在 vue 启动时生成生产提示；设置为 false 以阻止 vue 在启动时生成生产提示。



/* eslint-disable no-new */
new Vue({
  el:'#app',
  store,
  router,
  render: h => h(App)
}).$mount('#app')
