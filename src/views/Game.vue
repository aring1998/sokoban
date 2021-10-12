<template>
  <div class="game" v-cloak>
    <!-- 顶部导航栏 -->
    <top-bar></top-bar>
    <!-- 游戏信息 -->
    <div class="game-info">
      <!-- 步数 -->
      <div class="step">
        <span v-if="$route.query.type === 'level'">关卡: {{ $route.query.pack === 'basic' ? '基础关' : '拓展关' }}--{{ level + 1 }}</span>
        <van-popover
          v-model="showMapName"
          theme="dark"
          trigger="click"
          class="map-name"
          :placement="mapName.length > 20 ? 'right-end' : 'bottom'"
          v-else
        >
          <span style="word-break: break-all">{{ mapName }}</span>
          <template #reference>
            <span>地图名: {{ mapName }}</span>
          </template>
        </van-popover>
        <span>当前步数：{{ step }}</span>
        <span>最优步数：{{ bestStep }}</span>
      </div>
      <!-- 人物生命值 -->
      <div class="life" v-if="initLife > 0">
        <span>生命值：</span>
        <span v-if="life < 12">
          <van-icon name="like" color="red" v-for="(item, index) in life" :key="index" />
        </span>
        <span v-else>
          <van-icon name="like" color="red" />
          <span>&ensp;× {{ life }}</span>
        </span>
      </div>
    </div>
    <!-- 行为控制 -->
    <div class="check-point">
      <van-button @click="init" type="primary" size="mini">重置</van-button>
      <van-button @click="onRegret" type="primary" size="mini" :disabled="this.record.activeMapRecord.length === 1">撤回</van-button>
      <van-button @click="tipsShow = true" type="primary" size="mini" v-if="$route.query.type !== 'created'">提示</van-button>
      <van-button
        @click="changeLevel(-1)"
        type="primary" size="mini"
        :disabled="level === 0"
        v-if="$route.query.type === 'level'"
      >
        上一关
      </van-button>
      <van-button
        @click="changeLevel(1)"
        type="primary"
        size="mini"
        :disabled="level === levelCounter"
        v-if="$route.query.type === 'level'"
      >
        下一关
      </van-button>
      <van-button
        @click="$router.push({ name: 'create', params: { gameMap, life: initLife, regretDisabled } })"
        type="info"
        size="mini"
        v-if="$route.query.type === 'created'"
      >
        返回编辑
      </van-button>
      <van-button @click="$router.push('/index')" type="danger" size="mini"  v-if="$route.query.type == 'created'">放弃编辑</van-button>
    </div>
    <!-- 游戏内容 -->
    <game-content :game-map="gameMap" ref="game"></game-content>
    <!-- 虚拟手柄 -->
    <div class="analog-handle">
      <div class="top">
        <van-icon name="play" style="transform: rotate(-90deg)" @touchstart.prevent="move('y', -1)" @touchend.prevent="stopMove()" />
      </div>
      <div class="center">
        <van-icon name="play" style="transform: rotate(180deg)" @touchstart.prevent="move('x', -1)" @touchend.prevent="stopMove()" />
        <van-icon name="play" @touchstart.prevent="move('x', 1)" @touchend.prevent="stopMove()" />
      </div>
      <div class="bottom">
        <van-icon name="play" style="transform: rotate(90deg)" @touchstart.prevent="move('y', 1)" @touchend.prevent="stopMove()" />
      </div>
    </div>
    <div class="map-praise" v-if="$route.query.type === 'workshop'">
      <van-icon :name="+hasPraise ? 'good-job' : 'good-job-o'" @click.stop="like()" />
      <van-icon :name="+hasCollect ? 'star' : 'star-o'" @click.stop="collect()" />
    </div>
    <!-- 保存地图弹出框 -->
    <popover ref="saveMap" v-if="$route.query.type == 'created'">
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
    <!-- 提示弹出层 -->
    <van-popup v-model="tipsShow" closeable position="bottom" :style="{ height: '50%' }">
      <div class="tips">
        <div class="tips-container" v-if="tips">
          <span
            v-for="(item, index) of tips"
            :key="index"
            :class="
              record.processRecord[index] >= 0
                ? record.processRecord[index] === item
                  ? 'right'
                  : 'wrong'
                : ''
            "
          >
            {{ item === 0 ? '↑' : item === 1 ? '→' : item === 2 ? '↓' : item === 3 ? '←' : '' }}
          </span>
        </div>
        <span v-else>
          暂时还没有人过关哦~
        </span>
      </div>
    </van-popup>
  </div>
