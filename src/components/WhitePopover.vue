<!-- 弹出框 -->
<template>
  <div class="white-popover-shade" v-show="isShow">
    <div class="white-popover">
      <div class="closes">
        <van-icon name="cross" @click="show()" />
      </div>
      <slot></slot>
    </div>
  </div>
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
}

.white-popover-shade .white-popover {
  width: 350px;
  min-height: 90vh;
  padding: 20px;
  background-color: rgba(255, 255, 255, .7);
  border-radius: 10px;
}

.white-popover-shade .closes {
  width: 100%;
  text-align: right;
  margin-bottom: 10px;
}

.white-popover-shade .closes i {
  font-weight: 600;
  color: #777;
  font-size: 20px;
}
</style>
