<template>
  <view class="game-menu">
    <view class="main">
      <view class="top-form">
        <view class="top-form-item" @click="bgmPlay">
          <span>音乐</span>
          <u-switch v-model="$store.state.bgmPlay" size="18"></u-switch>
        </view>
      </view>
      <view class="common-bottom-form">
        <view class="common-bottom-form-item" @click="goIndex">
          <i class="ai-home"></i>
          <span>首页</span>
        </view>
        <view class="common-bottom-form-item" @click="share">
          <i class="ai-share-alt"></i>
          <span>分享</span>
        </view>
        <view class="common-bottom-form-item" @click="$refs.help.show()">
          <i class="ai-question-circle-o"></i>
          <span>帮助</span>
        </view>
      </view>
    </view>
    <ar-popup ref="help" type="paper">
      <help-info></help-info>
    </ar-popup>
  </view>
</template>

<script>
import ArPopup from '@/components/ar-popup.vue'
import ArForm from '@/components/ar-form.vue'
import HelpInfo from '@/components/help-info.vue'
import { copyToClipboard } from '@/utils/index'
export default {
  components: { ArPopup, ArForm, HelpInfo },
  methods: {
    bgmPlay() {
      this.$music.bgmPlay(this.$store.state.bgmPlay)
      uni.setStorageSync('bgmPlay', JSON.stringify(this.$store.state.bgmPlay))
    },
    goIndex() {
      uni.redirectTo({
        url: '/pages/index/index'
      })
    },
    share() {
      const url = window.location.href
      if (url.includes('aring.cc')) {
        copyToClipboard(url)
      } else {
        copyToClipboard('https://www.taptap.com/app/224432/')
      }
      uni.showToast({
        title: '复制链接成功，快去分享给好友吧！',
        icon: 'success',
        duration: 5000
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.game-menu {
  .main {
    display: flex;
    flex-flow: column nowrap;
    padding: 40rpx;
    height: 600rpx;
    justify-content: space-between;
    .top-form {
      .top-form-item {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
