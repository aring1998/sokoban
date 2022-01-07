import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import { api } from '@/utils/api'

const store = new Vuex.Store({
  state: {
    userInfo: {
      id: '1448255643403292673',
      name: 'test',
      emaile: '',
      coin: '',
      nickname: ''
    },
    token: '5451668056514bb8bc5d8efa4440f710',
    // token: uni.getStorageSync('token'),
    bgmPlay: true
  },
  mutations: {
    setUserInfo(_, res) {
      if (res.code === 0) this.state.userInfo = res.data
      else uni.removeStorageSync('token')
    }
  },
  getters: {
    checkLogin(state) {
      if (!state.userInfo.name) {
        uni.showToast({ title: '您需要先登录', icon: 'none' })
        return false
      }
      return true
    }
  },
  actions: {
    async token() {
      const res = await api.post('user/token')
      if (res.code === 0) {
        this.commit('setUserInfo', res)
      }
    }
  },
  mudules: {}
})

export default store
