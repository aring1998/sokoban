<!-- 游戏地图 -->
<template>
  <game-table>
    <div class="game-row" v-for="(item, yIndex) of gameMap" :key="yIndex" @click="getRowIndex(yIndex)">
      <div
        v-for="(item, xIndex) of gameMap[yIndex]"
        @click="getColumnIndex(xIndex)"
        :key="xIndex"
        class="game-cell"
        :class="getMapElClass(item)"
      ></div>
    </div>
  </game-table>
</template>

<script>
import { mapElClass } from '@/assets/js/map-el/index'

import GameTable from './components/GameTable.vue'

export default {
  components: {
    GameTable
  },
  props: {
    gameMap: Array,
    getColumnIndex: {
      type: Function,
      default: () => {}
    },
    getRowIndex: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    getMapElClass(value) {
      return mapElClass(value)
    }
  }
}
</script>

<style>
</style>
