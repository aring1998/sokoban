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
      <view class="common-bottom-form-item" @click="$emit('nextLevel')" v-if="type === 'level'">
        <i class="ai-arrow-right"></i>
        <span>下一关</span>
      </view>
      <view class="common-bottom-form-item" @click="back" v-if="type === 'workshop'">
        <i class="ai-left-circle-o"></i>
        <span>返回</span>
      </view>
      <view class="common-bottom-form-item" @click="$emit('saveServe')" v-if="type === 'create'">
        <i class="ai-folder-add"></i>
        <span>上传云端</span>
      </view>
      <view class="common-bottom-form-item" @click="$emit('saveLocal')" v-if="type === 'create'">
        <i class="ai-folder-add"></i>
        <span>保存本地</span>
      </view>
    </view>
  </view>
</template>

<script>
import ArPopup from '@/components/ar-popup.vue'
import HelpInfo from '@/components/help-info.vue'
export default {
  components: { ArPopup, HelpInfo },
  props: {
    type: {
      type: String,
      default: 'level'
    }
  },
  methods: {
    goIndex() {
      uni.redirectTo({
        url: '/pages/index/index'
      })
    },
    back() {
      uni.redirectTo({
        url: '/pages/workshop/index'
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