</template>

<script>
import store from '@/store'

import { basic, expand } from '@/assets/js/level/index'
import { basicTips, expendTips } from '@/assets/js/level-tips/index'
import { request } from '@/network/request'
import { deepCloneObj, deepClone2Arr, isEmptyObject } from '@/utils/index'

import TopBar from '@/components/TopBar'
import GameContent from '@/components/game-content/GameContent.vue'
import Popover from '@/components/Popover'

export default {
  data() {
    return {
      level: 0, // 关卡级数
      levelCounter: 0, // 关卡总量
      gameMap: [], // 游戏地图
      mapName: '', // 地图名
      mapId: '', // 地图id
      staticMap: [], // 静止层地图
      activeMap: [], // 活动层地图
      step: 0, // 步数
      bestStep: 0, // 最优步数
      endCounter: 0, // 终点个数
      initLife: 0, // 初始生命
      life: 0, // 人物生命
      playerX: 0, // 人物x轴坐标
      playerY: 0, // 人物y轴坐标
      uploadMap: { // 上传地图表单
        mapName: '',
        creator: store.state.userInfo.nickname ? store.state.userInfo.nickname : store.state.userInfo.name
      },
      keepMove: null, // 持续移动定时器
      initStatus: { // 初始人物状态
        poisoning: false, // 是否中毒
        drunk: 0, // 是否醉酒
      },
      status: null, // 人物当前状态
      singlePortalExit: [], // 单向传送门出口
      tipsShow: false, // 提示弹出层
      tips: [], // 提示
      showMapName: false, // 展示完整地图名
      regretDisabled: 0, // 禁用撤回
      record: { // 操作记录
        staticMapRecord: [], // 静止层每步地图记录
        activeMapRecord: [], // 活动层每步地图记录
        lifeRecord: [], // 生命记录
        statusRecord: [], // 人物状态记录
        processRecord: [], // 过程记录
      },
      hasPraise: 0, // 是否点赞
      hasCollect: 0 // 是否收藏
    }
  },
  components: {
    TopBar,
    GameContent,
    Popover
  },
  mounted() {
    // 页面刷新，返回首页
    if (isEmptyObject(this.$route.params)) return this.$router.push('/index')
    // 判断入口
    const checkEntry = {
      // 由选关进入
      level: () => {
        this.level = this.$route.params.level
        // 判断地图包
        this.checkPack()
      },
      // 由创意工坊进入
      workshop: () => {
        // 判断是否是本地地图
        if (this.$route.params.id) this.getMapData(this.$route.params.id)
        else {
          // 获取缓存中的地图数据
          const mapData = JSON.parse(window.localStorage.getItem(`map${this.$route.params.localId}`))
          this.gameMap = mapData.mapData
          this.mapName = mapData.mapName
          this.initLife = mapData.playerHP || 0
          this.tips = mapData.processData
          this.bestStep = mapData.stepsPas
          this.regretDisabled = mapData.regretDisabled
          this.init()
        }
      },
      // 由测试地图进入
      created: () => {
        this.gameMap = this.$route.params.gameMap
        this.initLife = +this.$route.params.advancedForm.life || 0
        this.regretDisabled = +this.$route.params.advancedForm.regretDisabled
      }
    }
    checkEntry[this.$route.query.type]()

    // 游戏初始化
    if (this.$route.query.type !== 'workshop') this.init()
  },
  methods: {
    // 初始化
    init() {
      // 重置生命、终点个数，步数
      this.life = +this.initLife
      this.endCounter = 0
      this.step = 0
      this.status = deepCloneObj(this.initStatus) // 对象深拷贝
      this.record.processRecord = []
      this.singlePortalExit = []
      // 调用子组件分离地图方法
      this.$refs.game.separateMap(this.gameMap)
      // 从子组件浅拷贝数据
      this.staticMap = this.$refs.game.staticMap
      this.activeMap = this.$refs.game.activeMap

      // 获取人物坐标、终点个数、单向传送门出口
      for (let y in this.gameMap) {
        for (let x in this.gameMap[y]) {
          if (this.gameMap[y][x] === 2) {
            // 找到玩家坐标
            this.playerX = +x
            this.playerY = +y
          }
          if (this.gameMap[y][x] === 4) {
            this.endCounter++
          }
          if (this.gameMap[y][x] === 11) {
            this.singlePortalExit.push({ y, x })
          }
        }
      }

      // 大图中初始移动到玩家视角
      this.$nextTick(() => {
        if (this.gameMap.length > 12 || this.gameMap[0].length > 12) {
          this.$refs.game.$el.scrollTo({ left: this.playerX * 30 - 165, top: this.playerY * 30 - 165 })
        }
      })

      // 深拷贝初始地图
      this.record.staticMapRecord = [deepClone2Arr(this.staticMap)]
      this.record.activeMapRecord = [deepClone2Arr(this.activeMap)]
      this.record.lifeRecord = [this.initLife]
      this.record.statusRecord = [deepCloneObj(this.status)]
    },
    // 创意工坊进入获取游戏地图数据
    getMapData(id) {
      this.$toast.loading({ message: '加载中', forbidClick: true })
      request({
        url: `map/${id}`,
        method: 'GET'
      }).then(res => {
        this.$toast.clear()
        if (res.code === 0) {
          this.mapId = res.data.id
          this.gameMap = res.data.mapData
          this.mapName = res.data.mapName
          this.initLife = res.data.playerHP
          this.tips = res.data.processData
          this.bestStep = res.data.stepsPas
          this.regretDisabled = res.data.regretDisabled
          this.hasCollect = res.data.hasCollect
          this.hasPraise = res.data.hasPraise
          this.init()
        }
      })
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
       * @setY: 目标点Y轴坐标
       * @setX: 目标点X轴坐标
       * @setBoxY: 箱子移动点Y轴坐标
       * @setBoxX: 箱子移动点X轴坐标
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
      // 判断是否醉酒，根据判断奇偶来决定是否进行醉酒移动
      if (this.status.drunk % 2 !== 0) {
        this.status.drunk++ // 为接下来的move方法不触发醉酒移动
        // 随机再进行0~2次移动
        const drunkStep = Math.floor(Math.random() * 3)
        for (let i = 0; i < drunkStep; i++) {
          this.$nextTick(() => {
            if (staticTarget === 13) return // 碰到甘露则停止
            // 删除醉酒移动前的记录
            this.step--
            this.recordPop()
            if (this.status.poisoning) this.move(direction, -step)
            else this.move(direction, step)
          })
        }
        // 结束循环后，恢复醉酒移动
        this.$nextTick(() => {
          this.status.drunk++
          this.record.statusRecord.pop()
          this.record.statusRecord.push(deepCloneObj(this.status))
        })
      }

      // 判断方向
      if (direction === 'x') {
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
      if (setY < 0 || setY >= this.gameMap.length || setX < 0 || setX >= this.gameMap[0].length) return

      staticTarget = this.staticMap[setY][setX] // 获取静止层目标点的值
      activeTarget = this.activeMap[setY][setX] // 获取活动层目标点的值

      let loseLife = 0
      // 判断静止层目标点
      switch (staticTarget) {
        // 碰墙
        case 0: return
        // 空地
        case 1: break
        // 碰地刺/火
        case 5:
        case 6: {
          loseLife++
          break
        }
        // 碰毒蘑菇
        case 8: {
          this.status.poisoning = true
          this.$set(this.staticMap[setY], setX, 1) // 消除蘑菇
          break
        }
        // 碰弹簧
        case 9: {
          // 提前判断活动层目标点，若为箱子，取消弹跳
          if (direction === 'x') setX = this.playerX + step * 3
          else setY = this.playerY + step * 3
          if (this.activeMap[setY][setX] === 3 || this.activeMap[setY][setX] === 7) return
          return this.move(direction, step * 3)
        }
        // 传送门入口
        case 10: {
          // 随机指定传送出口
          const exit = this.singlePortalExit[Math.floor(Math.random() * this.singlePortalExit.length)]
          // 修改目标点
          setY = +exit.y
          setX = +exit.x
          // 非正常移动，移动步数清零
          step = 0
          break
        }
        // 啤酒
        case 12: {
          if(this.status.drunk === 0) this.status.drunk++
          this.$set(this.staticMap[setY], setX, 1) // 消除啤酒
          break
        }
        // 甘露
        case 13: {
          this.$nextTick(() => {
            this.status = deepCloneObj(this.initStatus)
          })
          this.$set(this.staticMap[setY], setX, 1) // 消除甘露
        }
      }

      // 判断活动层目标点
      switch (activeTarget) {
        // 空地
        case 1: break
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
                if (document.querySelectorAll('.end.box').length === this.endCounter) {
                  // 防作弊
                  let onEnd = 0
                  for (let y in this.activeMap) {
                    for (let x in this.activeMap[y]) {
                      if (this.activeMap[y][x] === 3 && this.staticMap[y][x] === 4) {
                        onEnd++
                      }
                    }
                  }
                  if (onEnd !== this.endCounter) return
                  setTimeout(() => {
                    this.$notify({ type: 'success', message: 'you win!' })
                    // 判断入口
                    const checkEntry = {
                      level: () => {
                        this.changeLevel(1)
                      },
                      created: () => {
                        this.$refs.saveMap.show()
                      },
                      workshop: () => {
                        if (this.step < this.bestStep) this.passProcess()
                        this.$router.push('/workshop')
                      }
                    }
                    checkEntry[this.$route.query.type]()
                  }, 200)
                }
              })
              break
            }
            // 碰火
            case 6: {
              // 如果是冰箱子，灭火
              if (activeTarget === 7) {
                this.$set(this.staticMap[setBoxY], setBoxX, 1) // 灭火
                this.$set(this.activeMap[setBoxY], setBoxX, 3) // 变为普通箱子
                isDefault = false
              }
              // 烧毁普通箱子
              else {
                this.$set(this.activeMap[setBoxY], setBoxX, 1)
                isDefault = false
              }
              break
            }
            // 弹簧/传送门
            case 9:
            case 10:
            case 11: return
          }

          // 判断活动层箱子目标点
          switch (activeBoxTarget) {
            // 碰箱子
            case 3:
            case 7: return
          }
          // 箱子可以正常移动
          if (isDefault) this.$set(this.activeMap[setBoxY], setBoxX, activeTarget)
        }
      }

      // 玩家可以正常移动
      this.$set(this.activeMap[this.playerY], this.playerX, 1)
      this.$set(this.activeMap[setY], setX, 2)
      this.step++

      // 判断是否死亡
      if (loseLife) {
        this.life -= loseLife
        if (this.life === 0) {
          this.$notify({ type: 'danger', message: 'you dead!' })
          this.$nextTick(() => { return this.init() })
        }
      }

      // 设定移动后的玩家坐标
      this.playerX = setX
      this.playerY = setY

      // 大图追踪视角
      if (this.gameMap.length > 12 || this.gameMap[0].length > 12) {
        this.$refs.game.$el.scrollTo({ left: this.playerX * 30 - 165, top: this.playerY * 30 - 165, behavior: 'smooth' })
      }

      // 记录移动数据及移动动画
      this.$nextTick(() => {
        if (direction === 'x') {
            if (step > 0) {
            this.record.processRecord.push(1)
            document.getElementsByClassName('player')[0].classList.add('move-right')
          }
          else {
            this.record.processRecord.push(3)
            document.getElementsByClassName('player')[0].classList.add('move-left')
          }
        } else {
          if (step > 0) {
            this.record.processRecord.push(2)
            document.getElementsByClassName('player')[0].classList.add('move-bottom')
          }
          else {
            this.record.processRecord.push(0)
            document.getElementsByClassName('player')[0].classList.add('move-top')
          }
        }
      })

      // 记录移动后地图数据
      this.record.staticMapRecord.push(deepClone2Arr(this.staticMap))
      this.record.activeMapRecord.push(deepClone2Arr(this.activeMap))
      this.record.lifeRecord.push(this.life)
      this.record.statusRecord.push(deepCloneObj(this.status))
    },
    // 松开按键时，停止移动
    stopMove() {
      clearTimeout(this.keepMove)
    },
    // 撤回（可以连续撤回置第一步）
    onRegret() {
      if (this.regretDisabled) return this.$notify({ type: 'danger', message: '该图作者已禁用撤回功能' })
      this.step--
      // 向子组件赋值，并重新浅拷贝
      this.$refs.game.staticMap = deepClone2Arr(this.record.staticMapRecord[this.step]) // 静止层
      this.$refs.game.activeMap = deepClone2Arr(this.record.activeMapRecord[this.step]) // 活动层
      this.staticMap = this.$refs.game.staticMap
      this.activeMap = this.$refs.game.activeMap
      // 读取记录中生命值
      this.life = this.record.lifeRecord[this.step]
      // 读取人物状态记录
      this.status = deepCloneObj(this.record.statusRecord[this.step])
      // 删除最末条记录
      this.recordPop()
      // 撤回后重新获取玩家坐标
      for (let y in this.activeMap) {
        for (let x in this.activeMap[y]) {
          if (this.activeMap[y][x] === 2) {
            this.playerX = +x
            this.playerY = +y
            break
          }
        }
      }
    },
    // 切换关卡
    changeLevel(value) {
      this.level += value
      // 判断地图包
      this.checkPack()
      this.init()
    },
    // 将地图存在本地
    saveLocal() {
      for (let i = 0; i < 99; i++) {
        if (!window.localStorage.getItem(`map${i}`)) {
          window.localStorage.setItem(`map${i}`, JSON.stringify({
            localId: i,
            creator: this.uploadMap.creator || '匿名',
            mapName: this.uploadMap.mapName || '未命名',
            mapData: this.gameMap,
            playerHP: this.initLife,
            time: new Date(),
            stepsPas: this.step,
            processData: this.record.processRecord,
            regretDisabled: this.regretDisabled
          }))
          this.$notify({ type: 'success', message: '存储成功，3秒后将返回首页' })
          break
        }
        if (i === 99) return this.$notify({ type: 'danger', message: '本地存储已达上限' })
      }
      this.$refs.saveMap.show()
      setTimeout(() => {
        this.$router.push('/index')
      }, 3000)
    },
    // 将地图上传云端
    saveServe() {
      if (!this.$store.state.userInfo.name)
        return this.$notify({ type: 'danger', message: '上传云端需要先登录，可以选择暂存本地哦~' })
      request({
        url: 'map/add',
        method: 'POST',
        data: {
          creator: this.uploadMap.creator,
          mapName: this.uploadMap.mapName,
          mapData: this.gameMap,
          playerHP: this.initLife,
          stepsPas: this.step,
          processData: this.record.processRecord,
          regretDisabled: this.regretDisabled
        }
      }).then(res => {
        if (res.code === 0) {
          this.$notify({ type: 'success', message: '上传成功，3秒后将返回首页' })
          this.$refs.saveMap.show()
          setTimeout(() => {
            this.$router.push('/index')
          }, 3000)
        }
      })
    },
    // 点赞
    like() {
      if (!this.$store.getters.checkLogin) return
      request({
        url: `like/${this.mapId}`,
        method: 'GET'
      }).then(res => {
        if (res.code === 0) {
          this.$toast.success({ message: res.msg, duration: 500 })
          // 修改列表数据，以展示不同的点赞图标
          if (+this.hasPraise) this.hasPraise = 0
          else this.hasPraise = 1
        }
      })
    },
    // 收藏
    collect() {
      if (!this.$store.getters.checkLogin) return
      request({
        url: `collect/${this.mapId}`,
        method: 'GET'
      }).then(res => {
        if (res.code === 0) {
          this.$toast.success({ message: res.msg, duration: 500 })
          // 修改列表数据，以展示不同的收藏图标
          if (+this.hasCollect) this.hasCollect = 0
          else this.hasCollect = 1
        }
      })
    },
    // 上传通关过程
    passProcess() {
      // 本地地图不上传
      if (this.$route.params.localId) return
      request({
        url: '/map/steps_pas',
        method: 'POST',
        data: {
          mapId: this.$route.params.id,
          stepsPas: this.step,
          processData: this.record.processRecord
        }
      }).then(res => {
        if (res.code === 0) {
          this.$notify({ type: 'success', message: '您达成了新的最优步数，已将您的通关过程上传至云端' })
        }
      })
    },
    // 判断地图包
    checkPack() {
      const packAction = {
        basic: () => {
          this.gameMap = deepClone2Arr(basic[this.level])
          this.levelCounter = basic.length - 1
          this.tips = basicTips[this.level]
          this.bestStep = basicTips[this.level] ? basicTips[this.level].length : '暂无'
        },
        expand: () => {
          this.gameMap = deepClone2Arr(expand[this.level].gameMap)
          this.initLife = expand[this.level].life
          this.levelCounter = expand.length - 1
          this.tips = expendTips[this.level]
          this.bestStep = expendTips[this.level] ? expendTips[this.level].length : '暂无'
        }
      }
      packAction[this.$route.query.pack]()
    },
    // 删除最末条记录
    recordPop() {
      for (let i in this.record) {
        this.record[i].pop()
      }
    }
  }
}
</script>

