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
      <img src="http://81.68.189.158:88/project/sokoban-static/img/common/settings.png" alt="" @click="$emit('showMenu')" />
    </view>
    <view class="game-action">
      <i class="ai-rollback" @click="$emit('regret')" />
      <i class="ai-reload" @click="$emit('reset')" />
      <i class="ai-form" @click="backEdit" v-show="showEdit" />
      <i :class="gameMap.hasPraise === '1' ? 'ai-like' : 'ai-like-o'" v-show="showLike" @click="like" />
      <i :class="gameMap.hasCollect === '1' ? 'ai-star' : 'ai-star-o'" v-show="showLike" @click="collect" />
      <i class="ai-upload" v-show="showUpload" @click="$emit('upload')" />
    </view>
    <view class="map-name" @click="showMapName">
      <span>{{ gameMap.mapName || '(未命名)' }}</span>
    </view>
    <view class="best-step">
      <i class="ai-star-o" />
      <span>{{ gameMap.stepsPas || '**' }}</span>
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
    gameMap: {
      type: Object,
      default: () => {}
    },
    step: {
      type: Number,
      default: 0
    },
    life: {
      type: [Number, String],
      default: 0
    },
    showEdit: {
      type: Boolean,
      default: false
    },
    showLike: {
      type: Boolean,
      default: false
    },
    showUpload: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    backEdit() {
      uni.navigateTo({
        url: '/pack-create/pages/index?type=back'
      })
    },
    showMapName() {
      if (this.mapName.length > 8) {
        uni.showToast({ title: this.mapName, icon: 'none' })
      }
    },
    async like() {
      if (!this.$store.getters.checkLogin) return
      const res = await this.$api.get(`like/${this.gameMap.id}`)
      if (res.code === 0) {
        this.gameMap.hasPraise = this.gameMap.hasPraise === '1' ? '0' : '1'
        uni.showToast({ title: res.msg, icon: 'none' })
      }
    },
    async collect() {
      if (!this.$store.getters.checkLogin) return
      const res = await this.$api.get(`collect/${this.gameMap.id}`)
      if (res.code === 0) {
        this.gameMap.hasCollect = this.gameMap.hasCollect === '1' ? '0' : '1'
        uni.showToast({ title: res.msg, icon: 'none' })
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
  .best-step {
    position: absolute;
    top: 100rpx;
    left: calc(100% - 630rpx);
    font-size: 28rpx;
    background-color: #e8eaed;
    padding: 6rpx 30rpx;
    border-radius: 99px;
    i {
      margin-right: 16rpx;
    }
  }
}
</style>
