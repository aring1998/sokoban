<template>
  <scroll-view class="game-container" :scroll-left="scrollLeft" :scroll-top="scrollTop" :scroll-x="true" :scroll-y="true">
    <view class="game-table">
      <view
        class="night"
        :style="
          nightMode === 1
            ? {
                'border-top': `${nightTop}rpx #000 solid`,
                'border-right': ` ${nightRight}rpx #000 solid`,
                'border-bottom': `${nightBottom}rpx #000 solid`,
                'border-left': `${nightLeft}rpx #000 solid`
              }
            : 'display: none'
        "
      ></view>
      <view class="game-row" v-for="(item, yIndex) of staticMap" :key="yIndex">
        <game-cell
          v-for="(item, xIndex) of staticMap[yIndex]"
          :key="xIndex"
          :staticValue="staticMap[yIndex][xIndex]"
          :activeValue="activeMap[yIndex][xIndex]"
          :direction="direction"
        ></game-cell>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import GameCell from './components/game-cell.vue'
export default {
  data() {
    return {
      scrollTop: 0,
      scrollLeft: 0
    }
  },
  components: { GameCell },
  props: {
    staticMap: {
      type: Array,
      default: () => [[]]
    },
    activeMap: {
      type: Array,
      default: () => [[]]
    },
    direction: {
      type: Number,
      default: -1
    },
    playerPostion: {
      type: Object,
      default: () => {}
    },
    nightMode: {
      type: Number,
      default: 0
    }
  },
  computed: {
    nightTop() {
      return this.playerPostion.playerY * 60 - 60
    },
    nightRight() {
      return (this.staticMap[0].length - 1 - this.playerPostion.playerX) * 60 - 60
    },
    nightBottom() {
      return (this.staticMap.length - 1 - this.playerPostion.playerY) * 60 - 60
    },
    nightLeft() {
      return this.playerPostion.playerX * 60 - 60
    }
  }
}
</script>

<style lang="scss">
@import './styles/index.scss';
</style>
