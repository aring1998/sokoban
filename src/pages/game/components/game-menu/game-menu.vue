<template>
  <view class="game-menu">
    <view class="top-form">
      <view class="top-form-item">
        <span>音乐</span>
        <u-switch v-model="music" size="18"></u-switch>
      </view>
    </view>
    <view class="bottom-form">
      <view class="bottom-form-item" @click="goIndex">
        <i class="ai-home" style="font-size: 50rpx"></i>
        <span>首页</span>
      </view>
      <view class="bottom-form-item">
        <i class="ai-share-alt" style="font-size: 50rpx"></i>
        <span>分享</span>
      </view>
      <view class="bottom-form-item">
        <i class="ai-question-circle-o" style="font-size: 50rpx"></i>
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
  .bottom-form {
    border-top: 4rpx #e8eaed solid;
    padding-top: 40rpx;
    display: flex;
    justify-content: space-around;
    .bottom-form-item {
      display: flex;
      flex-flow: column nowrap;
      i {
        margin-bottom: 4rpx;
      }
      span {
        font-size: 32rpx;
      }
    }
  }
}
</style>