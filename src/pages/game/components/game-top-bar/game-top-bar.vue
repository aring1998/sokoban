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
      <img src="~@/static/img/common/settings.png" alt="" @click="$emit('showMenu')" />
    </view>
    <view class="game-action">
      <i class="ai-rollback" @click="$emit('regret')" />
      <i class="ai-reload" @click="$emit('reset')" />
      <i class="ai-form" @click="backEdit" v-show="showEdit" />
    </view>
    <view class="map-name" @click="showMapName">
      <span>{{ mapName }}</span>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      modalShow: false
    }
  },
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
    },
    showEdit: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    backEdit() {
      uni.navigateTo({
        url: '/pages/create/index?type=back'
      })
    },
    showMapName() {
      if (this.mapName.length > 8) {
        uni.showToast({ title: this.mapName, icon: 'none' })
      }
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
    i {
      font-size: 40rpx;
      background-color: #e8eaed;
      border-radius: 50%;
      padding: 10rpx;
      margin-right: 20rpx;
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
    max-width: 320rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
