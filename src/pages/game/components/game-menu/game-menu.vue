<template>
  <view class="game-menu">
    <view class="top-form">
      <view class="top-form-item">
        <span>音乐</span>
        <u-switch v-model="music" size="18"></u-switch>
      </view>
    </view>
    <view class="common-bottom-form">
      <view class="common-bottom-form-item" @click="goIndex">
        <i class="ai-home"></i>
        <span>首页</span>
      </view>
      <view class="common-bottom-form-item">
        <i class="ai-share-alt"></i>
        <span>分享</span>
      </view>
      <view class="common-bottom-form-item">
        <i class="ai-question-circle-o"></i>
        <span>帮助</span>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      music: true
    }
  },
  methods: {
    goIndex() {
      uni.redirectTo({
        url: '/pages/index/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.game-menu {
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
</style>