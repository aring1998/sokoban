export const checkMap = (gameMap, form) => {
  let player = 0, box = 0,end = 0, portalEntry = 0, portalExit = 0
  const attackEvent = () => {
    if (form.life < 1) {
      return '有攻击性元素时，人物生命值不得为零！'
    }
  }
  const event = {
    2: () => {
      player++
      if (player > 1) return '人物不能超过一个'
    },
    3: () => { box++ },
    7: () => { box++ },
    4: () => { end++ },
    5: () => attackEvent(),
    6: () => attackEvent(),
    10: () => { portalEntry++ },
    11: () => { portalExit++ }
  }
  
  for (let y in gameMap) {
    for (let x in gameMap[y]) {
      if (event[gameMap[y][x]]) {
        const flag = event[gameMap[y][x]]()
        if (flag) return flag
      }
    }
  }
  if (!player) return '不能没有人物！'
  if (end < box) return '终点数量不应小于箱子数量！'
  if ((portalEntry > 0 && portalExit === 0) || (portalEntry === 0 && portalExit > 0)) {
    return '传送门入口和传送门出口必须同时存在！'
  }
}