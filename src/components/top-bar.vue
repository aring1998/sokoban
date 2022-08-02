<template>
  <view class="top-bar">
    <img src="https://source.aring.cc/assets/project/sokoban/imgs/common/back.png" alt="" @click="back" />
    <view class="common-title">{{ title }}</view>
    <view class="item">
      <img v-if="showRight" src="https://source.aring.cc/assets/project/sokoban/imgs/common/search.png" alt="" @click="$emit('search')" />
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: String,
    showRight: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    back() {
      uni.navigateTo({
        url: '/pages/index/index'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
  .item {
    height: 80rpx;
    width: 80rpx;
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
    background-image: url('https://source.aring.cc/assets/project/sokoban/imgs/common/common-title.png');
  }
}
</style>
