<template>
  <div id="app" :class="$store.state.theme">
    <!-- 背景音乐 -->
    <audio :src="require('@/assets/audio/bgm.mp3')" class="media-audio" loop autoplay ref="bgm"></audio>
    <keep-alive include="workshop">
      <router-view />
    </keep-alive>
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
  mounted() {
    // 根据缓存决定bgm是否播放
    this.$store.state.bgmPlay = JSON.parse(window.localStorage.getItem('bgmPlay'))
    if (this.$store.state.bgmPlay == null || this.$store.state.bgmPlay) this.$refs.bgm.play()
    else this.$refs.bgm.pause()
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
