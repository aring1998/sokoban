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
      },
      longClickTimer: null,
      longClickFlag: false
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
      this.longClickTimer = setInterval(() => {
        this.longClickFlag = true
        this.sendMoveEvent()
      }, 300);
    },
    touchmove(e) {
      const { pageX, pageY } = e.touches[0]
      this.touches.endX = pageX
      this.touches.endY = pageY

      const moveX = this.touches.startX - this.touches.endX
      const moveY = this.touches.startY - this.touches.endY
      if (Math.abs(moveX) > Math.abs(moveY)) {
        if (moveX > 50) {
          // 左划
          this.touches.flag = 1
          this.setStartPosition(pageX, pageY)
        } else if (moveX < -50) {
          // 右划
          this.touches.flag = 2
          this.setStartPosition(pageX, pageY)
        }
      } else {
        if (moveY > 50) {
          // 上划
          this.touches.flag = 3
          this.setStartPosition(pageX, pageY)
        } else if (moveY < -50) {
          // 下划
          this.touches.flag = 4
          this.setStartPosition(pageX, pageY)
        }
      }
    },
    touchend() {
      if (!this.longClickFlag) this.sendMoveEvent()
      clearInterval(this.longClickTimer)
      this.longClickFlag = false
      this.touches.flag = 0
    },
    sendMoveEvent() {
      if (this.emitEvent[this.touches.flag]) {
        this.$emit('moveBeforeHook', this.touches)
        this.emitEvent[this.touches.flag]()
        this.$emit('moveAfterHook', this.touches)
      }
    },
    setStartPosition(x, y) {
      this.touches.startX = x
      this.touches.startY = y
    }
  }
}
</script>