import Vue from "vue"
import Vuex from "vuex"
import mutations from '@/store/mutations'
import getters from '@/store/getters'
import actions from '@/store/actions'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    theme: window.localStorage.getItem('theme') || 'theme-forest'
  },
  mutations,
  getters,
  actions,
  mudules: {

  }
})

// 导出
export default store