// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import './assets/css/ali-font/iconfont.css'
import axios from 'axios';
import treeTransfer from 'el-tree-transfer'
Vue.component('tree-transfer', treeTransfer)

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$http = axios
axios.defaults.baseURL = "http://localhost:8082/"
    //axios.interceptors.request.use(config => {
    //   config.headers.authorization = window.sessionStorage.getItem('token');
    //   return config;
    //})


new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})