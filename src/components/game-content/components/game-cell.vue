<template>
  <view class="game-cell" :class="[randerClass, activeValue === 2 ? checkDirection : '']"></view>
</template>

<script>
import { staticMapRander, acitveMapRander } from '../config/render'

export default {
  props: {
    staticValue: {
      type: Number,
      default: 1
    },
    activeValue: {
      type: Number,
      default: 1
    },
    direction: {
      type: Number,
      default: 5
    }
  },
  computed: {
    randerClass() {
      let res = ''
      // 静止层渲染
      if (staticMapRander[this.staticValue]) res = staticMapRander[this.staticValue]
      // 活动层渲染
      if (acitveMapRander[this.activeValue]) res += acitveMapRander[this.activeValue]
      return res
    },
    checkDirection() {
      if (this.direction === 0) return 'move-up'
      else if (this.direction === 1) return 'move-right'
      else if (this.direction === 2) return 'move-down'
      else if (this.direction === 3) return 'move-left'
    }
  }
}
</script>

<style scoped>
.game-cell {
  height: 60rpx;
  width: 60rpx;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>