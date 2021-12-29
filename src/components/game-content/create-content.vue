<template>
  <view class="game-container">
    <view class="game-table" :style="{backgroundSize: '30rpx 30rpx', border: 'none'}">
      <view class="game-row" v-for="(item, yIndex) of gameMap" :key="yIndex" @click="$emit('getRowIndex', yIndex)">
        <view
          v-for="(item, xIndex) of gameMap[yIndex]"
          @click="$emit('getColumnIndex', xIndex)"
          :key="xIndex"
          class="game-cell"
          :class="[mapElClass(item)]"
          :style="{height: '30rpx', width: '30rpx'}"
        ></view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapElClass } from '@/static/js/map-el/index'

export default {
  props: {
    gameMap: Array
  },
  methods: {
    mapElClass
  }
}
</script>

<style lang="scss">
@import './styles/index.scss';
</style>
