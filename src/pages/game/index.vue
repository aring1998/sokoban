<template>
  <touch-layout
    @moveBeforeHook="moveBeforeHook"
    @moveAfterHook="moveAfterHook"
    @moveLeft="moveLeft"
    @moveRight="moveRight"
    @moveUp="moveUp"
    @moveDown="moveDown"
    class="game-page"
  >
    <u-notify ref="notify"></u-notify>
    <game-top-bar
      :step="gameCore.step"
      :life="gameCore.life"
      :mapName="gameMap.mapName"
      @reset="reset"
      @regret="regret"
      @showMenu="$refs.tips.show()"
    ></game-top-bar>
    <game-content :staticMap="gameCore.staticMap" :activeMap="gameCore.activeMap" class="game-content"></game-content>

    <ar-popup type="menu" ref="settings">
      <game-menu></game-menu>
    </ar-popup>

    <ar-popup type="common" ref="tips" :isClosed="false">
      <game-result @reset="reset(); $refs.tips.show()" @nextLevel="nextLevel(); $refs.tips.show()"></game-result>
    </ar-popup>
  </touch-layout>
</template>

<script>
import TouchLayout from '@/components/touch-layout.vue'
import GameContent from '@/components/game-content/game-content.vue'
import ArPopup from '@/components/ar-popup.vue'
import GameTopBar from './components/game-top-bar/game-top-bar.vue'
import GameMenu from './components/game-menu/game-menu.vue'
import GameResult from './components/game-result/game-result.vue'

import { basic, expand } from '@/static/js/level/index'
import { deepCloneObjArr } from '@/utils/index'
import { Move } from './utils/move'
export default {
  data() {
    return {
      basic: Object.freeze(basic),
      expand: Object.freeze(expand),
      // 游戏地图
      gameMap: {
        mapData: [],
        mapName: '',
        level: 0
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
        suc: 0
      },
      gameRecord: [], // 游戏记录
      routeInfo: {}
    }
  },
  components: { TouchLayout, GameContent, ArPopup, GameTopBar, GameMenu, GameResult },
  onLoad(option) {
    this.routeInfo = option
    this.init()
  },
  methods: {
    init() {
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
          this.gameCore.life = expand[this.routeInfo.level].life
        }
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
    moveBeforeHook(touches) {
      this.gameCore.setX = this.gameCore.playerX
      this.gameCore.setY = this.gameCore.playerY
      this.gameCore.setBoxX = this.gameCore.setX
      this.gameCore.setBoxY = this.gameCore.setY
      this.statusEvent(touches)
    },
    moveLeft() {
      this.gameCore.setX--
      this.gameCore.setBoxX = this.gameCore.setX - 1
      new Move(this.gameCore, 1, this.gameRecord)
    },
    moveRight() {
      this.gameCore.setX++
      this.gameCore.setBoxX = this.gameCore.setX + 1
      new Move(this.gameCore, 2, this.gameRecord)
    },
    moveUp() {
      this.gameCore.setY--
      this.gameCore.setBoxY = this.gameCore.setY - 1
      new Move(this.gameCore, 3, this.gameRecord)
    },
    moveDown() {
      this.gameCore.setY++
      this.gameCore.setBoxY = this.gameCore.setY + 1
      new Move(this.gameCore, 4, this.gameRecord)
    },
    moveAfterHook() {
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
          }, 150);
        }
      }, 50)
    },
    statusEvent(touches) {
      // 中毒事件
      if (this.gameCore.status.poisoning) {
        if (touches.flag === 1) touches.flag = 2
        else if (touches.flag === 2) touches.flag = 1
        else if (touches.flag === 3) touches.flag = 4
        else if (touches.flag === 4) touches.flag = 3
      }
      // 酗酒事件
      if (this.gameCore.status.drunk) {
        // 随机再进行0~2次移动
        const drunkStep = Math.floor(Math.random() * 3)
        let moveFunc = null
        if (touches.flag === 1) moveFunc = this.moveLeft
        else if (touches.flag === 2) moveFunc = this.moveRight
        else if (touches.flag === 3) moveFunc = this.moveUp
        else if (touches.flag === 4) moveFunc = this.moveDown
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
    },
    regret() {
      if (this.gameRecord.length === 1) return this.$refs.notify.show({ type: 'error', message: '已经回退到头啦~' })
      this.gameRecord.pop()
      this.gameCore = deepCloneObjArr(this.gameRecord[this.gameRecord.length - 1])
    },
    nextLevel() {
      this.routeInfo.level++
      this.init()
    }
  }
}
</script>

<style lang="scss">
.game-page {
  height: 100vh;
  padding: 60rpx 0;
  background-image: url('~@/static/img/game/bg.png');
  display: flex;
  flex-flow: column nowrap;
  .game-content {
    margin-top: 20vh;
  }
  .game-action {
    padding: 0 40rpx;
    display: flex;
  }
}
</style>
