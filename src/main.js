import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)

import Moment from 'moment'
// 定义全局时间戳过滤器
Vue.filter('formatDate', function(value) {
  return Moment(value).format('YYYY-MM-DD')
})

/**
 * 复制文本插件
 * 使用: this.$copyText(text)
 */
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard);
VueClipboard.config.autoSetContainer = true

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
