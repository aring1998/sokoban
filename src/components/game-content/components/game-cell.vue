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
      default: -1
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
      // #ifndef MP
      return direction[this.direction]
      // #endif
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
  animation: left 0.2s linear;
}

@keyframes left {
  0% {
    transform: translate(60rpx, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}

.move-right {
  animation: right 0.2s linear;
}

@keyframes right {
  0% {
    transform: translate(-60rpx, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}

.move-up {
  animation: up 0.2s linear;
}

@keyframes up {
  0% {
    transform: translate(0, 60rpx);
  }
  100% {
    transform: translate(0, 0);
  }
}

.move-down {
  animation: down 0.2s linear;
}

@keyframes down {
  0% {
    transform: translate(0, -60rpx);
  }
  100% {
    transform: translate(0, 0);
  }
}

</style>