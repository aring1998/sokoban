<!-- 顶部导航栏 -->
<template>
  <div class="top-bar">
    <div class="top-bar-item">
      <slot><van-icon name="revoke" @click="$router.go(-1)" /></slot>
      <div>
        <van-icon name="user-o" />
        <van-icon name="bars" @click="$refs.menu.show()" />
      </div>
    </div>
    <popover ref="menu" v-show="popShow">
      <div class="menu">
        <van-button @click="$router.push('/index')" v-if="$route.path !== '/index'" size="large">回到主菜单</van-button>
        <van-button @click="showPicker = true" size="large">切换主题</van-button>
        <van-popup v-model="showPicker" round position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            :default-index="1"
            @cancel="showPicker = false"
            @confirm="changeTheme"
          />
        </van-popup>
      </div>
    </popover>
  </div>
</template>

<script>
import Popover from '@/components/Popover'

export default {
  data() {
    return {
      popShow: false,
      showPicker: false,
      columns: [
        {
          class: 'theme-abstract',
          text: '抽象'
        },
        {
          class: 'theme-forest',
          text: '森林'
        },
      ]
    }
  },
  components: {
    Popover
  },
  methods: {
    // 切换主题
    changeTheme(value) {
      this.value = value.text
      this.$store.state.theme = value.class
      this.showPicker = false
      // 存缓存
      window.localStorage.setItem('theme', value.class)
    }
  }
}
</script>

<style lang="scss">
.top-bar {
  .top-bar-item {
    display: flex;
    align-items: center;
    height: 80px;
    padding: 20px 15px;
    justify-content: space-between;
    img {
      width: 180px;
      height: 30px;
    }
    i {
      font-weight: 600;
      color: #fff;
      font-size: 22px;
      background-color: rgba(0, 0, 0, .3);
      border-radius: 50%;
      padding: 5px;
      margin-left: 8px;
    }
  }
}
</style>
