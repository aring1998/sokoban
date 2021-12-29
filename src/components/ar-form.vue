<template>
  <view class="ar-form">
    <view class="ar-form-item" v-for="(item, index) of formOptions" :key="index">
      <label :for="item.prop" :style="{width: `${labelWidth}rpx`}">{{ item.label }}</label>
      <input v-if="item.type === 'digit'" type="number" @keydown.native="digitEvent" v-model="form[item.prop]">
      <input class="input" v-else :type="item.type" v-model="form[item.prop]">
    </view>
    <view class="ar-form-item">
      <view class="btn" @click="$emit('ok')">搜索</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {}
    }
  },
  created() {
    const form = {}
    this.formOptions.forEach(item => {
      if (item.prop) form[item.prop] = item.initValue || ''
    })
    this.form = form
    this.$emit('formCreate', form)
  },
  props: {
    formOptions: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      type: Number,
      default: 120
    },
  },
  methods: {
    digitEvent(e) {
      if (/^[0-9]$/.test(e.key)) return
      e.preventDefault()
    }
  }
}
</script>

<style lang="scss" scoped>
.ar-form {
  display: flex;
  justify-content: space-between;
  flex-flow: column;
  flex: 1;
  padding: 0 30rpx;
  .ar-form-item {
    display: flex;
    height: 60rpx;
    align-items: center;
    margin-bottom: 20rpx;
    label {
      margin-right: 8rpx;
      text-align: right;
    }
    .input {
      padding: 0 30rpx;
      border-radius: 999999px;
      flex-grow: 1;
      height: 60rpx;
      border: 2px #A6783D solid;
      background-color: unset;
      outline: none;
    }
    .btn {
      height: 60rpx;
      line-height: 60rpx;
      width: 60%;
      margin: 0 auto;
      text-align: center;
      font-size: 32rpx;
      font-weight: bold;
      background-color: rgba($color: #fff, $alpha: .2);
      border: 2px #A6783D solid;
      color: #A6783D;
      border-radius: 99999px;
    }
    .btn:hover {
      background-color: rgba($color: #000, $alpha: .2);
    }
  }
}
</style>