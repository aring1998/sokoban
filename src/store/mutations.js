import { Notify } from 'vant'
import { request } from '@/network/request'

export default {
  // 检测是否登录
  checkLogin() {
    if (!this.state.userInfo.name) {
      Notify({ type: 'danger', message: '您需要先登录！' })
      return false
    }
    return true
  },
  // 验证token
  token() {
    request({
      url: 'user/token',
      method: 'POST'
    }).then(res => {
      if (res.code == 0) {
        this.state.userInfo = res.data
        Notify({ type: 'success', message: '欢迎回来，' + res.data.name })
      }
    })
  }
}