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
    this.getVersion()
    this.$store.dispatch('token') 
  },
  mounted() {
    // 根据缓存决定bgm是否播放
    this.$store.state.bgmPlay = JSON.parse(window.localStorage.getItem('bgmPlay'))
    if (this.$store.state.bgmPlay == null || this.$store.state.bgmPlay) {
      this.$store.state.bgmPlay = true
      this.$refs.bgm.play()
    }
    else {
      this.$store.state.bgmPlay = false
      this.$refs.bgm.pause()
    }
  },
  methods: {
    // 获取最新版本
    getVersion() {
      request({
        url: 'version/latest',
        method: 'GET'
      }).then(res => {
        if (res.code == 0) {
          if (res.data.versionId !== this.$store.state.version) {
            // 判断是否强制更新
            if (res.data.isForce) {
              this.$dialog.alert({
                title: '有重大更新！',
                message: '点击[确定]按钮前往下载最新版本'
              }).then(() => {
                window.location.href
              })
            } 
            else {
              this.$dialog.confirm({
                title: '有新版本啦！',
                message: '点击[确定]按钮前往下载最新版本'
              }).then(() => {
                window.location.href
              })
            }
          }
        }
      })
    }
  }
}
</script>

<style>
@import url('/assets/css/base.css');
</style>
