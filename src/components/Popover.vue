<!-- 弹出框 -->
<template>
  <transition name="van-fade">
    <div class="popover-shade" v-show="isShow">
      <div class="popover">
        <div class="closes">
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
  methods: {
    show() {
      this.isShow = !this.isShow
    }
  }
}
</script>

<style>
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
  z-index: 100;
}

.popover-shade .popover {
  width: 350px;
  padding: 20px;
  background-color: var(--mainColor);
  border: var(--deepMainColor) 4px solid;
  border-radius: 10px;
}

.popover-shade .closes {
  width: 100%;
  text-align: right;
  margin-bottom: 10px;
}

.popover-shade .closes i {
  font-weight: 600;
  color: #fff;
  font-size: 20px;
}
</style>
