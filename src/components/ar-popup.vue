<!-- 弹出框 -->
<template>
  <view class="popup-shade" :class="[popType(), { hidden: !isShow }, isShow ? 'fade-in' : '']" @click="isClosed && show()">
    <view class="popup" @click.stop>
      <view class="closes" v-if="isClosed">
        <span @click="show">X</span>
      </view>
      <slot></slot>
    </view>
  </view>
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
      default: 'common'
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
      if (this.type === 'common') return 'common-popup-shade'
      else if (this.type === 'paper') return 'paper-popup-shade'
      else if (this.type === 'menu') return 'menu-popup-shade'
    }
  }
}
</script>

<style lang="scss" scoped>
.popup-shade {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
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

.common-popup-shade {
  background-color: rgba($color: #000000, $alpha: 0.2);
  >.popup {
    width: 700rpx;
    padding: 40rpx;
    background-image: url('~@/static/img/common/common-menu-bg.png');
    border-radius: 20rpx;
  }
}

.paper-popup-shade {
  >.popup {
    width: 700rpx;
    height: 70vh;
    padding: 40rpx;
    background-image: url('~@/static/img/common/popup-bg.png');
    border-radius: 20rpx;
  }
}

.menu-popup-shade {
  >.popup {
    width: 700rpx;
    height: 1000rpx;
    padding: 40rpx;
    background-color: #fff;
    background-image: url('~@/static/img/game/menu-bg.png');
    border-radius: 20rpx;
    >.closes {
      margin-bottom: 160rpx;
    }
  }
}
.hidden {
  display: none !important;
}
.fade-in {
  animation: fadeIn .3s linear;
}
@keyframes fadeIn {
  0% {
    opacity: .5;
  }
  100% {
    opacity: 1;
  }
}
</style>
