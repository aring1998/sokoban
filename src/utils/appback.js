import { Toast } from 'vant'
import router from '@/router'

// 处理hbuilder打包app之后点击手机返回键直接退出app的问题
let first = null
document.addEventListener('plusready', function() {
  const webview = plus.webview.currentWebview()
  plus.key.addEventListener('backbutton', function() {
    const currentPath = router.currentRoute.path
    if (currentPath === '/' || currentPath === '/index') {
      // 首页返回键处理，1秒内，连续两次按返回键，则退出应用
      if (!first) {
        first = new Date().getTime()
        Toast('再按一次退出游戏')
        setTimeout(function() {
          first = null
        }, 1000)
      } else {
        if (new Date().getTime() - first < 1500) {
          plus.runtime.quit()
        }
      }
    } else webview.back()
  })
})
