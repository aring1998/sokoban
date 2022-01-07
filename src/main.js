import Vue from 'vue'
import App from './App'
import store from './store'
Vue.config.productionTip = false

import uView from 'uview-ui'
Vue.use(uView)

import 'ant-design-icons/dist/anticons.min.css'

import { api } from './utils/api'
Vue.prototype.$api = api

import './utils/appback'

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
