import { Notify } from 'vant'
import { request } from '@/network/request'

export default {
  // 验证token
  token() {
    request({
      url: 'user/token',
      method: 'POST'
    }).then(res => {
      if (res.code === 0) {
        this.state.userInfo = res.data
        Notify({ type: 'success', message: `欢迎回来，${res.data.name}` })
      } else window.localStorage.removeItem('token')
    })
  }
}