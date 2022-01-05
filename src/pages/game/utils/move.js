import Vue from 'vue'
import { deepCloneObjArr } from '@/utils/index'

export class Move {
  gameCore = {
    staticMap: [], // 静止层地图
    activeMap: [], // 活动层地图
    playerY: 0, // 玩家y轴坐标
    setX: 0, //目标点x轴坐标
    setY: 0, // 目标点y轴坐标
    setBoxX: 0, // 箱子移动点x轴坐标
    setBoxY: 0, // 箱子移动点y轴坐标
    staticTarget: 0, // 静止层目标点
    activeTarget: 0, // 活动层目标点
    staticBoxTarget: 0, // 静止层箱子目标点
    activeBoxTarget: 0, // 活动层箱子目标点
    life: 0, // 生命值
    endCounter: 0, // 终点个数
    // 状态
    status: {
      poisoning: false,
      drunk: false
    },
    portalExit: [], // 传送门出口坐标
    regretDisabled: false, // 禁用撤回功能
    step: 0, // 步数
    suc: 0
  }
  direction = 0
  gameRecord = []

  constructor(gameCore, direction, gameRecord) {
    this.gameCore = gameCore
    // 超出表格
    if (
      this.gameCore.setY < 0 ||
      this.gameCore.setY >= this.gameCore.staticMap.length ||
      this.gameCore.setX < 0 ||
      this.gameCore.setX >= this.gameCore.staticMap[0].length
    )
      return
    this.getTarget()
    this.direction = direction
    this.gameRecord = gameRecord
    // 静止层人物目标点事件
    let staticEventFlag = true
    if (staticEvent[this.gameCore.staticTarget]) {
      staticEventFlag = staticEvent[this.gameCore.staticTarget](this.gameCore, this.direction, this.gameRecord)
    }
    if (!staticEventFlag) return
    // 活动层人物目标点事件
    let activeEventFlag = true
    if (activeEvent[this.gameCore.activeTarget]) {
      activeEventFlag = activeEvent[this.gameCore.activeTarget](this.gameCore)
    }
    if (!activeEventFlag) return
    this.commonMove()
    return true
  }

  // 常规移动
  commonMove() {
    Vue.set(this.gameCore.activeMap[this.gameCore.setY], this.gameCore.setX, 2)
    Vue.set(this.gameCore.activeMap[this.gameCore.playerY], this.gameCore.playerX, 1)
    this.gameCore.playerX = this.gameCore.setX
    this.gameCore.playerY = this.gameCore.setY
    this.gameCore.step++
    // 记录游戏记录
    this.gameRecord.push(deepCloneObjArr(this.gameCore))
  }

  static moveIndex(gameCore) {
    gameCore.setX = gameCore.playerX
    gameCore.setY = gameCore.playerY
    gameCore.setBoxX = gameCore.setX
    gameCore.setBoxY = gameCore.setY
  }
  getTarget() {
    this.gameCore.staticTarget = this.gameCore.staticMap[this.gameCore.setY][this.gameCore.setX] // 获取静止层目标点的值
    this.gameCore.activeTarget = this.gameCore.activeMap[this.gameCore.setY][this.gameCore.setX] // 获取活动层目标点的值
    if (this.gameCore.setBoxY < 0 || this.gameCore.setBoxY >= this.gameCore.staticMap.length) return
    this.gameCore.staticBoxTarget = this.gameCore.staticMap[this.gameCore.setBoxY][this.gameCore.setBoxX] // 获取静止层箱子目标点
    this.gameCore.activeBoxTarget = this.gameCore.activeMap[this.gameCore.setBoxY][this.gameCore.setBoxX] // 获取活动层箱子目标点
  }
}

const staticEvent = {
  // 墙
  0: () => false,
  // 地刺
  5: gameCore => commonUtils.loseLife(gameCore),
  // 火
  6: gameCore => commonUtils.loseLife(gameCore),
  // 毒蘑菇
  8: gameCore => {
    commonUtils.clearSelf(gameCore)
    gameCore.status.poisoning = true
    return true
  },
  // 弹簧
  9: (gameCore, direction, gameRecord) => {
    setTimeout(() => {
      if (direction === 0) gameCore.setY = gameCore.playerY - 2
      else if (direction === 1) gameCore.setX = gameCore.playerX + 2
      else if (direction === 2) gameCore.setY = gameCore.playerY + 2
      else if (direction === 3) gameCore.setX = gameCore.playerX - 2
      new Move(gameCore, direction, gameRecord)
    }, 0)
    return true
  },
  // 传送门入口
  10: (gameCore, direction, gameRecord) => {
    // 随机指定传送出口
    const exit = gameCore.portalExit[Math.floor(Math.random() * gameCore.portalExit.length)]
    // 修改目标点
    gameCore.setY = Number(exit.y)
    gameCore.setX = Number(exit.x)
    new Move(gameCore, direction, gameRecord)
  },
  // 啤酒
  12: gameCore => {
    commonUtils.clearSelf(gameCore)
    gameCore.status.drunk = true
    return true
  },
  // 解药
  13: gameCore => {
    commonUtils.clearSelf(gameCore)
    for (let key in gameCore.status) {
      gameCore.status[key] = false
    }
    return true
  }
}

const activeEvent = {
  // 普通箱子
  3: gameCore => commonUtils.checkBoxEvent(gameCore),
  // 冰箱子
  7: gameCore => commonUtils.checkBoxEvent(gameCore)
}

const staticBoxEvent = {
  // 墙
  0: () => false,
  // 终点
  4:  gameCore => {
    let onEnd = 0
    Vue.nextTick(() => {
      for (let y in gameCore.activeMap) {
        for (let x in gameCore.activeMap[y]) {
          if (gameCore.activeMap[y][x] === 3 && gameCore.staticMap[y][x] === 4) {
            onEnd++
          }
        }
      }
      if (onEnd !== gameCore.endCounter) return
      gameCore.suc = 1
    })
    return true
  },
  // 火
  6: gameCore => {
    if (gameCore.activeTarget === 7) {
      gameCore.activeTarget = 3 // 变为普通箱子
      Vue.set(gameCore.staticMap[gameCore.setBoxY], gameCore.setBoxX, 1) // 灭火
    } else {
      gameCore.activeTarget = 1 // 销毁普通箱子
    }
    return true
  }
}

const activeBoxEvent = {
  3: () => false,
  7: () => false
}

const commonUtils = {
  loseLife: gameCore => {
    gameCore.life--
    return true
  },
  checkBoxEvent: gameCore => {
    let flag = true
    if (staticBoxEvent[gameCore.staticBoxTarget]) {
      flag = staticBoxEvent[gameCore.staticBoxTarget](gameCore)
    }
    if (activeBoxEvent[gameCore.activeBoxTarget]) {
      flag = activeBoxEvent[gameCore.activeBoxTarget](gameCore)
    }
    if (flag) Vue.set(gameCore.activeMap[gameCore.setBoxY], gameCore.setBoxX, gameCore.activeTarget)
    return flag
  },
  clearSelf: gameCore => {
    Vue.set(gameCore.staticMap[gameCore.setY], gameCore.setX, 1)
  }
}
