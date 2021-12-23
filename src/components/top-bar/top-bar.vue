<template>
  <view class="top-bar">
    <img src="../../static/img/common/back.png" alt="" @click="back">
    <img src="../../static/img/common/settings.png" alt="">
  </view>
</template>

<script>
export default {
  methods: {
    back() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss">
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  img {
    height: 80rpx;
    width: 80rpx;
    border-radius: 50%;
  }
}
</style>