<!-- 弹出框 -->
<template>
  <transition name="van-fade">
    <div :class="popType()" v-show="isShow" @click="show()">
      <div class="popover" @click.stop>
        <div class="closes" v-if="isClosed">
          <van-icon name="cross" @click="show()" />
        </div>
        <slot></slot>
      </div>
    </div>
  </transition>
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
      const popTypeClass = {
        normal: 'popover-shade',
        white: 'white-popover-shade'
      }
      return popTypeClass[this.type]
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
      font-weight: 600;
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
    min-height: 90vh;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 10px;
    .closes {
      width: 100%;
      text-align: right;
      margin-bottom: 10px;
      i {
        font-weight: 600;
        color: #777;
        font-size: 20px;
      }
    }
  }
}
</style>
