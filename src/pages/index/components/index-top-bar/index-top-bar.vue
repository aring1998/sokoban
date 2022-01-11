<template>
  <view class="index-menu">
    <u-notify ref="notify"></u-notify>
    <view class="menu">
      <img src="~@/static/img/index-menu/help.png" alt="" @click="$refs.help.show()" />
      <view class="icons">
        <i class="ai-sound" @click="bgmPlay" :class="{ mute: !$store.state.bgmPlay }" />
        <i class="ai-user" @click="goUser" />
      </view>
    </view>
    <ar-popup ref="help" type="paper">
      <help-info></help-info>
    </ar-popup>
    <ar-popup ref="user" class="user-info">
      <h4>用户信息</h4>
      <p>uid：{{ this.$store.state.userInfo.id }}</p>
      <p>用户名：{{ this.$store.state.userInfo.name }}</p>
      <p>邮箱：{{ this.$store.state.userInfo.email }}</p>
      <view class="btn">
        <button size="mini" @click="logOut">退出登录</button>
      </view>
    </ar-popup>
  </view>
</template>

<script>
import ArPopup from '@/components/ar-popup.vue'
import HelpInfo from '@/components/help-info.vue'
export default {
  components: { ArPopup, HelpInfo },
  methods: {
    bgmPlay() {
      this.$store.state.bgmPlay = !this.$store.state.bgmPlay
      this.$music.bgmPlay(this.$store.state.bgmPlay)
      uni.setStorageSync('bgmPlay', JSON.stringify(this.$store.state.bgmPlay))
    },
    goUser() {
      if (this.$store.state.userInfo.id) this.$refs.user.show()
      else uni.navigateTo({ url: '/pages/user/index' })
    },
    logOut() {
      for (let i in this.$store.state.userInfo) {
        this.$store.state.userInfo[i] = ''
      }
      uni.removeStorageSync('token')
      this.$refs.user.show()
      this.$refs.notify.show({ type: 'success', message: '退出登录成功' })
    }
  }
}
</script>

<style lang="scss" scoped>
.index-menu {
  .menu {
    height: 120rpx;
    padding: 0 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    i,
    img {
      display: block;
      padding: 10rpx;
      background-color: rgba($color: #000, $alpha: 0.2);
      border-radius: 50%;
      width: 80rpx;
      height: 80rpx;
    }
    .icons {
      display: flex;
      i {
        color: rgb(87, 87, 87);
        font-weight: bold;
        font-size: 60rpx;
      }
      i:nth-child(1) {
        margin-right: 16rpx;
      }
      i.mute {
        background: rgba($color: #000, $alpha: 0.2) linear-gradient(45deg, transparent 46%, #333 46%, #333 54%, transparent 54%);
      }
    }
  }
  .user-info {
    h4 {
      text-align: center;
      margin-bottom: 8rpx;
      font-size: 50rpx;
    }
    p {
      display: block;
      margin: 6rpx 0;
    }
    .btn {
      margin-top: 8rpx;
      text-align: center;
    }
  }
}
</style>
