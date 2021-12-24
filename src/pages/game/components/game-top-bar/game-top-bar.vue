<template>
  <view class="game-top-bar">
    <view class="info-wrap">
      <view class="info-item">
        <span>步数</span>
        <span>{{ step }}</span>
      </view>
      <view class="info-division"></view>
      <view class="info-item">
        <span>生命</span>
        <span>{{ life }}</span>
      </view>
    </view>
    <view class="settings">
      <img src="~@/static/img/common/settings.png" alt="" @click="$emit('showMenu')">
    </view>
    <view class="game-action">
      <img src="~@/static/img/game/back.png" alt="" @click="$emit('regret')">
      <img src="~@/static/img/game/reset.png" alt="" @click="$emit('reset')">
    </view>
    <view class="map-name">
      <span>{{ mapName }}</span>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 0
    },
    life: {
      type: [Number, String],
      default: 0
    },
    mapName: {
      type: String,
      default: '(无名关卡)'
    }
  }
}
</script>

<style lang="scss" scoped>
.game-top-bar {
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 40rpx;
  margin: 0 40rpx;
  padding: 0 40rpx;
  position: relative;
  .info-wrap {
    display: flex;
    .info-item {
      display: flex;
      flex-flow: column nowrap;
      text-align: center;
      span:nth-child(1) {
        font-size: 28rpx;
      }
    }
    .info-division {
      height: 60rpx;
      width: 4rpx;
      margin: 0 20rpx;
      background-color: #e8eaed;
      align-self: center;
    }
  }
  .settings {
    img {
      height: 60rpx;
      width: 60rpx;
    }
  }
  .game-action {
    position: absolute;
    right: 100rpx;
    bottom: -30rpx;
    img {
      height: 50rpx;
      width: 50rpx;
      background-color: #e8eaed;
      border-radius: 50%;
      margin-right: 30rpx;
    }
  }
  .map-name {
    position: absolute;
    top: 0;
    right: 140rpx;
    background-color: #e8eaed;
    font-size: 28rpx;
    padding: 6rpx 30rpx;
    border-bottom-right-radius: 20rpx;
    border-bottom-left-radius: 20rpx;
  }
}
</style>