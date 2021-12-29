import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false

import uView from 'uview-ui'
Vue.use(uView)

import 'ant-design-icons/dist/anticons.min.css'

import { api } from './utils/api'
Vue.prototype.$api = api


App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
