<template>
  <view class="index-menu">
    <view class="menu">
      <img src="~@/static/img/index-menu/help.png" alt="" @click="$refs.help.show()">
      <i class="ai-user" />
    </view>
    <ar-popup ref="help" type="paper">
      <help-info></help-info>
    </ar-popup>
  </view>
</template>

<script>
import ArPopup from '@/components/ar-popup.vue'
import HelpInfo from '@/components/help-info.vue'
export default {
  components: { ArPopup, HelpInfo }
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
      background-color: rgba($color: #000, $alpha: .2);
      border-radius: 50%;
      width: 80rpx;
      height: 80rpx;
    }
    i {
      color: rgb(87, 87, 87);
      font-weight: bold;
      font-size: 60rpx;
    }
  }
}
</style>
