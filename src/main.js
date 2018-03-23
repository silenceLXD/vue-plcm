import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'

/*import 'element-ui/lib/theme-default/index.css'*/
import 'assets/css/element-poly-theme/index.css'
import 'assets/css/polycom-theme.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import NProgress from 'nprogress'//页面顶部进度条
import 'nprogress/nprogress.css'
import "../node_modules/font-awesome/css/font-awesome.min.css"//字体图标
import "assets/css/polycom-font-icon/style.css"//字体图标
import "../node_modules/flex.css/dist/flex.css"
import $ from 'jquery'
import filter from './common/filter'
import axios from './common/axiosApi'
import util from './common/util'


import Login from './views/Login.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'

import adminHomePage from './views/home/adminHomePage.vue'//系统状态

import book from './views/meeting/book.vue'//会议管理-发起会议
import myMeetings from './views/meeting/myMeetings.vue'//会议管理-会议日程
import history from './views/meeting/history.vue'//会议管理-历史会议

import siteManagement from './views/home/siteManagement.vue' //站点管理

import terminalManage from './views/home/terminalManage.vue'//设备管理

import userManager from './views/users/userManager.vue'//用户-用户管理
import endpointManagement from './views/users/endpointManagement.vue'//用户-终端管理
import confRooms from './views/users/confRooms.vue'//用户-会议室
import importList from './views/users/importList.vue'//导入通讯录

import conferenceTemplates from './views/home/conferenceTemplates.vue'//会议模版

import virtualConfRooms from './views/home/virtualConfRooms.vue'//虚拟会议室

import meetingOverview from './views/reports/meetingOverview.vue'//统计报告-会议总览
import meetingList from './views/reports/meetingList.vue'//统计报告-会议详单

import operationLog from './views/home/operationLog.vue'//操作日志


Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

var EventBus = new Vue();
Object.defineProperties(Vue.prototype, {
    $eventBus: {
        get: function () {
            return EventBus;
        }
    }
});
Vue.prototype.axios = axios;
Vue.prototype.util = util;
const routes = [
    {
        path: '/',
        component: Login,
        hidden: true//不显示在导航中
    },
  {
    path: '/login',
    component: Login,
    hidden: true//不显示在导航中
  },

  {
    path: '/adminHomePage',
    component: Home,
    iconCls: 'fa icon-poly-nav-home',
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
    iconCls: 'fa icon-poly-nav-meeting',
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
    iconCls: 'fa icon-poly-nav-site',
    leaf: true,//只有一个节点
    children: [
      { path: '/siteManagement', component: siteManagement, name: '站点管理' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa icon-poly-nav-facility',
    leaf: true,//只有一个节点
    children: [
      { path: '/terminalManage', component: terminalManage, name: '设备管理' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '用户管理',
    iconCls: 'fa icon-poly-nav-user',//图标样式class
    //leaf: true,//只有一个节点
    children: [
      //{ path: '/main', component: Main },
      { path: '/userManager', component: userManager, name: '用户管理' },
      { path: '/endpointManagement', component: endpointManagement, name: '终端管理' },
      { path: '/confRooms', component: confRooms, name: '会议室' },
      /*{ path: '/importList', component: importList, name: '导入通讯录',hidden:false, }*/
    ]
  },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa icon-poly-nav-template',
        leaf: true,//只有一个节点
        hidden:true,
        children: [
            { path: '/importList', component: importList, name: '导入通讯录' }
        ]
    },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa icon-poly-nav-template',
    leaf: true,//只有一个节点
    children: [
      { path: '/conferenceTemplates', component: conferenceTemplates, name: '会议模版' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa icon-poly-nav-meetingroom',
    leaf: true,//只有一个节点
    children: [
      { path: '/virtualConfRooms', component: virtualConfRooms, name: '虚拟会议室' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '统计报告',
    iconCls: 'fa icon-poly-nav-statistics',
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
    iconCls: 'fa icon-poly-nav-log',
    leaf: true,//只有一个节点
    children: [
      { path: '/operationLog', component: operationLog, name: '操作日志' }
    ]
  }
  // ,
  // {
  //   path: '/',
  //   component: Home,
  //   name: '',
  //   iconCls: 'fa fa-address-card',
  //   leaf: true,//只有一个节点
  //   children: [
  //     { path: '/echarts', component: echarts, name: '注销' }
  //   ]
  // }
]
const router = new VueRouter({routes});

router.beforeEach((to, from, next) => {
  NProgress.start();
  next()
});

router.afterEach(transition => {
  NProgress.done();
});


new Vue({
  el: '#app',
  template: '<App/>',
  router,
  store,
  components: { App },
  // created(){
  //     this.isTimeout()
  // },
  // methods:{
  //     isTimeout(){
  //         setTimeout(()=>{
  //             router.replace('/login')
  //         },360000)
  //     }
  // }
  // render: h => h(Login)
}).$mount('#app');

// router.replace('/login')
