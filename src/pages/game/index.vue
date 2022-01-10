<template>
  <view class="game-page">
    <u-notify ref="notify"></u-notify>
    <game-top-bar
      :step="gameCore.step"
      :life="gameCore.life"
      :mapName="gameMap.mapName"
      :showEdit="routeInfo.type === 'create' ? true : false"
      @reset="reset"
      @regret="regret"
      @showMenu="$refs.settings.show()"
    ></game-top-bar>
    <game-content :staticMap="gameCore.staticMap" :activeMap="gameCore.activeMap" ref="game"></game-content>

    <analog-handle
      @moveBeforeHook="moveBeforeHook"
      @moveAfterHook="moveAfterHook"
      @moveLeft="moveLeft"
      @moveRight="moveRight"
      @moveUp="moveUp"
      @moveDown="moveDown"
    ></analog-handle>

    <ar-popup type="menu" ref="settings">
      <game-menu></game-menu>
    </ar-popup>

    <ar-popup type="common" ref="tips" :isClosed="false">
      <game-result
        @reset="reset"
        @nextLevel="nextLevel"
        @saveServe="
          saveType = 1
          $refs.save.show()
        "
        @saveLocal="
          saveType = 2
          $refs.save.show()
        "
        :type="routeInfo.type"
      ></game-result>
    </ar-popup>

    <ar-popup ref="save">
      <ar-form :formOptions="formOptions" okText="保存" @ok="saveType === 1 ? saveServe() : saveLocal()" @formCreate="formCreate"></ar-form>
    </ar-popup>
  </view>
</template>

<script>
import GameContent from '@/components/game-content/game-content.vue'
import ArPopup from '@/components/ar-popup.vue'
import ArForm from '@/components/ar-form.vue'
import GameTopBar from './components/game-top-bar/game-top-bar.vue'
import GameMenu from './components/game-menu/game-menu.vue'
import GameResult from './components/game-result/game-result.vue'
import AnalogHandle from './components/analog-handle/analog-handle.vue'

