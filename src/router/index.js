import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/index.js'
import login from '@/page/login/login'
import Home from '@/page/home/home'
import cpdf from '@/page/home/cpdf'
import nocpdf from '@/page/home/nocpdf'
import homeList from '@/page/home/homelist'
import homeDetail from '@/page/home/homeDetail'
import Appointment from '@/page/appointment/appointment'
import createAppiont from '@/page/appointment/createAppiont'
import amendAppiont from '@/page/appointment/amendAppiont'
import security from '@/page/appointment/security'
import questionnaire from '@/page/appointment/questionnaire'
import uploadView from '@/page/appointment/uploadView'
import orderDate from '@/page/appointment/orderDate'
import appiontDetail from '@/page/appointment/appiontDetail'
import plan from '@/page/plan/plan'
import myplan from '@/page/plan/myplan'
import policy from '@/page/policy/policy'
import policyDetail from '@/page/policy/policyDetail'
import writeDetail from '@/page/policy/writeDetail'
import agent from '@/page/agent/agent'
import agentAppiontDetail from '@/page/agent/agentAppiontDetail'
import agentPolicy from '@/page/agent/agentPolicy'
import agentHome from '@/page/agent/agentHome'
import agentWriteDetail from '@/page/agent/agentWriteDetail'
import agentPolicyDetail from '@/page/agent/agentPolicyDetail'

Vue.use(Router)

export default new Router({
  // mode:'history',
  // base:'/anguo/sop/hklifesop',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
      meta:{
        title:'登录'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta:{
        title:'首页'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/agent',
      name: 'agent',
      component: agent,
      meta:{
        title:'我的预约'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/agentHome',
      name: 'agentHome',
      component: agentHome,
      meta:{
        title:'首页'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/agentPolicyDetail',
      name: 'agentPolicyDetail',
      component: agentPolicyDetail,
      meta:{
        title:'保单详情'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/agentWriteDetail',
      name: 'agentWriteDetail',
      component: agentWriteDetail,
      meta:{
        title:'填写保单'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/agentPolicy',
      name: 'agentPolicy',
      component: agentPolicy,
      meta:{
        title:'我的保单'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/agentAppiontDetail',
      name: 'agentAppiontDetail',
      component: agentAppiontDetail,
      meta:{
        title:'预约详情'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/homelist',
      name: 'HomeList',
      component: homeList,
      meta:{
        title:'在售产品'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/cpdf',
      name: 'cpdf',
      component: cpdf,
      meta:{
        title:'PDF预览'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/nocpdf',
      name: 'nocpdf',
      component: nocpdf,
      meta:{
        title:'PDF预览'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/homeDetail',
      name: 'homeDetail',
      component: homeDetail,
      meta:{
        title:'产品详情'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/appointment',
      name: 'Appointment',
      component: Appointment,
      meta:{
        title:'我的预约'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/appiontDetail',
      name: 'appiontDetail',
      component: appiontDetail,
      meta:{
        title:'预约详情'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/createAppiont',
      name: 'createAppiont',
      component: createAppiont,
      meta:{
        title:'创建预约'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/amendAppiont',
      name: 'amendAppiont',
      component: amendAppiont,
      meta:{
        title:'修改信息'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/security',
      name: 'security',
      component: security,
      meta:{
        title:'已有保障'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/questionnaire',
      name: 'questionnaire',
      component: questionnaire,
      meta:{
        title:'健康问卷'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/uploadView',
      name: 'uploadView',
      component: uploadView,
      meta:{
        title:'资料上传'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/orderDate',
      name: 'orderDate',
      component: orderDate,
      meta:{
        title:'确认时间'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/plan',
      name: 'plan',
      component: plan,
      meta:{
        title:'创建计划书'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/myplan',
      name: 'myplan',
      component: myplan,
      meta:{
        title:'我的计划书'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/policy',
      name: 'policy',
      component: policy,
      meta:{
        title:'我的保单'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/policyDetail',
      name: 'policyDetail',
      component: policyDetail,
      meta:{
        title:'保单详情'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    },
    {
      path: '/writeDetail',
      name: 'writeDetail',
      component: writeDetail,
      meta:{
        title:'填写保单'
      },
      beforeEnter: (to, from, next) => {
        if (to.meta.title) {
          document.title = to.meta.title
        }
        next()
      }
    }
  ]
})
