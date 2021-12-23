<template>
  <view class="choice-level">
    <u-tabs :list="tabList" @click="tabClick"></u-tabs>
    <view class="level-list">
      <view class="level-item"
        v-for="(item, index) of levelList"
        :key="index"
        @click="goGame(index)"
      >
        {{ index + 1 }}
      </view>
    </view>
  </view>
</template>

<script>
import { basic, expand } from '@/static/js/level/index'
export default {
  data() {
    return {
      levelList: basic,
      tabList: [
        {
          id: 0,
          name: '基本关卡'
        },
        {
          id: 1,
          name: '拓展关卡'
        }
      ],
      currentTab: 0
    }
  },
  methods: {
    tabClick(item) {
      if (item.id === 0) this.levelList = basic
      else this.levelList = expand
      this.currentTab = item.id
    },
    goGame(index) {
      uni.navigateTo({
        url: `/pages/game/index?type=level&level=${index}&pack=${this.currentTab}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.choice-level {
  height: 100%;
  .level-list {
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
    height: calc(70vh - 300rpx);
    overflow: auto;
    padding: 20rpx;
    .level-item {
      color: goldenrod;
      line-height: 80rpx;
      width: 112rpx;
      margin: 16rpx;
      border-radius: 20rpx;
      border: 4rpx #fff solid;
      font-weight: 900;
      font-size: 40rpx;
      text-align: center;
    }
  }
}
</style>