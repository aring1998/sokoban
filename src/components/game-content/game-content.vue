<template>
  <view class="game-container">
    <view class="game-table">
      <view class="game-row" v-for="(item, yIndex) of staticMap" :key="yIndex">
        <game-cell
          v-for="(item, xIndex) of staticMap[yIndex]"
          :key="xIndex"
          :staticValue="staticMap[yIndex][xIndex]"
          :activeValue="activeMap[yIndex][xIndex]"
        ></game-cell>
      </view>
    </view>
  </view>
</template>

<script>
import GameCell from './components/game-cell.vue'
export default {
  components: { GameCell },
  props: {
    staticMap: {
      type: Array,
      default: () => []
    },
    activeMap: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss">
@import './styles/index.scss';
</style>
