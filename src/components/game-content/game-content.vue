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
.game-container {
  text-align: center;
  margin: 0 auto;
  overflow: auto;
  max-height: 364px;
  max-width: 364px;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  .game-table {
    background-size: 30px 30px;
    background-repeat: repeat;
    background-image: url('~@/static/img/game-content/forest/floor.png');
    display: inline-block;
    text-align: center;
    border: 2px #e8eaeda6 solid;
    .game-row {
      display: flex;
    }
  }
}
</style>
