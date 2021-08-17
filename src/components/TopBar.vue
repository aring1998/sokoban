<!-- 顶部导航栏 -->
<template>
  <div class="top-bar">
    <div class="top-bar-item">  
      <slot><van-icon name="revoke" @click="$router.go(-1)" /></slot>
      <div>
        <van-icon name="music-o" :class="{ turn: $store.state.bgmPlay }" @click="musicControl"/>
        <van-icon name="user-o" @click="$refs.login.show()" />
        <van-icon name="bars" @click="$refs.menu.show()" />
      </div>
    </div>
    <!-- 菜单弹窗 -->
    <popover ref="menu">
      <div class="menu">
        <van-button @click="$router.push('/index')" v-if="$route.path !== '/index'" size="large">回到主菜单</van-button>
        <van-button @click="showPicker = true" size="large">切换主题</van-button>
        <van-popup v-model="showPicker" round position="bottom" :style="{ height: '50%', backgroundColor: 'var(--mainColor)' }">
          <van-swipe 
            class="theme-swipe"
            indicator-color="white"
            :initial-swipe="
              $store.state.theme == 'theme-abstract' ? 0 : $store.theme == 'theme-forest' ? 1 : 1
            "
          >
            <van-swipe-item v-for="(item, index) of theme" :key="index">
              <div class="title">{{ item.title }}</div>
              <img :src="require('@/assets/img/theme-intro/' + item.class + '.png')" alt="">
              <div class="intro">{{ item.intro }}</div>
              <button @click="changeTheme(item.class)">使用</button>
            </van-swipe-item>
          </van-swipe>
        </van-popup>
      </div>
    </popover>
    <!-- 登录弹窗 -->
    <popover ref="login" class="login">
      <van-tabs v-model="tabIndex" color="var(--mainColor)" v-if="$store.state.username == ''" swipeable>
        <van-tab title="登录">
          <van-form @submit="login">
            <van-field
              v-model="loginForm.username"
              name="name"
              label="用户名"
              placeholder="请填写用户名"
              maxlength="16"
              :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
              v-model="loginForm.password"
              type="password"
              name="password"
              label="密码"
              placeholder="请填写密码"
              maxlength="16"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
            <div style="margin: 16px;">
              <van-button round block type="info" native-type="submit">登录</van-button>
            </div>
          </van-form>
        </van-tab>
        <van-tab title="注册">
          <van-form @submit="register">
            <van-field
              v-model="registerForm.username"
              name="name"
              label="用户名"
              placeholder="请输入用户名"
              maxlength="16"
              :rules="[{ pattern: /^[a-zA-Z0-9_-]{4,16}$/, required: true, message: '请输入字母和数字组合，4~16位' }]"
            />
            <van-field
              v-model="registerForm.password"
              type="password"
              name="password"
              label="密码"
              placeholder="请输入密码"
              maxlength="16"
              :rules="[{ pattern: /^.{6,16}$/, required: true, message: '请填写密码，6~16位' }]"
            />
            <van-field
              v-model="registerForm.checkPassWord"
              type="password"
              label="确认密码"
              placeholder="请再次输入密码"
              maxlength="16"
              :rules="[{ validator: checkPassWord, required: true, message: '密码不匹配' }]"
            />
            <div style="margin: 16px;">
              <van-button round block type="info" native-type="submit">注册</van-button>
            </div>
          </van-form>
        </van-tab>
      </van-tabs>
      <van-tabs v-model="tabIndex" color="var(--mainColor)" v-else swipeable>
        <van-tab title="个人信息">
          <span>用户名：{{ $store.state.username }}</span>
        </van-tab>
        <van-tab title="修改密码">
          <van-form @submit="forget">
            <van-field
              v-model="forgetForm.oldPassword"
              type="oldPassword"
              label="原密码"
              placeholder="请输入原密码"
              maxlength="16"
              :rules="[{ pattern: /^.{6,16}$/, required: true, message: '请填写原密码，6~16位' }]"
            />
            <van-field
              v-model="forgetForm.newPassword"
              type="password"
              label="新密码"
              placeholder="请输入新密码"
              maxlength="16"
              :rules="[{ pattern: /^.{6,16}$/, required: true, message: '请填写新密码，6~16位' }]"
            />
            <van-field
              v-model="forgetForm.checkPassWord"
              type="password"
              label="确认密码"
              placeholder="请再次输入密码"
              maxlength="16"
              :rules="[{ validator: checkPassWord, required: true, message: '密码不匹配' }]"
            />
            <div style="margin: 16px;">
              <van-button round block type="info" native-type="submit">确认修改</van-button>
            </div>
          </van-form>
        </van-tab>
      </van-tabs>
    </popover>
  </div>
