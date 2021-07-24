<!-- 顶部导航栏 -->
<template>
  <div class="top-bar">
    <slot><van-icon name="revoke" @click="$router.go(-1)" /></slot>
    <div>
      <van-icon name="user-o" />
      <van-icon name="bars" @click="$refs.menu.popShow()" />
    </div>
    <popover ref="menu" v-show="popShow">
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

<style lang="scss">
.top-bar {
  display: flex;
  align-items: center;
  height: 80px;
  padding: 20px 15px;
  justify-content: space-between;
}

.top-bar img {
  width: 180px;
  height: 30px;
}

.top-bar i {
  font-weight: 600;
  color: #fff;
  font-size: 22px;
  background-color: rgba(0, 0, 0, .3);
  border-radius: 50%;
  padding: 5px;
  margin-left: 8px;
}
</style>
