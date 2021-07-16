<!-- 自定义地图 -->
<template>
  <div class="create">
    <!-- 弹出层选择初始游戏地图布局 -->
    <popover v-show="popShow" :disabled="true">
      <el-select v-model="initialLayout" placeholder="请选择初始地图大小">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
      </el-select>
      <el-button type="primary" @click="changeTableLayout">开始创造</el-button>
    </popover>

    <!-- 游戏地图 -->
    <game-content :game-map="gameMap" :get-column-index="getColumnIndex" :get-row-index="getRowIndex"></game-content>

    <!-- 选择地图元素 -->
    <div class="map-el-container">
      <ul>
        <li v-for="(item, index) of mapEl" :key="item.value" :class="{ active: index == elIndex }" @click="choiceMapEl(index)">
          <div
            :class="{
              'map-el-img': true,
              wall: item.value == 0,
              floor: item.value == 1,
              player: item.value == 2,
              box: item.value == 3,
              end: item.value == 4
            }"
          ></div>
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>
    <button @click="testMap">测试地图</button>
  </div>
</template>

<script>
import Vue from 'vue'

import GameContent from '@/components/GameContent'
import Popover from '@/components/Popover'

export default {
  data() {
    return {
      popShow: true,
      options: [
        {
          value: 6,
          label: '6 * 6'
        },
        {
          value: 7,
          label: '7 * 7'
        },
        {
          value: 8,
          label: '8 * 8'
        },
        {
          value: 9,
          label: '9 * 9'
        },
        {
          value: 10,
          label: '10 * 10'
        },
        {
          value: 11,
          label: '11 * 11'
        },
        {
          value: 12,
          label: '12 * 12'
        }
      ],
      initialLayout: null,
      gameMap: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ],
      choiceRow: 0,
      choiceColumn: 0,
      mapEl: [
        {
          name: '墙',
          value: 0
        },
        {
          name: '空地',
          value: 1
        },
        {
          name: '玩家',
          value: 2
        },
        {
          name: '箱子',
          value: 3
        },
        {
          name: '终点',
          value: 4
        }
      ],
      elIndex: null,
      clickCellType: null
    }
  },
  components: {
    GameContent,
    Popover
  },
  methods: {
    // 更改表格布局
    changeTableLayout() {
      if (this.initialLayout == null) {
        this.$message({
          message: '请选择初始地图布局',
          type: 'error'
        })
        return
      }
      this.gameMap = []
      for (let i = 0; i < this.initialLayout; i++) {
        this.gameMap.push([])
      }
      for (let i = 0; i < this.initialLayout; i++) {
        for (let j = 0; j < this.initialLayout; j++) {
          this.gameMap[i].push(1)
        }
      }
      this.popShow = false
    },
    // 获取列索引
    getColumnIndex(index) {
      this.choiceColumn = index
    },
    // 获取行索引
    getRowIndex(index) {
      this.choiceRow = index
      this.changeCell()
    },
    // 更改单元格
    changeCell() {
      Vue.set(this.gameMap[this.choiceRow], this.choiceColumn, this.clickCellType)
    },
    // 选择地图元素
    choiceMapEl(index) {
      this.elIndex = index
      this.clickCellType = index
    },
    // 测试地图
    testMap() {
      this.$router.push({ name: 'game', params: { gameMap: this.gameMap, type: 'created' } })
    }
  }
}
</script>

<style scoped>
.create {
  background-color: var(--mainColor);
  height: 100vh;
}

.game-container td {
  border: 1px gray solid;
}

.map-el-container {
  background-color: rgba(255, 255, 255, 0.6);
}

.map-el-container ul {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 60px;
}

.map-el-container ul li {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding: 0 5px;
}

.map-el-container ul li.active {
  background-color: rgba(0, 0, 0, 0.2);
}

.map-el-container ul li .map-el-img {
  height: 30px;
  width: 30px;
  background-size: 100% 100%;
}
</style>
