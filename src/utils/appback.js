// 处理hbuilder打包app之后点击手机返回键直接退出app的问题
let first = null
document.addEventListener('plusready', function() {
  const webview = plus.webview.currentWebview()
  plus.key.addEventListener('backbutton', function() {
    // 获取当前路由
    const routes = getCurrentPages()
    const currentPath = routes[routes.length - 1].route
    if (currentPath === '/' || currentPath === 'pages/index/index') {
      // 首页返回键处理，1秒内，连续两次按返回键，则退出应用
      if (!first) {
        first = new Date().getTime()
        uniq.showToast('😫再按一次退出游戏')
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