</template>

<script>
import md5 from 'js-md5'
import { request } from '@/network/request'

import Popover from '@/components/Popover'

export default {
  data() {
    return {
      showPicker: false,
      theme: [
        {
          title: '抽象',
          class: 'theme-abstract',
          intro: '作者亲笔所画，这波不用爆？'
        },
        {
          title: '森林',
          class: 'theme-forest',
          intro: '经典的默认主题'
        }
      ],
      tabIndex: 0,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        username: '',
        password: '',
        checkPassWord: ''
      },
      forgetForm: {
        oldPassword: '',
        newPassword: '',
        checkPassWord: ''
      }
    }
  },
  components: {
    Popover
  },
  methods: {
    // 开关bgm
    musicControl() {
      if (this.$store.state.bgmPlay) {
        this.$parent.$parent.$refs.bgm.pause()
        this.$store.state.bgmPlay = false
        window.localStorage.setItem('bgmPlay', false)
      }
      else {
        this.$parent.$parent.$refs.bgm.play()
        this.$store.state.bgmPlay = true
        window.localStorage.setItem('bgmPlay', true)
      }
    },
    // 切换主题
    changeTheme(value) {
      this.$store.state.theme = value
      // 存缓存
      window.localStorage.setItem('theme', value)
    },
    // 登录
    login() {
      request({
        url: 'user/login',
        method: 'POST',
        data: {
          name: this.loginForm.username,
          password: md5(this.loginForm.password)
        }
      }).then(res => {
        if (res.code == 0) {
          this.$store.state.username = res.data.name
          window.localStorage.setItem('token', res.data.token)
          this.$notify({ type: 'success', message: '登录成功' })
          this.$refs.login.show()
        }
      })
    },
    // 注册
    register() {
      request({
        url: 'user/register',
        method: 'POST',
        data: {
          name: this.registerForm.username,
          password: md5(this.registerForm.password)
        }
      }).then(res => {
        if (res.code == 0) {
          this.$notify({ type: 'success', message: '注册成功' })
          this.loginForm.username = this.registerForm.username
          this.loginForm.password = md5(this.registerForm.password)
          this.login()
        }
      })
    },
    // 忘记密码
    forget() {

    },
    // 密码匹配验证
    checkPassWord(value) {
      if (value !== this.registerForm.password || value !== this.forgetForm.newPassword) return false
      return true
    }
  }
}
</script>

<style lang="scss">
.top-bar {
  .top-bar-item {
    display: flex;
    align-items: center;
    height: 60px;
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
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      padding: 5px;
      margin-left: 8px;
    }
  }
}

.login {
  .van-tabs__line {
    transform: translateX(75.5px) translateX(-50%);
  }
}

.theme-swipe {
  .van-swipe-item {
    margin-top: 20px;
    color: #333;
    font-size: 20px;
    line-height: 30px;
    text-align: center;
    display: flex;
    flex-flow: column nowrap;
    button {
      display:block;
      margin: 0 auto;
      margin-bottom: 20px;
    }
  }
}

.turn {
  animation: iconTurn 5s infinite linear;
}

@keyframes iconTurn {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
