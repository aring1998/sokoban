<template>
  <view class="ar-tabs" :style="{ justifyContent: spaceBetween ? 'space-between' : 'unset' }">
    <view
      class="ar-tabs-item"
      v-for="item of list"
      :key="item.id"
      :class="[{ active: current === item.id }]"
      @click="$emit('click', item)"
      :style="{ fontSize }"
    >
      <span>{{ item.name }}</span>
      <view class="ar-tabs-line"></view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    current: {
      type: [String, Number],
      default: 0
    },
    list: {
      type: Array,
      default: () => []
    },
    fontSize: {
      type: String,
      default: '30rpx'
    },
    spaceBetween: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss">
.ar-tabs {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  .ar-tabs-item {
    padding: 0 16rpx;
    font-weight: bold;
    color: #666;
  }
  .ar-tabs-item.active {
    color: #333;
  }
  .ar-tabs-item.active {
    .ar-tabs-line {
      background-color: $main-color;
      width: 40%;
      height: 6rpx;
      margin: 0 auto;
      border-radius: 12rpx;
      margin-top: 4rpx;
    }
  }
}
</style>
