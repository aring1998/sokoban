import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import { api } from '@/utils/api'

const store = new Vuex.Store({
  state: {
    userInfo: {
      id: '',
      name: '',
      email: '',
      coin: '',
      nickname: ''
    },
    token: uni.getStorageSync('token'),
    bgmPlay: JSON.parse(uni.getStorageSync('bgmPlay') || true)
  },
  mutations: {
    setUserInfo(_, res) {
      if (res.code === 0) {
        this.state.userInfo = res.data
        uni.showToast({ title: `欢迎回来，${res.data.name}` })
      } else uni.removeStorageSync('token')
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
      } else {
        uni.removeStorageSync('token')
        for (let key in store.state.userInfo) {
          store.state.userInfo[key] = ''
        }
      }
    }
  },
  mudules: {}
})

export default store
