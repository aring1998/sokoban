<template>
  <view class="game-menu">
    <view class="main">
      <view class="top-form">
        <view class="top-form-item">
          <span>音乐</span>
          <u-switch v-model="music" size="18"></u-switch>
        </view>
      </view>
      <view class="common-bottom-form">
        <view class="common-bottom-form-item" @click="goIndex">
          <i class="ai-home"></i>
          <span>首页</span>
        </view>
        <view class="common-bottom-form-item">
          <i class="ai-share-alt"></i>
          <span>分享</span>
        </view>
        <view class="common-bottom-form-item" @click="$refs.help.show()">
          <i class="ai-question-circle-o"></i>
          <span>帮助</span>
        </view>
      </view>
    </view>
    <ar-popup ref="help" type="paper">
      <help-info></help-info>
    </ar-popup>
  </view>
</template>

<script>
import ArPopup from '@/components/ar-popup.vue'
import ArForm from '@/components/ar-form.vue'
import HelpInfo from '@/components/help-info.vue'
export default {
  data() {
    return {
      music: true
    }
  },
  components: { ArPopup, ArForm, HelpInfo },
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
  .main {
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
  }
  deep .u-tabs__wrapper__nav__item {
    span {

    font-size: 13px;
    }
  }
}
</style>