<template>
  <view class="user">
    <u-notify ref="notify"></u-notify>
    <view class="closes">
      <i class="ai-close" @click="goIndex" />
    </view>
    <view class="title">
      <img src="../static/logo.png" alt="" />
      <span>魔改推箱子</span>
    </view>
    <view v-show="formType === 0">
      <view class="form">
        <view class="form-item">
          <i class="ai-user" />
          <input type="text" maxlength="16" v-model="loginForm.username" placeholder="请输入账号" />
        </view>
        <view class="form-item">
          <i class="ai-lock" />
          <input type="password" maxlength="32" v-model="loginForm.password" placeholder="请输入密码" @keydown.enter="login" />
        </view>
      </view>
      <view class="action-btn">
        <button @click="login">登录</button>
        <span @click="formType = 1">注册</span>
      </view>
    </view>
    <view v-show="formType === 1">
      <view class="form">
        <view class="form-item">
          <i class="ai-mail" />
          <input type="text" maxlength="32" v-model="registerForm.email" placeholder="请输入邮箱(非必填)" />
        </view>
        <view class="form-item">
          <i class="ai-user" />
          <input type="text" maxlength="16" v-model="registerForm.username" placeholder="请输入用户名" />
        </view>
        <view class="form-item">
          <i class="ai-lock" />
          <input type="password" maxlength="32" v-model="registerForm.password" placeholder="请输入密码" />
        </view>
        <view class="form-item">
          <i class="ai-lock" />
          <input type="password" maxlength="32" v-model="registerForm.checkPassword" placeholder="请再次输入密码" @keydown.enter="register" />
        </view>
      </view>
      <view class="action-btn">
        <button @click="register">注册</button>
        <span @click="formType = 0">登录</span>
      </view>
    </view>
  </view>
</template>

<script>
import md5 from 'md5'
export default {
  data() {
    return {
      formType: 0,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        email: '',
        username: '',
        password: '',
        checkPassword: ''
      }
    }
  },
  methods: {
    goIndex() {
      uni.redirectTo({ url: '/pages/index/index' })
    },
    async login() {
      const tip = this.checkLoginForm()
      if (tip) return this.$refs.notify.show({ type: 'error', message: tip })
      const res = await this.$api.post('user/login', {
        ...this.loginForm,
        password: md5(this.loginForm.password)
      })
      if (res.code === 0) {
        this.$store.state.token = res.data.token
        uni.setStorageSync('token', res.data.token)
        this.$store.dispatch('token')
        this.$refs.notify.show({ type: 'success', message: '登录成功' })
        this.goIndex()
      }
    },
    async register() {
      const tip = this.checkRegisterForm()
      if (tip) return this.$refs.notify.show({ type: 'error', message: tip })
      const res = await this.$api.post('user/register', {
        ...this.registerForm,
        password: md5(this.registerForm.password)
      })
      if (res.code === 0) {
        this.$refs.notify.show({ type: 'success', message: '注册成功，将为您自动登录' })
        setTimeout(() => {
          this.goIndex()
          this.$store.dispatch('token')
        }, 2000)
      }
    },
    checkLoginForm() {
      if (!this.loginForm.username) {
        return '请输入用户名'
      } else if (!this.loginForm.password) {
        return '请输入密码'
      }
    },
    checkRegisterForm() {
      if (this.registerForm.email) {
        if (!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(this.registerForm.email)) {
          return '邮箱格式不正确'
        }
      } else if (!this.registerForm.username) {
        return '请输入用户名'
      } else if (!/^[a-zA-Z0-9_-]{4,16}$/.test(this.registerForm.name)) {
        return '用户名格式不正确，请输入字母和数字组合，4~16位'
      } else if (!this.registerForm.password) {
        return '请输入密码'
      } else if (this.registerForm.password !== this.registerForm.checkPassword) {
        return '两个密码不一致'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  background-color: #fafafa;
  height: 100vh;
  .closes {
    height: 240rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0 32rpx;
    i {
      font-size: 60rpx;
      font-weight: bold;
      color: #333;
    }
  }
  .title {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    margin: 30rpx 0 124rpx 0;
    font-size: 32rpx;
    img {
      width: 180rpx;
      height: 180rpx;
      border-radius: 20rpx;
    }
    span {
      font-weight: bold;
      font-size: 60rpx;
    }
  }
  .form {
    .form-item {
      position: relative;
    }
    i {
      position: absolute;
      width: 40rpx;
      height: 40rpx;
      top: 30rpx;
      left: 100rpx;
    }
    input {
      width: 600rpx;
      height: 100rpx;
      border: none;
      background-color: #fff;
      font-size: 32rpx;
      padding: 14rpx 14rpx 14rpx 84rpx;
      margin: 0 75rpx 40rpx 75rpx;
      box-shadow: 0 10rpx 20rpx #c9c9c94d;
    }
  }
  .action-btn {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    button {
      background-color: $main-color;
      border-radius: 10rpx;
      width: 600rpx;
      height: 100rpx;
      line-height: 100rpx;
      color: #fff;
      text-align: center;
      font-size: 32rpx;
      box-shadow: 0 10rpx 20rpx #51af574d;
    }
    span {
      margin-top: 60rpx;
      color: $main-color;
      font-size: 32rpx;
      font-weight: bold;
    }
  }
}
</style>
