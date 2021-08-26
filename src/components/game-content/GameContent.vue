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
      console.log(this.staticMap);
    },
    // 渲染地图
    randerClass(y, x) {
      if (this.staticMap.length == 0) return
      let res = ''
      // 静止层渲染
      const staticMapRander = {
        0: () => { res = 'wall' },
        4: () => { res = 'end' },
        5: () => { res = 'spikeweed' },
        6: () => { res = 'fire' },
        8: () => { res = 'toadstool' },
        9: () => { res = 'spring' },
        10: () => { res = 'single-portal-entry' },
        11: () => { res = 'single-portal-exit' },
        12: () => { res = 'beer' },
        13: () => { res = 'nectar' },
      }
      if (staticMapRander[this.staticMap[y][x]]) staticMapRander[this.staticMap[y][x]]()
      // 活动层渲染
      const acitveMapRander = {
        2: () => { res += ' player' },
        3: () => { res += ' box' },
        7: () => { res += ' ice-box' }
      }
      if (acitveMapRander[this.activeMap[y][x]]) acitveMapRander[this.activeMap[y][x]]()
      return res
    }
  }
}
</script>

<style>

</style>