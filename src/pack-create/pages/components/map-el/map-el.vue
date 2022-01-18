<template>
  <view class="map-el-wrap">
    <view class="map-el" v-for="(item, index) of mapEl" :class="{ active: Number(index) === elIndex }" :key="index" @click="chioceMapEl(index, item.value)">
      <view class="map-el-img" :class="item.class"></view>
      <span>{{ item.name }}</span>
    </view>
  </view>
</template>

<script>
import { mapEl } from '@/static/js/map-el/index'
export default {
  data() {
    return {
      mapEl,
      elIndex: 0
    }
  },
  methods: {
    chioceMapEl(index, value) {
      this.elIndex = index
      this.$emit('chioceMapEl', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.map-el-wrap {
  display: flex;
  flex-flow: row wrap;
  max-height: 300rpx;
  padding: 20rpx 0;
  overflow: auto;
  .map-el {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    font-size: 24rpx;
    text-align: center;
    width: 20%;
    margin-bottom: 10rpx;
    border-radius: 20rpx;
    padding: 10rpx;
    &.active {
      background-color: rgba($color: #000, $alpha: .2);
    }
    .map-el-img {
      height: 80rpx;
      width: 80rpx;
      margin-bottom: 4rpx;
    }
  }
}
</style>
