<!-- 弹出框 -->
<template>
  <div class="popover-shade" v-show="isShow">
    <div class="popover">
      <div class="closes">
        <i class="el-icon-close" @click="isShow = !isShow"></i>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: true
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
