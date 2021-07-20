<template>
  <div class="sokoban">
    <!-- 顶部导航栏 -->
    <top-bar></top-bar>
    <!-- 人物生命值 -->
    <div class="life">
      <span>当前生命：</span>
      <van-icon name="like" color="red" v-for="(item, index) in 2" :key="index" />
      <van-icon name="like" color="gray" v-for="(item, index) in 1" :key="index" />
    </div>
    <!-- 游戏内容 -->
    <game-content :game-map="gameMap"></game-content>
    <div class="check-point">
      <van-button class="regret" @click="onRegret" type="primary" size="mini">撤回</van-button>
      <van-button class="reset" @click="onReset" type="primary" size="mini">重置</van-button>
    </div>
    <!-- 虚拟手柄 -->
    <div class="analog-handle">
      <div class="top">
        <van-icon name="arrow-up" @touchstart="move('y', -1)" @touchend.prevent="stopMove()" />
      </div>
      <div class="center">
        <van-icon name="arrow-left" @touchstart="move('x', -1)" @touchend.prevent="stopMove()" />
        <van-icon name="arrow" @touchstart="move('x', 1)" @touchend.prevent="stopMove()" />
      </div>
      <div class="bottom">
        <van-icon name="arrow-down" @touchstart="move('y', 1)" @touchend.prevent="stopMove()" />
      </div>
    </div>
    <div class="check-point" v-if="$route.query.type == 'level'">
      <van-button @click="changeLevel(-1)" type="primary" size="mini" :disabled="level == 0">上一关</van-button>
      <van-button @click="changeLevel(1)" type="primary" size="mini" :disabled="level == levelCounter" >下一关</van-button
      >
    </div>
    <div class="check-point" v-if="$route.query.type == 'created'">
      <van-button @click="$router.push({ name: 'create', params: { gameMap: initMap } })" type="info" size="mini">返回编辑</van-button>
      <van-button @click="$router.push('/index')" type="danger" size="mini">放弃编辑</van-button>
    </div>
    <popover v-show="popShow" v-if="this.$route.query.type == 'created'">
      <div class="test-map-pop">
        <span>您已完成该地图的测试</span>
        <span>您可以选择将地图存储</span>
        <span>我们需要更多有趣的地图</span>
        <span>如果可以请选择上传云端</span>
        <van-field
          v-model="uploadMap.mapName"
          maxlength="10"
          label="地图名"
          placeholder="请为您的地图取个名字，最长10字"
        />
        <van-field
          v-model="uploadMap.creator"
          maxlength="10"
          label="作者"
          placeholder="请输入您的昵称，最长10字"
        />
        <div>
          <button @click="saveLocal">存在本地</button>
          <button @click="saveServe">上传云端</button>
        </div>
      </div>
    </popover>
  </div>
</template>

<script>
import Vue from 'vue'

import { official } from '@/assets/js/level'
import { request } from '@/network/request'
import { deepClone2Arr } from '@/utils/index'

import TopBar from '@/components/TopBar'
import GameContent from '@/components/GameContent'
import Popover from '@/components/Popover'

