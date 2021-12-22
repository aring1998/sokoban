<template>
  <touch-layout
    @moveBeforeHook="moveBeforeHook"
    @moveAfterHook="moveAfterHook"
    @moveLeft="moveLeft"
    @moveRight="moveRight"
    @moveUp="moveUp"
    @moveDown="moveDown"
  >
    <game-content :staticMap="gameCore.staticMap" :activeMap="gameCore.activeMap"></game-content>
  </touch-layout>
</template>

<script>
import TouchLayout from '@/components/touch-layout.vue'
import GameContent from '@/components/game-content/game-content.vue'
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
        data: []
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
        portalExit: []
      }
    }
  },
  components: { TouchLayout, GameContent },
  onLoad(option) {
    this.gameMap.data = deepCloneObjArr(expand[8].gameMap)
    this.gameCore.staticMap = deepCloneObjArr(this.gameMap.data)
    this.gameCore.activeMap = deepCloneObjArr(this.gameMap.data)
    this.gameCore.life = expand[1].life
    this.init()
  },
  methods: {
    init() {
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
      for (let y = 0; y < this.gameMap.data.length; y++) {
        for (let x = 0; x < this.gameMap.data[y].length; x++) {
          if (mapInit[this.gameMap.data[y][x]]) mapInit[this.gameMap.data[y][x]](x, y)
        }
      }
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
      new Move(this.gameCore, 1)
    },
    moveRight() {
      this.gameCore.setX++
      this.gameCore.setBoxX = this.gameCore.setX + 1
      new Move(this.gameCore, 2)
    },
    moveUp() {
      this.gameCore.setY--
      this.gameCore.setBoxY = this.gameCore.setY - 1
      new Move(this.gameCore, 3)
    },
    moveDown() {
      this.gameCore.setY++
      this.gameCore.setBoxY = this.gameCore.setY + 1
      new Move(this.gameCore, 4)
    },
    moveAfterHook() {
      if (this.gameCore.life === 0) console.log('dead')
      
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
      }
    }
  }
}
</script>
