<template>
  <view class="ar-form">
    <view class="ar-form-item" v-for="(item, index) of formOptions" :key="index">
      <label :for="item.prop" :style="{ width: `${labelWidth}rpx` }">{{ item.label }}</label>
      <input class="input" type="number" v-if="item.type === 'digit'" maxlength="3" @keydown.native="digitEvent" v-model="form[item.prop]" />
      <u-radio-group v-model="form[item.prop]" v-else-if="item.type === 'radio'" placement="row">
        <u-radio v-for="item of item.options" :key="item.name" :label="item.label" :name="item.name" />
      </u-radio-group>
      <input class="input" v-else :type="item.type" v-model="form[item.prop]" />
    </view>
    <view class="ar-form-item">
      <u-button
        plain
        class="btn"
        @click="$emit('ok')"
        :custom-style="{
          height: '60rpx',
          lineGeight: '60rpx',
          width: '60%',
          margin: '0 auto',
          textAlign: 'center',
          fontSize: '32rpx',
          fontWeight: 'bold',
          backgroundColor: 'rgba(255, 255, 255, .2)',
          border: '2px #A6783D solid',
          color: '#A6783D',
          borderRadius: '999px'
        }"
        >{{ okText }}</u-button
      >
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
      if (item.prop) {
        form[item.prop] = item.initValue === undefined ? '' : item.initValue
      }
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
    okText: {
      type: String,
      default: '搜索'
    }
  },
  methods: {
    digitEvent(e) {
      if (/^[0-9]$/.test(e.key) || e.key === 'Backspace') return
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
      font-size: 30rpx;
    }
    .input {
      padding: 0 30rpx;
      border-radius: 999999px;
      flex-grow: 1;
      height: 60rpx;
      border: 2px #a6783d solid;
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
      background-color: rgba($color: #fff, $alpha: 0.2);
      border: 2px #a6783d solid;
      color: #a6783d;
      border-radius: 99999px;
    }
    .btn:hover {
      background-color: rgba($color: #000, $alpha: 0.2);
    }
  }
}
</style>