<style lang="scss">
@import url('../assets/css/move.css');
.game {
  height: 100%;
  background-color: var(--mainColor);
  overflow: hidden;
  position: relative;
  // 虚拟手柄
  .analog-handle {
    position: absolute;
    bottom: 60px;
    left: 77.5px;
    z-index: 100;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: space-between;
    width: 220px;
    height: 220px;
    font-size: 65px;
    color: #e8eaedcc;
    flex-grow: 1;
    div {
      width: 100%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .center {
      display: flex;
      justify-content: space-between;
      border-radius: 10px;
      overflow: hidden;
    }
    i {
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 10px;
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
    margin: 10px 0;
  }
  // 游戏信息
  .game-info {
    margin-bottom: 10px;
    .life,
    .step {
      display: flex;
      align-items: center;
      font-weight: bold;
      padding: 0 15px;
      color: #333;
      height: 25px;
      font-size: 14px;
      background-color: rgba(255, 255, 255, 0.6);
    }
    .step {
      justify-content: space-between;
      .map-name {
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .map-praise {
    display: flex;
    width: 300px;
    margin: 0 auto;
    justify-content: space-around;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    margin-top: 5px;
    i {
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      padding: 4px;
    }
  }
  // 提示弹窗
  .tips {
    padding: 50px 20px;
    font-size: 30px;
    font-weight: 900;
    .right {
      color: #07c160;
    }
    .wrong {
      color: #ee0a24;
    }
  }
}
</style>
