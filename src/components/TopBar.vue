<template>
  <div class="top-bar">
    <img src="~@/assets/img/logo.png" alt="" />
    <span class="menu" @click="$refs.pop.popShow()">菜单</span>
    <popover ref="pop" v-show="popShow">
      <van-button @click="$router.push('/index')">回到主菜单</van-button>
    </popover>
  </div>
</template>

<script>
import Popover from '@/components/Popover'

export default {
  data() {
    return {
      popShow: false
    }
  },
  components: {
    Popover
  }
}
</script>

<style>
.top-bar {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 30px;
  justify-content: space-between;
}

.top-bar img {
  width: 180px;
  height: 30px;
}

.top-bar .menu {
  font-weight: 600;
  color: #fff;
  font-size: 16px;
}
</style>
