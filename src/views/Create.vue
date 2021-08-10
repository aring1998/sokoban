<!-- 自定义地图 -->
<template>
  <div class="create">
    <top-bar></top-bar>
    <!-- 弹出层选择初始游戏地图布局 -->
    <popover ref="gameMapLayout">
      <van-form>
        <van-field
          v-model="gameMapForm.row"
          type="digit"
          maxlength="2"
          label="地图行数"
          placeholder="可选范围：5~40"
          :rules="[{ pattern: /^(5|40|[1-3][0-9])$/, required: true, message: '可选范围：5~40' }]"
        />
        <van-field
          v-model="gameMapForm.column"
          type="digit"
          maxlength="2"
          label="地图列数"
          placeholder="可选范围：5~40"
          :rules="[{ pattern: /^(5|40|[1-3][0-9])$/, required: true, message: '可选范围：5~40' }]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" @click="changeTableLayout">确定</van-button>
        </div>
      </van-form>
    </popover>

    <!-- 高级选项 -->
    <popover ref="advancedOptions">
      <van-form>
        <van-field
          v-model="advancedForm.life"
          type="digit"
          maxlength="3"
          label="人物生命"
          placeholder="可选范围：0~99"
          :rules="[{ pattern: /^[0-99]$/, message: '可选范围：0~99' }]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" @click="$refs.advancedOptions.show()">确定</van-button>
        </div>
      </van-form>
    </popover>

    <!-- 游戏地图 -->
    <game-content :game-map="gameMap" :get-column-index="getColumnIndex" :get-row-index="getRowIndex"></game-content>

    <!-- 选择地图元素 -->
    <div class="map-el-container">
      <ul>
        <li v-for="(item, index) of getMapEl()" :key="item.value" :class="{ active: index == elIndex }" @click="choiceMapEl(index, item.value)">
          <div
            class="map-el-img"
            :class="item.class"
          ></div>
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>

    <!-- 创建地图按钮 -->
    <van-row type="flex" justify="space-between" align="center" style="margin: 10px 0">
      <van-col span="6" align="center">
        <van-button type="info" size="small" @click="testMap">测试地图</van-button>
      </van-col>
      <van-col span="6" align="center">
        <van-button type="warning" size="small" @click="$refs.advancedOptions.show()">高级选项</van-button>
      </van-col>
    </van-row>
    <van-row type="flex" justify="space-around" align="center" style="margin: 10px 0">
      <van-col span="6" align="center">
        <van-button type="primary" size="small" @click="addRow" :disabled="gameMap.length == 40">添加一行</van-button>
      </van-col>
      <van-col span="6" align="center">
        <van-button type="danger" size="small" @click="delRow" :disabled="gameMap.length == 1">删除一行</van-button>
      </van-col>
      <van-col span="6" align="center">
        <van-button type="primary" size="small" @click="addColumn" :disabled="gameMap[0].length == 40">添加一列</van-button>
      </van-col>
      <van-col span="6" align="center">
        <van-button type="danger" size="small" @click="delColumn" :disabled="gameMap[0].length == 1">删除一列</van-button>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import Vue from 'vue'

import { mapEl } from '@/assets/js/map-el/index'

import TopBar from '@/components/TopBar'
import GameContent from '@/components/GameContent'
import Popover from '@/components/Popover'

export default {
  data() {
    return {
      gameMapForm: { // 地图设置项
        row: null,
        column: null
      },
      advancedForm: { // 高级选项表单
        life: 0
      },
      gameMap: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ],
      choiceRow: 0, // 选中行
      choiceColumn: 0, // 选中列
      elIndex: null, // 元素对应索引
      clickCellType: null // 点击布置元素类型
    }
  },
  components: {
    TopBar,
    GameContent,
    Popover
  },
  mounted() {
    // 接收测试地图页返回编辑
    if (this.$route.params.gameMap) {
      this.gameMap = this.$route.params.gameMap
      this.advancedForm.life = this.$route.params.life
    } else this.$refs.gameMapLayout.show()
  },
  methods: {
    // 获取地图元素
    getMapEl() {
      return mapEl
    },
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
      this.$refs.gameMapLayout.show()
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
      let singlePortalEntry = 0
      let singlePortalExit = 0
      for (let y in this.gameMap) {
        for (let x in this.gameMap[y]) {
          switch (this.gameMap[y][x]) {
            case 2: {
              player++
              if (player > 1) {
                this.$notify({ type: 'danger', message: '人物不能超过一个！' })
                return false
              }
              break
            }
            case 3: {
              box++
              break
            }
            case 4: {
              end++
              break
            }
            case 5:
            case 6: {
              if (this.advancedForm.life < 1) {
                this.$notify({ type: 'danger', message: '有攻击性元素时，人物生命值不得为零！' })
                this.$refs.advancedOptions.show()
                return false
              }
            }
            case 10: {
              singlePortalEntry++
              break
            }
            case 11: {
              singlePortalExit++
              break
            }
          }
        }
      }
      if (!player) {
        this.$notify({ type: 'danger', message: '不能没有人物！' })
        return false
      }
      if (end < box) {
        this.$notify({ type: 'danger', message: '终点数量不应小于箱子数量！' })
        return false
      }
      if ((singlePortalEntry > 0 && singlePortalExit === 0) || (singlePortalEntry === 0 && singlePortalExit > 0)) {
        this.$notify({ type: 'danger', message: '传送门入口和传送门出口必须同时存在！' })
        return false
      }
      return true
    },
    // 测试地图
    testMap() {
      if (this.checkMap())
        this.$router.push({ name: 'game', params: { gameMap: this.gameMap, life: this.advancedForm.life } , query: { type: 'created' } })
    },
    // 增加一行
    addRow() {
      this.gameMap.push([])
      for (let i = 0; i < this.gameMap[0].length; i++) {
        this.gameMap[this.gameMap.length - 1].push(1)
      }
    },
    // 增加一列
    addColumn() {
      for (let i = 0; i < this.gameMap.length; i++) {
        this.gameMap[i].push(1)
      }
    },
    // 删除一行
    delRow() {
      this.gameMap.pop()
    },
    // 删除一列
    delColumn() {
      for (let i = 0; i < this.gameMap.length; i++) {
        this.gameMap[i].pop()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.create {
  background-color: var(--mainColor);
  height: 100vh;
}

.map-el-container {
  background-color: rgba(255, 255, 255, 0.6);
  height: 170px;
  overflow: auto;
  ul {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-start;
    li {
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      padding: 10px;
      margin: 10px 0;
      width: 20%;
      .map-el-img {
        height: 30px;
        width: 30px;
        background-size: 100% 100%;
      }
    }
    li.active {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 10px;
    }
  }
}
</style>
