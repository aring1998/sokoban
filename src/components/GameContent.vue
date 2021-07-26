<!-- 游戏地图 -->
<template>
  <table class="game-container">
    <tr v-for="(item, yIndex) in gameMap.length" :key="yIndex" @click="getRowIndex(yIndex)">
      <td
        v-for="(item, xIndex) of gameMap[yIndex]"
        @click="getColumnIndex(xIndex)"
        :key="xIndex"
        class="game-cell"
        :class="
          $route.path == '/game'
            ? randerClass(yIndex, xIndex)
            : getmapElClass(item)
        "
      ></td>
    </tr>
  </table>
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
    getmapElClass(value) {
      return mapElClass(value)
    },
    // 分离地图
    separateMap(value) {
      // 接收父组件的地图数据
      this.staticMap = deepClone2Arr(value)
      this.activeMap = deepClone2Arr(value)
      // 分离静止层
      for (let y in value) {
        for (let x in value[y]) {
          switch (value[y][x]) {
            case 2:
            case 3: {
              this.staticMap[y][x] = 1
            }
          }
        }
      }
      // 分离活动层
      for (let y in value) {
        for (let x in value[y]) {
          switch (value[y][x]) {
            case 0:
            case 4: {
              this.activeMap[y][x] = 1
            }
          }
        }
      }
    },
    // 渲染地图
    randerClass(y, x) {
      if (this.staticMap.length == 0) return
      let res = ''
      // 静止层渲染
      switch (this.staticMap[y][x]) {
        case 0: {
          res += 'wall'
          break
        }
        case 1: {
          res += ''
          break
        }
        case 4: {
          res += 'end'
          break
        }
        case 5: {
          res += 'spikeweed'
          break
        }
        case 6: {
          res += 'fire'
          break
        }
      }
      // 活动层渲染
      switch (this.activeMap[y][x]) {
        case 2: {
          res += ' player'
          break
        }
        case 3: {
          res += ' box'
          break
        }
        case 7: {
          res += ' ice-box'
          break
        }
      }
      return res
    }
  }
}
</script>

<style>
.game-container {
  border-collapse: collapse;
  border-spacing: 0;
  background-size: 30px 30px;
  background-repeat: repeat;
  background-image: url('~@/assets/img/theme/forest/floor.png');
  margin: 0 auto;
}

.game-container td {
  height: 30px;
  width: 30px;
  padding: 0;
}

.game-cell {
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

/* 作为缩略图 */
.map-thumbnail .game-container {
  height: 100%;
  width: 100%;
}
.map-thumbnail .game-container td {
  height: 5px;
}
</style>
