<!-- 自定义地图 -->
<template>
  <div class="create">
    <top-bar></top-bar>
    <!-- 弹出层选择初始游戏地图布局 -->
    <popover v-show="popShow" :disabled="true">
      <van-form>
        <van-field
          v-model="gameMapForm.row"
          type="digit"
          maxlength="2"
          label="地图行数"
          placeholder="可选范围：6~12"
          :rules="[{ pattern: /^[6-9]|1[0,2]$/, required: true, message: '请输入小于12的数字' }]"
        />
        <van-field
          v-model="gameMapForm.column"
          type="digit"
          maxlength="2"
          label="地图列数"
          placeholder="可选范围：6~12"
          :rules="[{ pattern: /^[6-9]|1[0,2]$/, required: true, message: '请输入小于12的数字' }]"
        />
        <van-field
          v-model="gameMapForm.life"
          type="digit"
          maxlength="3"
          label="人物生命"
          placeholder="可选范围：0~99"
          :rules="[{ pattern: /^[0-99]$/, message: '请输入小于99的数字' }]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" @click="changeTableLayout">确定</van-button>
        </div>
      </van-form>
    </popover>

    <!-- 游戏地图 -->
    <game-content :game-map="gameMap" :get-column-index="getColumnIndex" :get-row-index="getRowIndex"></game-content>

    <!-- 选择地图元素 -->
    <div class="map-el-container">
      <ul>
        <li v-for="(item, index) of mapEl" :key="item.value" :class="{ active: index == elIndex }" @click="choiceMapEl(index, item.value)">
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

import TopBar from '@/components/TopBar'
import GameContent from '@/components/GameContent'
import Popover from '@/components/Popover'

export default {
  data() {
    return {
      popShow: true,  // 弹窗展示
      gameMapForm: {  // 地图设置项
        row: null,
        column: null,
        life: null
      },
      gameMap: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ],
      choiceRow: 0,  // 选中行
      choiceColumn: 0,  // 选中列
      mapEl: [  // 地图元素
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
      elIndex: null,  // 元素对应索引
      clickCellType: null  // 点击布置元素类型
    }
  },
  components: {
    TopBar,
    GameContent,
    Popover
  },
  mounted() {
    if (this.$route.params.gameMap) {
      this.gameMap = this.$route.params.gameMap
      this.popShow = false
    }
  },
  methods: {
    // 更改表格布局
    changeTableLayout() {
      this.gameMap = []
      for (let i = 0; i < this.gameMapForm.row; i++) {
        this.gameMap.push([])
      }
      for (let i = 0; i < this.gameMapForm.row; i++) {
        for (let j = 0; j < this.gameMapForm.column; j++) {
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
    // 选择地图元素
    choiceMapEl(index, type) {
      this.elIndex = index
      this.clickCellType = type
    },
    // 更改单元格
    changeCell() {
      Vue.set(this.gameMap[this.choiceRow], this.choiceColumn, this.clickCellType)
    },
    // 检测地图
    checkMap() {
      let player = 0
      let box = 0
      let end = 0
      for (let i in this.gameMap) {
        for (let j in this.gameMap) {
          if (this.gameMap[i][j] == 2) {
            player++
            if (player > 1) {
              this.$notify({type: 'danger', message:'人物不能超过一个！'})
              return false
            }
          }
          if (this.gameMap[i][j] == 3) {
            box++
          }
          if (this.gameMap[i][j] == 4) {
            end++
          }
        }
      }
      console.log(box, end);
      if (!player) {
        this.$notify({type: 'danger', message:'不能没有人物！'})
        return false
      }
      if (end < box) {
        this.$notify({type: 'danger', message:'终点数量不应小于箱子数量！'})
        return false
      }
      return true
    },
    // 测试地图
    testMap() {
      if (this.checkMap())
        this.$router.push({ name: 'game', params: { gameMap: this.gameMap} , query: { type: 'created' } })
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
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-start;
}

.map-el-container ul li {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  padding: 10px;
  margin: 10px 0;
  width: 20%;
}

.map-el-container ul li.active {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.map-el-container ul li .map-el-img {
  height: 30px;
  width: 30px;
  background-size: 100% 100%;
}
</style>
