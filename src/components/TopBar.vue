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
      <van-tabs v-model="tabIndex" color="var(--mainColor)" v-if="$store.state.userInfo.name == ''" swipeable>
        <van-tab title="登录">
          <van-form @submit="login">
            <van-field
              v-model="loginForm.name"
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
              v-model="registerForm.name"
              label="用户名"
              placeholder="请输入用户名"
              maxlength="16"
              :rules="[{ pattern: /^[a-zA-Z0-9_-]{4,16}$/, required: true, message: '请输入字母和数字组合，4~16位' }]"
            />
            <van-field
              v-model="registerForm.email"
              label="邮箱"
              placeholder="请输入邮箱"
              maxlength="32"
              :rules="[{ pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/, required: true, message: '请输入正确的邮箱' }]"
            />
            <van-field
              v-model="registerForm.password"
              type="password"
              label="密码"
              placeholder="请输入密码"
              maxlength="16"
              :rules="[{ pattern: /^.{6,16}$/, required: true, message: '请填写密码，6~16位' }]"
            />
            <van-field
              v-model="registerForm.checkPassword"
              type="password"
              label="确认密码"
              placeholder="请再次输入密码"
              maxlength="16"
              :rules="[{ validator: checkPassword, required: true, message: '密码不匹配' }]"
            />
            <div style="margin: 16px;">
              <van-button round block type="info" native-type="submit">注册</van-button>
            </div>
          </van-form>
        </van-tab>
      </van-tabs>
      <van-tabs v-model="tabIndex" color="var(--mainColor)" v-else swipeable>
        <van-tab title="个人信息">
          <van-field
            v-model="$store.state.userInfo.id"
            label="uid"
            readonly
          />
          <van-field
            v-model="$store.state.userInfo.name"
            label="用户名"
            readonly
          />
          <van-field
            v-model="$store.state.userInfo.email"
            label="邮箱"
            readonly
          />
          <van-field
            v-model="$store.state.userInfo.nickname"
            label="昵称"
            maxlength="10"
          >
            <template #button>
              <van-button size="small" type="primary" @click="changeNickname">修改</van-button>
            </template>
          </van-field>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="logOut">退出登录</van-button>
          </div>
        </van-tab>
        <van-tab title="修改密码">
          <van-form @submit="changePsw">
            <van-field
              v-model="changePswForm.oldPassword"
              type="password"
              label="原密码"
              placeholder="请输入原密码"
              maxlength="16"
              :rules="[{ pattern: /^.{6,16}$/, required: true, message: '请填写原密码，6~16位' }]"
            />
            <van-field
              v-model="changePswForm.password"
              type="password"
              label="新密码"
              placeholder="请输入新密码"
              maxlength="16"
              :rules="[{ pattern: /^.{6,16}$/, required: true, message: '请填写新密码，6~16位' }]"
            />
            <van-field
              v-model="changePswForm.checkPassword"
              type="password"
              label="确认密码"
              placeholder="请再次输入密码"
              maxlength="16"
              :rules="[{ validator: checkPassword, required: true, message: '密码不匹配' }]"
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
        name: '',
        password: ''
      },
      registerForm: {
        name: '',
        email: '',
        password: '',
        checkPassword: ''
      },
      changePswForm: {
        oldPassword: '',
        password: '',
        checkPassword: ''
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
      window.localStorage.setItem('theme', value) // 存缓存
    },
    // 登录
    login() {
      request({
        url: 'user/login',
        method: 'POST',
        data: {
          name: this.loginForm.name,
          password: md5(this.loginForm.password)
        }
      }).then(res => {
        if (res.code == 0) {
          this.$store.state.token = res.data.token
          window.localStorage.setItem('token', res.data.token)
          this.$store.dispatch('token')
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
          ...this.registerForm,
          password: md5(this.registerForm.password)
        }
      }).then(res => {
        if (res.code == 0) {
          this.$notify({ type: 'success', message: '注册成功' })
          this.loginForm.name = this.registerForm.name
          this.loginForm.password = this.registerForm.password
          this.login()
        }
      })
    },
    // 修改昵称
    changeNickname() {
      request({
        url: 'user/update',
        method: 'POST',
        data: {
          nickname: this.$store.state.userInfo.nickname
        }
      }).then(res => {
        if (res.code === 0) {
          this.$notify({ type: 'success', message: '修改成功' })
        }
      })
    },
    // 退出登录
    logOut() {
      this.$store.state.userInfo.name = ''
      window.localStorage.removeItem('token')
      this.$refs.login.show()
      this.$notify({ type: 'success', message: '退出登录成功' })
    },
    // 修改密码
    changePsw() {
      request({
        url: 'user/changePsw',
        method: 'POST',
        data: {
          oldPassword: md5(this.changePswForm.oldPassword),
          password: md5(this.changePswForm.password)
        }
      }).then(res => {
        if (res.code == 0) {
          this.$notify({ type: 'success', message: '修改密码成功' })
          this.$refs.login.show()
          this.$store.state.userInfo.name = ''
          window.localStorage.removeItem('token')
          setTimeout(() => {
            this.$notify({ type: 'success', message: '请重新登陆' })
            this.tabIndex = 
            this.$refs.login.show()
          }, 500);
        }
      })
    },
    // 密码匹配验证
    checkPassword(value) {
      if (value !== this.changePswForm.password && value !== this.registerForm.password) return false
      return true
    }
  }
}
</script>

<style lang="scss">
.top-bar {
  .top-bar-item {
    display: flex;
    align-items: flex-end;
    height: 60px;
    padding: 0 15px;
    margin-bottom: 10px;
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
