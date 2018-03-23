import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import NProgress from 'nprogress'//页面顶部进度条
import 'nprogress/nprogress.css'
import "../node_modules/font-awesome/css/font-awesome.min.css"//字体图标
import "../node_modules/flex.css/dist/flex.css"

import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Main from './components/Main.vue'

import adminHomePage from './components/home/adminHomePage.vue'//系统状态

import book from './components/meeting/book.vue'//会议管理-发起会议
import myMeetings from './components/meeting/myMeetings.vue'//会议管理-会议日程
import history from './components/meeting/history.vue'//会议管理-历史会议

import siteManagement from './components/home/siteManagement.vue' //站点管理

import terminalManage from './components/home/terminalManage.vue'//设备管理

import userManager from './components/users/userManager.vue'//用户-用户管理
import endpointManagement from './components/users/endpointManagement.vue'//用户-终端管理
import confRooms from './components/users/confRooms.vue'//用户-会议室

import conferenceTemplates from './components/home/conferenceTemplates.vue'//会议模版

import virtualConfRooms from './components/home/virtualConfRooms.vue'//虚拟会议室

import meetingOverview from './components/reports/meetingOverview.vue'//统计报告-会议总览
import meetingList from './components/reports/meetingList.vue'//统计报告-会议详单

import operationLog from './components/home/operationLog.vue'//操作日志


Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

const routes = [
  {
    path: '/login',
    component: Login,
    hidden: true//不显示在导航中
  },
  
  {
    path: '/',
    component: Home,
    iconCls: 'fa fa-id-card-o',
    hidden: false,//不显示在导航中
    leaf: true,//只有一个节点
    children: [
      { path: '/adminHomePage', component: adminHomePage, name: '系统状态' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '会议管理',
    iconCls: 'fa fa-id-card-o',
    //leaf: false,//只有一个节点
    children: [
      { path: '/book', component: book, name: '发起会议' },
      { path: '/myMeetings', component: myMeetings, name: '会议日程' },
      { path: '/history', component: history, name: '历史会议' }
    ]
  },

  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-id-card-o',
    leaf: true,//只有一个节点
    children: [
      { path: '/siteManagement', component: siteManagement, name: '站点管理' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-bar-chart',
    leaf: true,//只有一个节点
    children: [
      { path: '/terminalManage', component: terminalManage, name: '设备管理' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '用户管理',
    iconCls: 'el-icon-message',//图标样式class
    //leaf: true,//只有一个节点
    children: [
      //{ path: '/main', component: Main },
      { path: '/userManager', component: userManager, name: '用户管理' },
      { path: '/endpointManagement', component: endpointManagement, name: '终端管理' },
      { path: '/confRooms', component: confRooms, name: '会议室' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-bar-chart',
    leaf: true,//只有一个节点
    children: [
      { path: '/conferenceTemplates', component: conferenceTemplates, name: '会议模版' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-bar-chart',
    leaf: true,//只有一个节点
    children: [
      { path: '/virtualConfRooms', component: virtualConfRooms, name: '虚拟会议室' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '统计报告',
    iconCls: 'fa fa-bar-chart',
    //leaf: true,//只有一个节点
    children: [
      { path: '/meetingOverview', component: meetingOverview, name: '会议总览' },
      { path: '/meetingList', component: meetingList, name: '会议详单' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-bar-chart',
    leaf: true,//只有一个节点
    children: [
      { path: '/operationLog', component: operationLog, name: '操作日志' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-address-card',
    leaf: true,//只有一个节点
    children: [
      { path: '/Login', component: Login, name: '注销' }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start();
  next()
})

router.afterEach(transition => {
  NProgress.done();
});

new Vue({
  el: '#app',
  template: '<App/>',
  router,
  store,
  components: { App }
  //render: h => h(Login)
}).$mount('#app')

//router.replace('/login')
