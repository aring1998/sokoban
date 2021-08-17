import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/mutations'
import getters from '@/store/getters'
import actions from '@/store/actions'
import versionConfig from '@/assets/config/version.json'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    username: '',
    token: window.localStorage.getItem('token') || '',
    theme: window.localStorage.getItem('theme') || 'theme-forest',
    version: versionConfig.version,
    bgmPlay: true
  },
  mutations,
  getters,
  actions,
  mudules: {},
})

// 导出
export default store
