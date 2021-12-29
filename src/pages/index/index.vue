<template>
  <view class="index-page">
		<view class="title">魔改推箱子</view>
    <view class="action">
      <view class="btn" @click="$refs.choiceLevel.show()">开始游戏</view>
      <view class="btn" @click="routerGo('workshop')">创意工坊</view>
      <view class="btn" @click="routerGo('create')">创建地图</view>
    </view>
    <ar-popup type="paper" ref="choiceLevel">
      <choice-level></choice-level>
    </ar-popup>
  </view>
</template>

<script>
import ArPopup from '@/components/ar-popup.vue'
import ChoiceLevel from './components/choice-level/index.vue'
export default {
  data() {
    return {
      
    }
  },
	components: { ArPopup, ChoiceLevel },
  methods: {
    routerGo(name) {
      uni.navigateTo({
        url: `/pages/${name}/index`
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.index-page {
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  background-image: url('../../static/img/index/bg.png');
  .title {
    width: 100%;
    height: 180rpx;
    line-height: 180rpx;
    text-align: center;
    font-size: 80rpx;
    font-weight: bold;
    color: rgb(247, 244, 49);
    margin: 100rpx 0;
    padding: 0 15rpx;
    background-image: url('~@/static/img/common/common-title.png');
  }
  .action {
    .btn {
      height: 150rpx;
      line-height: 150rpx;
      text-align: center;
      font-size: 60rpx;
      font-weight: bold;
      color: rgb(36, 131, 40);
      margin: 60rpx 120rpx;
      background-image: url('~@/static/img/index/btn.png');
    }
  }
}
</style>
