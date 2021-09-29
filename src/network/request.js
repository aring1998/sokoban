import axios from 'axios'
import store from '@/store'
import { Notify, Toast } from 'vant'

export function request(config) {
  // 创建axios实例
  const instance = axios.create({
    // baseURL: 'http://47.103.218.109:10052/api/', // 正式环境
    baseURL: 'http://81.68.189.158:10052/sokoban/app/v1/', // 正式环境
    // baseURL: 'http://127.0.0.1:10052/api/', // 测试环境
    validateStatus: status => {
      // 允许返回所有状态码，不会遇到错误就停止
      return status >= 200 && status <= 600
    }
  })

  // 请求拦截
  instance.interceptors.request.use(config => {
    Toast.loading({ message: '加载中', forbidClick: true })
    config.headers.Authorization = `Bearer ${store.state.token}`
    return config
  }), err => {
    console.log(err);
  }
  // 响应拦截
  instance.interceptors.response.use(res => {
    Toast.clear()
    if (res.status !== 200) Notify({ type: 'danger', message: `网络请求错误，错误：${res.statusText}` })
    if (res.data.code !== 0) Notify({ type: 'danger', message: res.data.msg })
    return res.data  // 配置只返回data
  }), err => {
    console.log(err);
  }

  // 发送网络请求
  return instance(config)
}