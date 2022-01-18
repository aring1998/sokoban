<template>
  <div class="analog-handle">
    <div class="top">
      <i class="ai-caret-up" @touchstart="sendMoveEvent(0)" @touchend.prevent="stopMove" />
    </div>
    <div class="center">
      <i class="ai-caret-left" @touchstart="sendMoveEvent(3)" @touchend.prevent="stopMove" />
      <i class="ai-caret-right" @touchstart="sendMoveEvent(1)" @touchend.prevent="stopMove" />
    </div>
    <div class="bottom">
      <i class="ai-caret-down" @touchstart="sendMoveEvent(2)" @touchend.prevent="stopMove" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clickEvent: {
        direction: 0
      },
      emitEvent: null,
      keepMove: null
    }
  },
  mounted() {
    this.emitEvent = {
      0: () => this.$emit('moveUp'),
      1: () => this.$emit('moveRight'),
      2: () => this.$emit('moveDown'),
      3: () => this.$emit('moveLeft')
    }
  },
  methods: {
    sendMoveEvent(direction) {
      // 长按持续移动
      clearTimeout(this.keepMove)
      this.keepMove = setTimeout(() => {
        this.sendMoveEvent(direction)
      }, 300)

      this.clickEvent.direction = direction
      this.$emit('moveBeforeHook', this.clickEvent)
      this.emitEvent[this.clickEvent.direction]()
      this.$emit('moveAfterHook', this.clickEvent)
    },
    stopMove() {
      clearTimeout(this.keepMove)
    }
  }
}
</script>

<style lang="scss" scoped>
.analog-handle {
  position: absolute;
  bottom: 80rpx;
  left: calc(50vw - 220rpx);
  z-index: 100;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: space-between;
  width: 480rpx;
  height: 480rpx;
  font-size: 130rpx;
  flex-grow: 1;
  div {
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .center {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
  }
  i {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 20rpx;
  }
}
</style>