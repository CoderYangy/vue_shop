import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
// 富文本编译器及样式
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' 
import 'quill/dist/quill.snow.css' 
import 'quill/dist/quill.bubble.css' 


// 导入全局样式表
import 'assets/css/fonts/iconfont.css'
import 'assets/css/global.css'
import axios from 'axios'
// 导入moment.js 进行时间转码
import moment from 'moment'
// 添加过滤器 fmtdata 引用moment转码成(年年年年-月月-日日)格式
Vue.filter('fmtdate', (v) => {
	return moment.unix(v).format('YYYY-MM-DD hh:mm:ss')
})
// Vue.prototype.$moment = moment

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须return
  return config
  
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 注册为全局组件
Vue.use(VueQuillEditor)

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
