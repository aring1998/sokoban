<template>
  <view @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
    <slot></slot>
  </view>
</template>

<script>
export default {
  data() {
    return {
      emitEvent: null,
      touches: {
        flag: 0,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
      }
    }
  },
  mounted() {
    this.emitEvent = {
      1: () => this.$emit('moveLeft'),
      2: () => this.$emit('moveRight'),
      3: () => this.$emit('moveUp'),
      4: () => this.$emit('moveDown')
    }
  },
  methods: {
    touchstart(e) {
      const { pageX, pageY } = e.touches[0]
      this.touches.startX = pageX
      this.touches.startY = pageY
    },
    touchmove(e) {
      if (this.touches.flag !== 0) return

      const { pageX, pageY } = e.touches[0]
      this.touches.endX = pageX
      this.touches.endY = pageY

      const moveX = this.touches.startX - this.touches.endX
      const moveY = this.touches.startY - this.touches.endY
      if (Math.abs(moveX) > Math.abs(moveY)) {
        if (moveX > 50) {
          // 左划
          this.touches.flag = 1
        } else if (moveX < -50) {
          // 右划
          this.touches.flag = 2
        }
      } else {
        if (moveY > 50) {
          // 上划
          this.touches.flag = 3
        } else if (moveY < -50) {
          // 下划
          this.touches.flag = 4
        }
      }
    },
    touchend() {
      if (this.emitEvent[this.touches.flag]) {
        this.$emit('moveBeforeHook', this.touches)
        this.emitEvent[this.touches.flag]()
        this.$emit('moveAfterHook', this.touches)
      }
      this.touches.flag = 0
    }
  }
}
</script>