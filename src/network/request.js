import axios from 'axios'
import store from '@/store'
import { Notify } from 'vant'

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
    console.log(err);
  }
  // 响应拦截
  instance.interceptors.response.use(res => {
    if (res.status != 200) Notify({ type: 'danger', message: '网络请求错误，错误：' + res.statusText })
    if (res.data.code != 0) Notify({ type: 'danger', message: res.data.msg })
    return res.data  // 配置只返回data
  }), err => {
    console.log(err);
  }

  // 发送网络请求
  return instance(config)
}