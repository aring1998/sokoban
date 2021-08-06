<template>
  <div class="sokoban" v-cloak>
    <!-- 顶部导航栏 -->
    <top-bar></top-bar>
    <!-- 人物生命值 -->
    <div class="life" v-if="initLife > 0">
      <span>当前生命：</span>
      <span v-if="life < 12">
        <van-icon name="like" color="red" v-for="(item, index) in life" :key="index" />
      </span>
      <span v-else>
        <van-icon name="like" color="red" />
        <span>&ensp;× {{ life }}</span>
      </span>
    </div>
    <!-- 游戏内容 -->
    <game-content :game-map="gameMap" ref="game"></game-content>
    <!-- 步数 -->
    <div class="step">
      <span>当前步数：{{ step }}</span>
    </div>
    <!-- 行为控制 -->
    <div class="check-point">
      <van-button @click="onRegret" type="primary" size="mini" :disabled="this.activeMapRecord.length == 1">撤回</van-button>
      <van-button @click="onReset" type="primary" size="mini">重置</van-button>
    </div>
    <!-- 虚拟手柄 -->
    <div class="analog-handle">
      <div class="top">
        <van-icon name="arrow-up" @touchstart.prevent="move('y', -1)" @touchend.prevent="stopMove()" />
      </div>
      <div class="center">
        <van-icon name="arrow-left" @touchstart.prevent="move('x', -1)" @touchend.prevent="stopMove()" />
        <van-icon name="arrow" @touchstart.prevent="move('x', 1)" @touchend.prevent="stopMove()" />
      </div>
      <div class="bottom">
        <van-icon name="arrow-down" @touchstart.prevent="move('y', 1)" @touchend.prevent="stopMove()" />
      </div>
    </div>
    <!-- 切关控制：选关进入显示 -->
    <div class="check-point" v-if="$route.query.type == 'level'">
      <van-button @click="changeLevel(-1)" type="primary" size="mini" :disabled="level == 0">上一关</van-button>
      <van-button @click="changeLevel(1)" type="primary" size="mini" :disabled="level == levelCounter" >下一关</van-button>
    </div>
    <!-- 编辑控制：创建地图进入显示 -->
    <div class="check-point" v-if="$route.query.type == 'created'">
      <van-button @click="$router.push({ name: 'create', params: { gameMap, life: initLife } })" type="info" size="mini">返回编辑</van-button>
      <van-button @click="$router.push('/index')" type="danger" size="mini">放弃编辑</van-button>
    </div>
    <popover ref="saveMap" v-if="this.$route.query.type == 'created'">
      <div class="test-map-pop">
        <span>您已完成该地图的测试</span>
        <span>您可以选择将地图存储</span>
        <span>我们需要更多有趣的地图</span>
        <span>如果可以请选择上传云端</span>
        <van-field
          v-model="uploadMap.mapName"
          maxlength="32"
          label="地图名"
          placeholder="请为您的地图取个名字，最长32字"
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
import store from '@/store'

import { basic, expand } from '@/assets/js/level/index'
import { request } from '@/network/request'
import { deepCloneObj, deepClone2Arr, isEmptyObject } from '@/utils/index'

import TopBar from '@/components/TopBar'
import GameContent from '@/components/GameContent'
import Popover from '@/components/Popover'

