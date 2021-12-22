<!-- 弹出框 -->
<template>
  <u-transition :show="isShow" mode="fade">
    <view :class="[popType()]" @click="show">
      <view class="popover" @click.stop>
        <view class="closes" v-if="isClosed" @click="show">X</view>
        <slot></slot>
      </view>
    </view>
  </u-transition>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    }
  },
  props: {
    // 样式类型
    type: {
      type: String,
      default: 'normal'
    },
    // 是否有关闭按钮
    isClosed: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    show() {
      this.isShow = !this.isShow
    },
    // 弹出框类型
    popType() {
      if (this.type === 'normal') return 'popover-shade'
      else if (this.type === 'white') return 'white-popover-shade'
    }
  }
}
</script>

<style lang="scss">
.popover-shade {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 101;
  .popover {
    width: 350px;
    padding: 20px;
    background-color: var(--mainColor);
    border: var(--deepMainColor) 4px solid;
    border-radius: 10px;
  }
  .closes {
    width: 100%;
    text-align: right;
    margin-bottom: 10px;
    i {
      font-weight: bold;
      color: #fff;
      font-size: 20px;
    }
  }
}

.white-popover-shade {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  .popover {
    width: 350px;
    height: 70vh;
    padding: 20px;
    background-image: url('~@/static/img/common/popup-bg.png');
    border-radius: 10px;
    .closes {
      width: 100%;
      text-align: right;
      margin-bottom: 10px;
      font-size: 20px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.5);
      padding-right: 10px;
    }
  }
}
</style>
