<template>
  <div id="app" :class="$store.state.theme">
    <router-view />
  </div>
</template>

<script>
import { request } from '@/network/request'

export default {
  name: 'App',
  created() {
    this.token()
    this.getVersion()
  },
  methods: {
    // 验证token
    token() {
      request({
        url: 'user/token',
        method: 'POST'
      }).then(res => {
        if (res.code == 0) {
          this.$store.state.username = res.data.name
          this.$notify({ type: 'success', message: '欢迎回来，' + res.data.name })
        }
      })
    },
    // 获取最新版本
    getVersion() {
      request({
        url: 'version/latest',
        method: 'GET'
      }).then(res => {
        console.log(res.code);
        if (res.code == 0) {
          if (res.data.versionId > this.$store.state.version) {
            this.$dialog.confirm({
              title: '有新版本啦！',
              message: '点击[确定]按钮前往下载最新版本'
            }).then(() => {
              window.location.href
            })
          }
        }
      })
    }
  }
}
</script>

<style>
@import url('/assets/css/base.css');
@import url('/assets/css/theme.css');
</style>
