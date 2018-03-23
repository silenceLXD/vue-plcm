import axios from 'axios'
/*import router from '../main'*/
import util from './util'
axios.defaults.timeout = 2000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';           //配置请求头
axios.defaults.baseURL = 'http://172.18.4.51:8086';   //配置接口地址 172.18.7.172:8086

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    const token = util.getCookie('sessionToken'); //获取Cookie
    if (token) {
        config['headers']['common']['Session-Token'] = token;//后台接收的参数，后面我们将说明后台如何接收
    }
    // console.log(config);
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log(response);
    if(response.data.code == 1302) {
        // router.push({
        //     path: '/login',
        //     query: {redirect: router.currentRoute.fullPath} //从哪个页面跳转
        // })
        window.location.href=util.getPath()+"#/login";
        // router.replace('/login');
    }
    return response;
}, function (error) {
    // 对响应错误做点什么
    if (error.response) {
        switch (error.response.status) {
            case 401:
                // 返回 401 清除token信息并跳转到登录页面
                router.replace({
                    path: 'login',
                    query: {redirect: router.currentRoute.fullPath}
                })
        }
    }
    return Promise.reject(error.response.data)
    //return Promise.reject(error);
});
