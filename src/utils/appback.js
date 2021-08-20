import { Toast } from 'vant'
/**
 * 处理hbuilder打包app之后点击手机返回键直接退出app的问题
 */
document.addEventListener('plusready', function() {
  var webview = plus.webview.currentWebview()
  plus.key.addEventListener('backbutton', function() {
    webview.canBack(function(e) {
      if (e.canBack) {
        webview.back()
      } else {
        // 首页返回键处理，1秒内，连续两次按返回键，则退出应用；
        var first = null
        plus.key.addEventListener('backbutton',function() {
            if (!first) {
              first = new Date().getTime()
              Toast('再按一次退出应用')
              setTimeout(function() {
                first = null
              }, 1000)
            } else {
              if (new Date().getTime() - first < 1500) {
                plus.runtime.quit()
              }
            }
          },
          false
        )
      }
    })
  })
})
