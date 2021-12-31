<template>
  <view class="game-result">
    <h2>你赢了</h2>
    <view class="common-bottom-form">
      <view class="common-bottom-form-item" @click="goIndex">
        <i class="ai-home"></i>
        <span>首页</span>
      </view>
      <view class="common-bottom-form-item" @click="$emit('reset')">
        <i class="ai-reload"></i>
        <span>重玩</span>
      </view>
      <view class="common-bottom-form-item" @click="$emit('nextLevel')">
        <i class="ai-arrow-right"></i>
        <span>下一关</span>
      </view>
    </view>
  </view>
</template>

<script>
export default {
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
.game-result {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  h2 {
    text-align: center;
    font-weight: bold;
    font-size: 80rpx;
    margin: 60rpx 0;
    color: red;
  }
}
</style>