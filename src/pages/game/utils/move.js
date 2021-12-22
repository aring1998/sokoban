import Vue from 'vue'

export class Move {
  gameCore = {
    staticMap: [], // 静止层地图
    activeMap: [], // 活动层地图
    playerX: 0, // 玩家x轴坐标
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
      poisoning: false
    },
    portalExit: [] // 传送门出口坐标
  }

  direction = 0

  constructor(gameCore, direction) {
    this.gameCore = gameCore
    if (
      this.gameCore.setY < 0 ||
      this.gameCore.setY >= this.gameCore.staticMap.length ||
      this.gameCore.setX < 0 ||
      this.gameCore.setX >= this.gameCore.staticMap[0].length
    )
      return
    this.getTarget()
    this.direction = direction
    // 静止层人物目标点事件
    let staticEventFlag = true
    if (staticEvent[this.gameCore.staticTarget]) {
      staticEventFlag = staticEvent[this.gameCore.staticTarget](this.gameCore, this.direction)
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
  0: () => false,
  5: gameCore => commonUtils.loseLife(gameCore),
  6: gameCore => commonUtils.loseLife(gameCore),
  8: gameCore => {
    Vue.set(gameCore.staticMap[gameCore.setY], gameCore.setX, 1)
    gameCore.status.poisoning = true
    return true
  },
  9: (gameCore, direction) => {
    setTimeout(() => {
      if (direction === 1) gameCore.setX = gameCore.playerX - 2
      else if (direction === 2) gameCore.setX = gameCore.playerX + 2
      else if (direction === 3) gameCore.setY = gameCore.playerY - 2
      else if (direction === 4) gameCore.setY = gameCore.playerY + 2
      new Move(gameCore)
    }, 0)
    return true
  },
  10: gameCore => {
    // 随机指定传送出口
    const exit = gameCore.portalExit[Math.floor(Math.random() * gameCore.portalExit.length)]
    // 修改目标点
    gameCore.setY = Number(exit.y)
    gameCore.setX = Number(exit.x)
    new Move(gameCore)
  },
  12: gameCore => {
    Vue.set(gameCore.staticMap[gameCore.setY], gameCore.setX, 1)
    gameCore.status.drunk = true
    return true
  },
  13: gameCore => {
    Vue.set(gameCore.staticMap[gameCore.setY], gameCore.setX, 1)
    for (let key in gameCore.status) {
      gameCore.status[key] = false
    }
    return true
  }
}

const activeEvent = {
  3: gameCore => commonUtils.checkBoxEvent(gameCore),
  7: gameCore => commonUtils.checkBoxEvent(gameCore)
}

const staticBoxEvent = {
  0: () => false,
  4: gameCore => {
    let onEnd = 0
    setTimeout(() => {
      for (let y in gameCore.activeMap) {
        for (let x in gameCore.activeMap[y]) {
          if (gameCore.activeMap[y][x] === 3 && gameCore.staticMap[y][x] === 4) {
            onEnd++
          }
        }
      }
      if (onEnd !== gameCore.endCounter) return
      alert('win')
    }, 200)
    return true
  },
  6: gameCore => {
    if (gameCore.activeTarget === 7) {
      gameCore.activeTarget = 3 // 变为普通箱子
      Vue.set(gameCore.staticMap[gameCore.setBoxY], gameCore.setBoxX, 1) // 灭火
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
    if (activeBoxEvent[gameCore.staticBoxTarget]) {
      flag = activeBoxEvent[gameCore.staticBoxTarget](gameCore)
    }
    if (flag) Vue.set(gameCore.activeMap[gameCore.setBoxY], gameCore.setBoxX, gameCore.activeTarget)
    return flag
  }
}
