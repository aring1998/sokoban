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
        else {
          this.$notify({ type: 'danger', message: res.msg })
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
