import axios from 'axios'
import store from '@/store'

export function request(config) {
  // 创建axios实例
  const instance = axios.create({
    baseURL: 'http://47.103.218.109:10052/api/'
  })

  // 请求拦截
  instance.interceptors.request.use(config => {
    config.headers.Authorization = 'Bearer ' + store.state.token
    return config
  }), err => {

  }
  // 响应拦截
  instance.interceptors.response.use(res => {
    return res.data  // 配置只返回data
  }), err => {

  }

  // 发送网络请求
  return instance(config)
}