<template>
  <game-table>
    <div class="game-row" v-for="(item, yIndex) of gameMap" :key="yIndex">
      <game-cell
        v-for="(item, xIndex) of gameMap[yIndex]"
        :key="xIndex"
        class="game-cell"
        :staticValue="staticMap[yIndex][xIndex]"
        :activeValue="activeMap[yIndex][xIndex]"
      ></game-cell>
    </div>
  </game-table>
</template>

<script>
import { deepClone2Arr } from '@/utils/index'

import GameTable from './components/GameTable.vue'
import GameCell from './components/GameCell.vue'

export default {
  data() {
    return {
      staticMap: [],
      activeMap: []
    }
  },
  components: {
    GameTable,
    GameCell
  },
  props: {
    gameMap: Array
  },
  methods: {
    // 分离地图
    separateMap(value) {
      // 接收父组件的地图数据
      this.staticMap = deepClone2Arr(value)
      this.activeMap = deepClone2Arr(value)
    }
  }
}
</script>

<style>

</style>