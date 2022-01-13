<template>
  <view class="game-cell" :class="[randerClass, activeValue === 2 ? checkDirection : '']"></view>
</template>

<script>
import { staticMapRander, acitveMapRander, direction } from '../config/render'

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
      return direction[this.direction]
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

.move-left {
  position: relative;
  animation: left 0.2s linear;
}

@keyframes left {
  0% {
    left: 60rpx;
  }
  100% {
    left: 0;
  }
}

.move-right {
  position: relative;
  animation: right 0.2s linear;
}

@keyframes right {
  0% {
    left: -60rpx;
  }
  100% {
    left: 0;
  }
}

.move-up {
  position: relative;
  animation: up 0.2s linear;
}

@keyframes up {
  0% {
    top: 60rpx;
  }
  100% {
    top: 0;
  }
}

.move-down {
  position: relative;
  animation: down 0.2s linear;
}

@keyframes down {
  0% {
    top: -60rpx;
  }
  100% {
    top: 0;
  }
}

</style>