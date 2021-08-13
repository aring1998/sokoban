import { Notify } from 'vant'

export default {
  // 检测是否登录
  checkLogin() {
    if (!this.state.username) {
      Notify({ type: 'danger', message: '您需要先登录！' })
      return false
    }
    return true
  }
}