import { basic, expand } from '@/static/js/level/index'
import { deepCloneObjArr } from '@/utils/index'
import { Move } from './utils/move'
import { formOptions } from './config/data'
export default {
  data() {
    return {
      basic: Object.freeze(basic),
      expand: Object.freeze(expand),
      formOptions: Object.freeze(formOptions),
      // 游戏地图
      gameMap: {
        mapData: [],
        mapName: '',
        level: 0,
        regretDisabled: 0
      },
      // 游戏核心
      gameCore: {
        staticMap: [],
        activeMap: [],
        playerX: 0,
        playerY: 0,
        setX: 0,
        setY: 0,
        setBoxX: 0,
        setBoxY: 0,
        staticTarget: 0,
        activeTarget: 0,
        staticBoxTarget: 0,
        activeBoxTarget: 0,
        life: 0,
        endCounter: 0,
        status: {
          poisoning: false,
          drunk: false
        },
        portalExit: [],
        regretDisabled: false,
        step: 0,
        suc: 0,
        processData: []
      },
      gameRecord: [], // 游戏记录
      routeInfo: {},
      saveType: 0 // 保存方案 1-云端，2-本地
    }
  },
  components: { GameContent, ArPopup, ArForm, GameTopBar, GameMenu, GameResult, AnalogHandle },
  onLoad(option) {
    this.routeInfo = option
  },
  onReady() {
    this.init()
  },
  methods: {
    async init() {
      // 重置初始gameCore
      this.gameCore = deepCloneObjArr(this.$options.data().gameCore)
      if (this.routeInfo.type === 'level') {
        if (this.routeInfo.pack === '0') {
          this.gameMap.mapData = deepCloneObjArr(basic[this.routeInfo.level])
          this.gameMap.mapName = `基础关--${Number(this.routeInfo.level) + 1}`
          this.gameCore.life = '**'
        } else {
          this.gameMap.mapData = deepCloneObjArr(expand[this.routeInfo.level].gameMap)
          this.gameMap.mapName = `拓展关--${Number(this.routeInfo.level) + 1}`
          this.gameCore.life = expand[this.routeInfo.level].life || '**'
        }
      } else if (this.routeInfo.type === 'workshop') {
        if (Number(this.routeInfo.id)) {
          const res = await this.$api.get(`map/${this.routeInfo.id}`)
          if (res.code === 0) {
            this.gameMap = res.data
            this.gameCore.life = res.data.playerHP || '**'
          }
        } else {
          const data = JSON.parse(uni.getStorageSync(`map${this.routeInfo.localId}`))
          this.gameMap.mapData = data.mapData
          this.gameCore.life = data.life || '**'
          this.gameMap.regretDisabled = data.regretDisabled
        }
      } else if (this.routeInfo.type === 'create') {
        const data = JSON.parse(uni.getStorageSync('createMap'))
        this.gameMap.mapData = data.mapData
        this.gameMap.mapName = '测试地图'
        this.gameCore.life = data.life || '**'
        this.gameMap.regretDisabled = data.regretDisabled
      }
      const mapInit = {
        // 玩家坐标
        2: (x, y) => {
          this.gameCore.playerX = Number(x)
          this.gameCore.playerY = Number(y)
        },
        // 终点总数
        4: () => {
          this.gameCore.endCounter++
        },
        // 传送门出口
        11: (x, y) => {
          this.gameCore.portalExit.push({ x, y })
        }
      }
      for (let y = 0; y < this.gameMap.mapData.length; y++) {
        for (let x = 0; x < this.gameMap.mapData[y].length; x++) {
          if (mapInit[this.gameMap.mapData[y][x]]) mapInit[this.gameMap.mapData[y][x]](x, y)
        }
      }
      // 地图分层
      this.gameCore.staticMap = deepCloneObjArr(this.gameMap.mapData)
      this.gameCore.activeMap = deepCloneObjArr(this.gameMap.mapData)

      // 记录游戏记录
      this.gameRecord = []
      this.gameRecord.push(deepCloneObjArr(this.gameCore))
    },
    moveBeforeHook(clickEvent) {
      this.gameCore.setX = this.gameCore.playerX
      this.gameCore.setY = this.gameCore.playerY
      this.gameCore.setBoxX = this.gameCore.setX
      this.gameCore.setBoxY = this.gameCore.setY
      this.statusEvent(clickEvent)
    },
    moveLeft() {
      this.gameCore.setX--
      this.gameCore.setBoxX = this.gameCore.setX - 1
      new Move(this.gameCore, 3, this.gameRecord)
    },
    moveRight() {
      this.gameCore.setX++
      this.gameCore.setBoxX = this.gameCore.setX + 1
      new Move(this.gameCore, 1, this.gameRecord)
    },
    moveUp() {
      this.gameCore.setY--
      this.gameCore.setBoxY = this.gameCore.setY - 1
      new Move(this.gameCore, 0, this.gameRecord)
    },
    moveDown() {
      this.gameCore.setY++
      this.gameCore.setBoxY = this.gameCore.setY + 1
      new Move(this.gameCore, 2, this.gameRecord)
    },
    moveAfterHook() {
      if (this.gameCore.suc === 1) return
      if (this.gameCore.life === 0) {
        setTimeout(() => {
          this.$refs.notify.show({ type: 'error', message: '你失败了~' })
          this.reset()
        }, 200)
      }
      setTimeout(() => {
        if (this.gameCore.suc === 1) {
          setTimeout(() => {
            this.$refs.tips.show()
          }, 150)
        }
      }, 50)
    },
    statusEvent(clickEvent) {
      // 中毒事件
      if (this.gameCore.status.poisoning) {
        if (clickEvent.direction === 0) clickEvent.direction = 2
        else if (clickEvent.direction === 1) clickEvent.direction = 3
        else if (clickEvent.direction === 2) clickEvent.direction = 0
        else if (clickEvent.direction === 3) clickEvent.direction = 1
      }
      // 酗酒事件
      if (this.gameCore.status.drunk) {
        // 随机再进行0~2次移动
        const drunkStep = Math.floor(Math.random() * 3)
        let moveFunc = null
        if (clickEvent.direction === 0) moveFunc = this.moveUp
        else if (clickEvent.direction === 1) moveFunc = this.moveRight
        else if (clickEvent.direction === 2) moveFunc = this.moveDown
        else if (clickEvent.direction === 3) moveFunc = this.moveLeft
        for (let i = 0; i < drunkStep; i++) {
          this.$nextTick(() => {
            if (this.gameCore.staticTarget === 13) return // 碰到甘露则停止
            Move.moveIndex(this.gameCore)
            moveFunc()
            this.moveAfterHook()
          })
        }
        // 清理酗酒移动途中的记录
        setTimeout(() => {
          this.gameRecord.splice(this.gameRecord.length - drunkStep - 1, drunkStep)
        }, 50)
      }
    },
    reset() {
      this.gameCore = deepCloneObjArr(this.gameRecord[0])
      this.$refs.tips.isShow = false
    },
    regret() {
      if (this.gameMap.regretDisabled === 1) return this.$refs.notify.show({ type: 'error', message: '该图作者已禁用撤回' })
      if (this.gameRecord.length === 1) return this.$refs.notify.show({ type: 'error', message: '已经回退到头啦~' })
      this.gameRecord.pop()
      this.gameCore = deepCloneObjArr(this.gameRecord[this.gameRecord.length - 1])
    },
    nextLevel() {
      this.routeInfo.level++
      this.init()
      this.$refs.tips.isShow = false
    },
    async saveServe() {
      const res = await this.$api.post('map/add', {
        ...this.gameMap,
        ...this.form,
        playerHP: this.$options.data().gameCore.life,
        stepsPas: this.gameCore.step,
        processData: this.gameCore.processData
      })
      if (res.code === 0) {
        this.$refs.notify.show({ type: 'success', message: '上传成功，3秒后将返回首页' })
        this.$refs.save.show()
        this.$refs.tips.show()
        setTimeout(() => {
          uni.redirectTo({ url: '/pages/index/index' })
        }, 3000)
      }
    },
    async saveLocal() {
      for (let i = 0; i < 99; i++) {
        if (i === 99) return this.$refs.notify.show({ type: 'error', message: '本地存储已达上限' })
        const res = uni.getStorageSync(`map${i}`)
        if (res) continue
        uni.setStorage({
          key: `map${i}`,
          data: JSON.stringify({
            localId: i,
            creator: this.form.creator || '匿名',
            mapName: this.form.mapName || '未命名',
            mapData: this.gameMap.mapData,
            playerHP: this.gameCore.life,
            time: new Date(),
            stepsPas: this.gameRecord.step,
            processData: this.gameCore.processData,
            regretDisabled: this.gameMap.regretDisabled
          })
        })
        this.$refs.notify.show({ type: 'success', message: '保存成功，3秒后将返回首页' })
        this.$refs.save.show()
        this.$refs.tips.show()
        setTimeout(() => {
          uni.redirectTo({ url: '/pages/index/index' })
        }, 3000)
        break
      }
    },
    formCreate(form) {
      this.form = form
    }
  }
}
</script>

<style lang="scss">
.game-page {
  height: 100vh;
  padding: 60rpx 0;
  background-image: url('~@/static/img/common/bg.png');
  display: flex;
  flex-flow: column nowrap;
  .game-container {
    margin-top: 80rpx;
  }
  .game-action {
    padding: 0 40rpx;
    display: flex;
  }
}
</style>