export default {
  data() {
    return {
      level: 0, // 关卡级数
      levelCounter: 0, // 关卡总量
      gameMap: [], // 游戏地图
      staticMap: [], // 静止层地图
      activeMap: [], // 活动层地图
      staticMapRecord: [], // 静止层每步地图记录
      activeMapRecord: [], // 活动层每步地图记录
      step: 0, // 步数
      endCounter: 0, // 终点个数
      initLife: 0, // 初始生命
      life: 0, // 人物生命
      lifeRecord: [], // 生命记录
      playerX: 0, // 人物x轴坐标
      playerY: 0, // 人物y轴坐标
      uploadMap: { // 上传地图表单
        mapName: '',
        creator: store.state.username || ''
      },
      keepMove: null, // 持续移动定时器
      initStatus: { // 初始人物状态
        poisoning: false, // 是否中毒
      },
      status: null, // 人物当前状态
      statusRecord: [] // 人物状态记录
    }
  },
  components: {
    TopBar,
    GameContent,
    Popover
  },
  mounted() {
    // 页面刷新，返回首页
    if (isEmptyObject(this.$route.params)) {
      this.$router.push('/index')
      return
    }
    // 判断入口
    switch (this.$route.query.type) {
      // 由选关进入
      case 'level': {
        this.level = this.$route.params.level
        // 判断地图包
        switch (this.$route.query.pack) {
          case 'basic': {
            this.gameMap = deepClone2Arr(basic[this.level])
            this.levelCounter = basic.length - 1
            break
          }
          case 'expand': {
            this.gameMap = deepClone2Arr(expand[this.level].gameMap)
            this.initLife = expand[this.level].life
            this.levelCounter = expand.length - 1
            break
          }
        }
        break
      }
      // 由测试地图/创意工坊进入
      case 'workshop':
      case 'created': {
        this.gameMap = this.$route.params.gameMap
        this.initLife = +this.$route.params.life || 0
        break
      }
    }

    // 游戏初始化
    this.init()
  },
  methods: {
    // 初始化
    init() {
      // 重置生命、终点个数，步数
      this.life = this.initLife
      this.endCounter = 0
      this.step = 0
      this.status = deepCloneObj(this.initStatus) // 对象深拷贝
      // 调用子组件分离方法
      this.$refs.game.separateMap(this.gameMap)
      // 从子组件获取数据
      this.staticMap = this.$refs.game.staticMap
      this.activeMap = this.$refs.game.activeMap

      // 获取人物坐标、终点个数
      for (let y in this.gameMap) {
        for (let x in this.gameMap[y]) {
          if (this.gameMap[y][x] == 2) {
            console.log('找到玩家的坐标：', x, y)
            this.playerX = +x
            this.playerY = +y
          }
          if (this.gameMap[y][x] == 4) {
            this.endCounter++
          }
        }
      }

      // 大图中初始移动到玩家视角
      this.$nextTick(() => {
        if (this.gameMap.length > 12 || this.gameMap[0].length > 12) {
          if (this.playerX * 30 >= 180) {
            this.$refs.game.$el.scrollLeft = this.playerX * 30 - 165
          }
          if (this.playerY * 30 >= 180) {
            this.$refs.game.$el.scrollTop = this.playerY * 30 - 165
          }
        }
      })

      // 深拷贝初始地图
      this.staticMapRecord = [deepClone2Arr(this.staticMap)]
      this.activeMapRecord = [deepClone2Arr(this.activeMap)]
      this.lifeRecord = [this.initLife]
      this.statusRecord = [deepCloneObj(this.status)]
    },
    // 玩家移动
    move(direction, step) {
      /**
       * 变量名
       * @direction: 轴方向
       * @step: 步数
       * @staticTarget: 静止层目标点
       * @activeTarget: 活动层目标点
       * @staticBoxTarget: 静止层箱子目标点
       * @activeBoxTarget: 活动层箱子目标点
       * @setY: 目标点Vue.set中object的index值
       * @setX: 目标点Vue.set中key值
       * @setBoxY: 箱子移动点Vue.set中object的index值
       * @setBoxX: 箱子移动点Vue.set中key值
       */

      // 长按持续移动
      clearTimeout(this.keepMove)
      this.keepMove = setTimeout(() => {
        this.move(direction, step)
      }, 300)

      // 声明初始变量
      let staticTarget, activeTarget, staticBoxTarget, activeBoxTarget, setY, setX, setBoxY, setBoxX

      // 判断是否中毒
      if (this.status.poisoning) step = -step

      // 判断方向
      if (direction == 'x') {
        setY = this.playerY
        setX = this.playerX + step
        setBoxY = setY
        setBoxX = setX + step
      } else {
        setY = this.playerY + step
        setX = this.playerX
        setBoxY = setY + step
        setBoxX = setX
      }

      // 判断是否超出单元格
      if (setY < 0 || setY == this.gameMap[0].length || setX < 0 || setX == this.gameMap[0].length) return
      
      staticTarget = this.staticMap[setY][setX] // 获取静止层目标点的值
      activeTarget = this.activeMap[setY][setX] // 获取活动层目标点的值

      // 判断静止层目标点
      switch (staticTarget) {
        // 碰墙
        case 0: return
        // 碰地刺
        case 5:
        case 6: {
          this.life--
          if (this.life == 0) {
            this.$notify({ type: 'danger', message: 'you dead!'})
            this.onReset()
            return
          }
          break
        }
        // 碰毒蘑菇
        case 8: {
          this.status.poisoning = true
          Vue.set(this.staticMap[setY], setX, 1)  // 消除蘑菇
        }
      }

      // 判断活动层目标点
      switch (activeTarget) {
        // 碰箱子
        case 3:
        case 7: {
          staticBoxTarget = this.staticMap[setBoxY][setBoxX] // 获取静止层箱子目标点
          activeBoxTarget = this.activeMap[setBoxY][setBoxX] // 获取活动层箱子目标点
          let isDefault = true // 是否默认移动方法

          // 判断静止层箱子目标点
          switch (staticBoxTarget) {
            // 碰墙
            case 0: return
            // 碰终点
            case 4: {
              setTimeout(() => {
                if (document.querySelectorAll('.end.box').length == this.endCounter) {
                  setTimeout(() => {
                    this.$notify({ type: 'success', message: 'you win!'})
                    switch (this.$route.query.type) {
                      case 'level': {
                        this.changeLevel(1)
                        break
                      }
                      case 'created': {
                        this.$refs.saveMap.show()
                        break
                      }
                      case 'workshop': {
                        this.$router.push('/workshop')
                        break
                      }
                    }
                  })
                }
              })
              break
            }
            // 碰火
            case 6: {
              // 如果是冰箱子，灭火
              if (staticTarget == 7) {
                Vue.set(this.staticMap[setBoxY], setBoxX, 1)  // 灭火
                Vue.set(this.activeMap[setBoxY], setBoxX, 3)  // 变为普通箱子
                isDefault = false
              }
              // 烧毁普通箱子
              else Vue.set(this.activeMap[setBoxY], setBoxX, 1)
            }
          }

          // 判断活动层箱子目标点
          switch (activeBoxTarget) {
            // 碰箱子
            case 3: return
          }
          // 箱子可以正常移动
          if (isDefault) Vue.set(this.activeMap[setBoxY], setBoxX, activeTarget)
        }
      }
      
      // 玩家可以正常移动
      Vue.set(this.activeMap[this.playerY], this.playerX, 1)
      Vue.set(this.activeMap[setY], setX, 2)
      this.step++

      // 设定移动后的玩家位置
      if (direction == 'x') this.playerX += step
      else this.playerY += step
      
      // 大图追踪视角
      if (this.gameMap.length > 12 || this.gameMap[0].length > 12) {
        if (direction == 'x') {
          if (this.playerX * 30 >= 180) {
            this.$nextTick(() => {
              this.$refs.game.$el.scrollTo({ left: this.playerX * 30 - 165, behavior: 'smooth' })
            })
          }
        } else {
          if (this.playerY * 30 >= 180) {
            this.$nextTick(() => {
              this.$refs.game.$el.scrollTo({ top: this.playerY * 30 - 165, behavior: 'smooth' })
            })
          }
        }
      }

      // 记录移动后地图数据
      this.staticMapRecord.push(deepClone2Arr(this.staticMap))
      this.activeMapRecord.push(deepClone2Arr(this.activeMap))
      this.lifeRecord.push(this.life)
      this.statusRecord.push(deepCloneObj(this.status))
    },
    // 松开按键时，停止移动
    stopMove() {
      clearTimeout(this.keepMove)
    },
    // 撤回（可以连续撤回置第一步）
    onRegret() {
      // 向子组件赋值，并重新浅拷贝
      this.$refs.game.staticMap = deepClone2Arr(this.staticMapRecord[this.step - 1]) // 静止层
      this.$refs.game.activeMap = deepClone2Arr(this.activeMapRecord[this.step - 1]) // 活动层
      this.staticMap = this.$refs.game.staticMap
      this.activeMap = this.$refs.game.activeMap
      this.staticMapRecord.pop()
      this.activeMapRecord.pop()
      // 读取记录中生命值
      this.life = this.lifeRecord[this.step - 1]
      this.lifeRecord.pop()
      // 读取人物状态记录
      this.status = deepCloneObj(this.statusRecord[this.step - 1])
      this.statusRecord.pop()
      this.step--
      // 撤回后重新获取玩家坐标
      for (let y in this.activeMap) {
        for (let x in this.activeMap[y]) {
          if (this.activeMap[y][x] == 2) {
            this.playerX = +x
            this.playerY = +y
            break
          }
        }
      }
    },
    // 重置当前关卡
    onReset() {
      this.init()
    },
    // 切换关卡
    changeLevel(value) {
      this.level += value
      // 判断地图包
      switch (this.$route.query.pack) {
        case 'basic': {
          this.gameMap = deepClone2Arr(basic[this.level])
          break
        }
        case 'expand': {
          this.gameMap = deepClone2Arr(expand[this.level].gameMap)
          this.initLife = expand[this.level].life
          break
        }
      }
      this.init()
    },
    // 将地图存在本地
    saveLocal() {
      for (let i = 0; i < 99; i++) {
        if (!window.localStorage.getItem('map' + i)) {
          window.localStorage.setItem('map' + i, JSON.stringify({
            creator: this.uploadMap.creator,
            mapName: this.uploadMap.mapName,
            mapData: this.gameMap,
            life: this.initLife,
            time: new Date()
          }))
          this.$notify({ type: 'success', message: '存储成功，3秒后将返回首页' })
          break
        } else this.$notify({ type: 'error', message: '本地存储已达上限' })
      }
      this.$refs.saveMap.show()
      setTimeout(() => {
        this.$router.push('/index')
      }, 3000)
    },
    // 将地图上传云端
    saveServe() {
      request({
        url: 'map/add',
        method: 'POST',
        data: {
          creator: this.uploadMap.creator,
          mapName: this.uploadMap.mapName,
          mapData: this.gameMap,
          playerHP: this.initLife
        }
      })
        .then(res => {
          if (res.code == 0) {
            this.$notify({ type: 'success', message: '上传成功，3秒后将返回首页' })
            this.$refs.saveMap.show()
            setTimeout(() => {
              this.$router.push('/index')
            }, 3000)
          } else {
            this.$notify({ type: 'danger', message: res.msg })
          }
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
.life,
.step {
  display: flex;
  align-items: center;
  font-weight: 600;
  padding: 0 30px;
  color: #fff;
  height: 30px;
  .life-show-type {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    i {
      font-size: 18px;
      font-weight: 600;
    }
  }
}
</style>
