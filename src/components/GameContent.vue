<!-- 游戏地图 -->
<template>
  <div class="game-container">
    <div class="game-table" :class="{'table-border': gameMap.length > 12 || gameMap[0] ? gameMap[0].length > 12 ? true : false : false}">
      <div class="game-row" v-for="(item, yIndex) of gameMap" :key="yIndex" @click="getRowIndex(yIndex)">
        <div
          v-for="(item, xIndex) of gameMap[yIndex]"
          @click="getColumnIndex(xIndex)"
          :key="xIndex"
          class="game-cell"
          :class="$route.path == '/game' ? randerClass(yIndex, xIndex) : getMapElClass(item)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { deepClone2Arr } from '@/utils/index'
import { mapElClass } from '@/assets/js/map-el/index'

export default {
  data() {
    return {
      staticMap: [],
      activeMap: []
    }
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
    },
    // 分离地图
    separateMap(value) {
      // 接收父组件的地图数据
      this.staticMap = deepClone2Arr(value)
      this.activeMap = deepClone2Arr(value)
    },
    // 渲染地图
    randerClass(y, x) {
      if (this.staticMap.length == 0) return
      let res = ''
      // 静止层渲染
      const staticMapRander = {
        0: () => {
          res += 'wall'
        },
        1: () => {
          res += ''
        },
        4: () => {
          res += 'end'
        },
        5: () => {
          res += 'spikeweed'
        },
        6: () => {
          res += 'fire'
        },
        8: () => {
          res += 'toadstool'
        },
        9: () => {
          res += 'spring'
        },
        10: () => {
          res += 'single-portal-entry'
        },
        11: () => {
          res += 'single-portal-exit'
        },
        12: () => {
          res += 'beer'
        },
      }
      if (staticMapRander[this.staticMap[y][x]]) staticMapRander[this.staticMap[y][x]]()
      // 活动层渲染
      const acitveMapRander = {
        2: () => {
          res += ' player'
        },
        3: () => {
          res += ' box'
        },
        7: () => {
          res += ' ice-box'
        }
      }
      if (acitveMapRander[this.activeMap[y][x]]) acitveMapRander[this.activeMap[y][x]]()
      return res
    }
  }
}
</script>

<style lang="scss">
.game-container {
  text-align: center;
  margin: 0 auto;
  overflow: auto;
  max-height: 360px;
  max-width: 360px;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  .game-table {
    background-size: 30px 30px;
    background-repeat: repeat;
    background-image: url('~@/assets/img/theme/forest/floor.png');
    display: inline-block;
    text-align: center;
    .game-row {
      display: flex;
      .game-cell {
        height: 30px;
        width: 30px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }
  }
}

/* 作为缩略图 */
.map-thumbnail {
  .game-container {
    .game-table {
      background-size: 8px 8px;
      .game-row {
        .game-cell {
          height: 8px;
          width: 8px;
        }
      }
    }
  }
}

.table-border {
  border: 2px #eaeaea solid;
}
</style>