export default {
  data() {
    return {
      level: 0, // 关卡
      levelCounter: official.length - 1, // 关卡总量
      gameMap: official[0], // 游戏地图
      initMap: [], // 初始地图
      mapRecord: [], // 每步地图记录
      step: 0, // 步数
      playerX: 0, // 人物x轴坐标
      playerY: 0, // 人物y轴坐标
      endCounter: 0, // 终点个数
      popShow: false, // 弹出框是否展示
      mark: false,
      uploadMap: { // 上传地图表单
        mapName: '',
        creator: ''
      },
      moveInterval: null
    }
  },
  components: {
    TopBar,
    GameContent,
    Popover
  },
  mounted() {
    // 判断入口
    switch (this.$route.query.type) {
      // 由选关进入
      case 'level': {
        this.level = this.$route.params.level - 1
        this.gameMap = deepClone2Arr(official[this.level])
        break
      }
      // 由测试地图/创意工坊进入
      case 'workshop':
      case 'created': {
        this.gameMap = this.$route.params.gameMap
        break
      }
    }

    // 游戏初始化
    this.init(this.gameMap)
  },
  methods: {
    // 初始化
    init(gameMap) {
      this.gameMap = gameMap
      this.endCounter = 0
      this.step = 0
      // 获取人物坐标、终点个数
      for (let y in gameMap) {
        for (let x in gameMap[y]) {
          if (gameMap[y][x] == 2 || gameMap[y][x] == 6) {
            console.log('找到玩家的坐标：', x, y)
            this.playerX = x
            this.playerY = y
          }
          if (gameMap[y][x] == 4) {
            this.endCounter++
          }
        }
      }
      // 深拷贝初始地图
      this.initMap = deepClone2Arr(this.gameMap)
      this.mapRecord = [deepClone2Arr(this.gameMap)]
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

      // 长按持续移动
      clearTimeout(this.moveInterval)
      this.moveInterval = setTimeout(() => {
        this.move(direction, step)
      }, 500)

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
        // 碰墙
        case 0: {
          if (fromPlace == 5 || fromPlace == 6) Vue.set(this.gameMap[this.playerY], this.playerX, 6)
          else Vue.set(this.gameMap[this.playerY], this.playerX, 2)
          return
        }
        // 碰箱子
        case 3:
        case 5: {
          if (direction == 'x') boxPlace = this.gameMap[this.playerY][+this.playerX + step * 2]
          else boxPlace = this.gameMap[+this.playerY + step * 2][this.playerX]

          // 如果箱子撞墙/箱子
          if (boxPlace == 0 || boxPlace == 3) {
            if (fromPlace == 5 || fromPlace == 6)
              Vue.set(this.gameMap[this.playerY], this.playerX, 6)
            else Vue.set(this.gameMap[this.playerY], this.playerX, 2)
            return
          }
          // 如果箱子能移动
          if (boxPlace == 4) {
            // 如果箱子抵达终点
            Vue.set(this.gameMap[setBoxY], setBoxX, 5)
            this.$nextTick(() => {
              if (document.querySelectorAll('.box.end').length == this.endCounter) {
                setTimeout(() => {
                  alert('you win!')
                  switch (this.$route.query.type) {
                    case 'level': {
                      this.changeLevel(1)
                    }
                    case 'created': {
                      this.popShow = true
                    }
                    case 'workshop': {
                      this.$router.push('/workshop')
                    }
                  }
                })
              }
            })
          } else Vue.set(this.gameMap[setBoxY], setBoxX, 3)
          // 如果目标点是箱子抵达终点或人物在终点上
          if (toPlace == 5 || toPlace == 6) {
            isDefault = false
            Vue.set(this.gameMap[setY], setX, 6)
          }
          break
        }
        // 碰终点
        case 4: {
          isDefault = false
          Vue.set(this.gameMap[setY], setX, 6)
          break
        }
      }
      // 设定移动后的玩家位置
      if (direction == 'x') this.playerX = +this.playerX + step
      else this.playerY = +this.playerY + step
      // 默认情况下，设定目标点为人物
      if (isDefault == true) Vue.set(this.gameMap[setY], setX, 2)
      // 记录移动后地图数据
      this.mapRecord.push(deepClone2Arr(this.gameMap))
      this.step++
    },
    // 离开按键时，停止移动
    stopMove() {
      clearTimeout(this.moveInterval)
    },
    // 撤回（可以连续撤回置第一步）
    onRegret() {
      this.gameMap = deepClone2Arr(this.mapRecord[this.step - 1])
      this.mapRecord.pop()
      this.step--
      for (let y in this.gameMap) {
        for (let x in this.gameMap[y]) {
          if (this.gameMap[y][x] == 2 || this.gameMap[y][x] == 6) {
            console.log('找到玩家的坐标：', x, y)
            this.playerX = x
            this.playerY = y
            break
          }
        }
      }
    },
    // 重置当前关卡
    onReset() {
      // const { level } = this.$route.query;
      // this.gameMap = JSON.parse(window.sessionStorage.getItem('baseData'))[level];
      this.init(this.initMap)
    },
    // 切换关卡
    changeLevel(value) {
      // 待看
      // console.log(this.mark)
      // let [t, m] = this.mark.split('-');
      // if (value === -1 && this.level === 0 && t === 'T') {
      //   this.$router.push({ path: 'game', query: { level: m+=value } })
      //   this.$notify({type: 'danger', message:'当前关卡，不能进行此操作哦，宝~'})
      //   return;
      // }
      // this.mark = 'F-0';
      this.level += value
      this.gameMap = []
      // 修改关卡，修改路由参数
      // this.$router.push({
      //   name: 'game',
      //   query: { type: 'level' },
      //   params: { level: this.level }
      // })
      this.$nextTick(() => {
        this.gameMap = deepClone2Arr(official[this.level])
        this.init(this.gameMap)
      })
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
      const mapData = this.initMap
      const creator = this.uploadMap.creator
      const mapName = this.uploadMap.mapName
      request({
        url: 'map/add',
        method: 'POST',
        data: { creator, mapName, mapData }
      })
        .then(res => {
          this.$notify({ type: 'success', message: '上传成功' })
        })
        .catch(err => {
          this.$notify({ type: 'danger', message: '上传失败，错误：' + err })
        })
    }
  }
}
</script>

<style lang="scss">
.sokoban {
  background-color: var(--mainColor);
  height: 100vh;
}

.operation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  .regret {
    margin-left: 15px;
  }
  .reset {
    margin-right: 15px;
  }
}

// 虚拟手柄
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
  div {
    height: 33%;
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  i {
    font-size: 60px;
    color: #fff;
  }
  .center {
    display: flex;
    justify-content: space-between;
  }
}

// 测试地图弹窗
.test-map-pop {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  span {
    margin-bottom: 8px;
  }
}

.check-point {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
}

// 人物生命值
.life {
  display: flex;
  align-items: center;
  font-weight: 600;
  padding: 0 30px;
  color: #fff;
  height: 30px;
  i {
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
