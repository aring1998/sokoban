import axios from 'axios'
import axiosAdapterUniapp from 'axios-adapter-uniapp'
import store from '../store'
// 创建axios实例
const instance = axios.create({
  // baseURL: 'http://localhost:3006/api',
  baseURL: 'https://api.aring.cc/sokoban/api',
  timeout: 30000,
  // 允许返回所有状态码，不会遇到错误就停止
  validateStatus: status => status >= 200 && status <= 600,
  adapter: axiosAdapterUniapp
})

// 请求拦截
instance.interceptors.request.use(config => {
  uni.showLoading({ title: '加载中...' })
  config.headers.token = store.state.token
  return config
}),
  err => {
    console.log(err)
  }
// 响应拦截
instance.interceptors.response.use(res => {
  uni.hideLoading()
  if (res.status < 200 || res.status > 400) return uni.showToast({ title: '网络请求错误', icon: 'none' })
  if (res.data.code !== 0) uni.showToast({ title: res.data.message || '网络请求错误', icon: 'none' })
  return res.data // 配置只返回data
}),
  err => {
    console.log(err)
  }

// 封装get/post方法
export const api = {
  async get(url, params) {
    try {
      const res = await instance.get(url, { params })
      return new Promise(resolve => {
        resolve(res)
      })
    } catch (err) {
      uni.showToast({ title: '网络请求错误', icon: 'none' })
      console.log(err)
    }
  },
  async post(url, data) {
    try {
      const res = await instance.post(url, data)
      return new Promise(resolve => {
        resolve(res)
      })
    } catch (err) {
      uni.showToast({ title: '网络请求错误', icon: 'none' })
      console.log(err)
    }
  }
}
