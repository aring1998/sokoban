<template>
  <view class="top-bar">
    <img src="../../static/img/common/back.png" alt="" @click="back">
    <view class="common-title">创意工坊</view>
    <img src="../../static/img/common/search.png" alt="" @click="$emit('search')">
  </view>
</template>

<script>
export default {
  methods: {
    back() {
      uni.navigateTo({
        url: '/pages/index/index'
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../uni.scss';
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 200rpx;
  img {
    height: 80rpx;
    width: 80rpx;
    border-radius: 50%;
  }
  .common-title {
    width: 400rpx;
    height: 120rpx;
    line-height: 120rpx;
    font-size: 40rpx;
    font-weight: bold;
    color: $main-span-color;
    text-align: center;
    margin: 0 auto;
    background-image: url('../../static/img/common/common-title.png');
  }
}
</style>