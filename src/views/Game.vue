<template>
  <div class="sokoban">
    <!-- 顶部导航栏 -->
    <top-bar></top-bar>
    <!-- 游戏内容 -->
    <game-content :game-map="gameMap"></game-content>
    <!-- 虚拟手柄 -->
    <div class="analog-handle">
      <div class="top">
        <i class="el-icon-caret-top" @click="move('y', -1)"></i>
      </div>
      <div class="center">
        <i class="el-icon-caret-left" @click="move('x', -1)"></i>
        <i class="el-icon-caret-right" @click="move('x', 1)"></i>
      </div>
      <div class="bottom">
        <i class="el-icon-caret-bottom" @click="move('y', 1)"></i>
      </div>
    </div>
    <popover v-show="popShow" v-if="this.$route.params.type == 'created'">
      <div class="test-pop">
        <span>您已完成该地图的测试</span>
        <span>您可以选择将地图存储</span>
        <span>我们需要更多有趣的地图</span>
        <span>如果可以请选择上传云端</span>
        <div>
          <button @click="saveLocal">存在本地</button>
          <button @click="saveServe">上传云端</button>
        </div>
      </div>
    </popover>
    <button @click="changeLevel(-1)">上一关</button>
    <button @click="changeLevel(1)">下一关</button>
  </div>
</template>

<script>
import Vue from 'vue'

import { official } from '@/assets/js/level'
import { request } from '@/network/request'

import TopBar from '@/components/TopBar'
import GameContent from '@/components/GameContent'
import Popover from '@/components/Popover'

export default {
  data() {
    return {
      level: 0,
      gameMap: official[0], // 游戏地图
      playerX: 0, // 人物x轴坐标
      playerY: 0, // 人物y轴坐标
      endCounter: 0, // 终点个数
      popShow: false, // 弹出框是否展示
    }
  },
  components: {
    TopBar,
    GameContent,
    Popover,
  },
  mounted() {
    //判断是否通过创意工坊进入

    //判断是否通过选关进入
    if (this.$route.query.level !== undefined) {
      this.changeLevel(this.$route.query.level - 1)
    }
    // 判断是否测试地图
    if (this.$route.params.type == 'created') {
      console.log('cre')
      this.gameMap = this.$route.params.gameMap
    }
    // 游戏初始化
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.endCounter = 0
      // 获取人物坐标、终点个数
      for (let y in this.gameMap) {
        for (let x in this.gameMap[y]) {
          if (this.gameMap[y][x] == 2) {
            console.log('找到玩家的坐标：', x, y)
            this.playerX = x
            this.playerY = y
          }
          if (this.gameMap[y][x] == 4) {
            this.endCounter++
          }
        }
      }
    },
    // 玩家移动
    move(direction, step) {
      /**
       * 变量名
       * @direction: 轴方向
       * @step: 步数
       * @fromPlace: 出发点
       * @toPlace: 目标点
       * @setY: 目标点Vue.set中object的index值
       * @setX: 目标点Vue.set中key值
       * @setBoxY: 箱子移动点Vue.set中object的index值
       * @setBoxX: 箱子移动点Vue.set中key值
       * @isDefault: 是否默认的移动方法
       */

      // 声明初始变量
      const fromPlace = this.gameMap[this.playerY][this.playerX]
      let toPlace, boxPlace, setY, setX, setBoxY, setBoxX
      let isDefault = true

      // 判断方向
      if (direction == 'x') {
        setY = this.playerY
        setX = +this.playerX + step
        setBoxY = setY
        setBoxX = setX + step
      } else {
        setY = +this.playerY + step
        setX = this.playerX
        setBoxY = setY + step
        setBoxX = setX
      }

      // 判断是否超出单元格
      if (setY < 0 || setY == this.gameMap[0].length || setX < 0 || setX == this.gameMap[0].length) return
      else toPlace = this.gameMap[setY][setX]

      // 如果出发点是箱子抵达终点或人物在终点上
      if (fromPlace == 5 || fromPlace == 6) Vue.set(this.gameMap[this.playerY], this.playerX, 4)
      else Vue.set(this.gameMap[this.playerY], this.playerX, 1)

      // 判断目标点
      switch (toPlace) {
        case 0: {
          // 碰墙
          Vue.set(this.gameMap[this.playerY], this.playerX, 2)
          return
        }
        case 3:
        case 5: {
          // 碰箱子
          if (direction == 'x') boxPlace = this.gameMap[this.playerY][+this.playerX + step * 2]
          else boxPlace = this.gameMap[+this.playerY + step * 2][this.playerX]

          // 如果箱子撞墙/箱子
          if (boxPlace == 0 || boxPlace == 3) {
            Vue.set(this.gameMap[this.playerY], this.playerX, 2)
            return
          }
          // 如果箱子能移动
          if (boxPlace == 4) {
            // 如果箱子抵达终点
            Vue.set(this.gameMap[setBoxY], setBoxX, 5)
            setTimeout(() => {
              if (document.querySelectorAll('.box.end').length == this.endCounter) {
                alert('you win!')
                if (this.$route.params.type == 'created') {
                  this.popShow = true
                } else this.changeLevel(1)
              }
            }, 0)
          } else Vue.set(this.gameMap[setBoxY], setBoxX, 3)
          // 如果目标点是箱子抵达终点或人物在终点上
          if (toPlace == 5 || toPlace == 6) {
            isDefault = false
            Vue.set(this.gameMap[setY], setX, 6)
          }
          break
        }
        case 4: {
          // 碰终点
          isDefault = false
          Vue.set(this.gameMap[setY], setX, 6)
          break
        }
      }
      // 设定移动后的玩家位置
      if (direction == 'x') this.playerX = +this.playerX + step
      else this.playerY = +this.playerY + step

      if (isDefault == true) Vue.set(this.gameMap[setY], setX, 2)
      return
    },
    // 切换关卡
    changeLevel(value) {
      this.level += value
      this.gameMap = []
      setTimeout(() => {
        this.gameMap = official[this.level]
        this.init()
      }, 0)
    },
    // 将地图存在本地
    saveLocal() {
      for (let i = 0; i < 99; i++) {
        if (!window.localStorage.getItem('map' + i)) {
          window.localStorage.setItem('map' + i, this.gameMap)
          break
        }
      }
    },
    // 将地图上传云端
    saveServe() {
      const mapData = this.gameMap
      request({
        url: 'map/add',
        method: 'POST',
        data: {
          creator: '',
          mapName: '',
          mapData,
        },
      })
        .then((res) => {
          console.log(res)
          this.$message({
            message: '上传成功',
            type: 'success',
          })
        })
        .catch((err) => {
          this.$message.error('上传失败，错误：' + err)
        })
    },
  },
}
</script>

<style>
.sokoban {
  background-color: var(--mainColor);
  height: 100vh;
}

.analog-handle {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  border: 5px rgba(0, 0, 0, 0.4) solid;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  margin-top: 30px;
}

.analog-handle div {
  height: 33%;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analog-handle i {
  font-size: 60px;
  color: #fff;
}

.analog-handle .center {
  display: flex;
  justify-content: space-between;
}

.test-pop {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
}

.test-pop span {
  margin-bottom: 8px;
}
</style>
