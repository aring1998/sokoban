// 地图元素
export const mapEl= [
  {
    name: '墙',
    value: 0,
    class: 'wall',
    intro: [
      '顾名思义，此路不通'
    ]
  },
  {
    name: '空地',
    value: 1,
    class: 'floor',
    intro: [
      '您脚下的大地母亲'
    ]
  },
  {
    name: '人物',
    value: 2,
    class: 'player',
    intro: [
      '您',
      '可通过虚拟手柄操纵移动'
    ]
  },
  {
    name: '箱子',
    value: 3,
    class: 'box',
    intro: [
      '碰撞后会朝移动对应碰撞方向移动',
      '全部推入终点即可获得胜利'
    ]
  },
  {
    name: '终点',
    value: 4,
    class: 'end',
    intro: [
      '所有箱子的目标点',
      '填满后可获得胜利'
    ]
  },
  {
    name: '地刺',
    value: 5,
    class: 'spikeweed',
    intro: [
      '人物经过时，扣1点生命'
    ]
  },
  {
    name: '火',
    value: 6,
    class: 'fire',
    intro: [
      '人物经过时，扣1点生命',
      '当普通箱子触碰时，会损毁'
    ]
  },
  {
    name: '冰箱子',
    value: 7,
    class: 'ice-box',
    intro: [
      '抵达终点不记入抵达终点箱子数',
      '触碰火焰时，会变为普通箱子，并灭火'
    ]
  },
  {
    name: '毒蘑菇',
    value: 8,
    class: 'toadstool',
    intro: [
      '触碰时消失',
      '触碰后，整局按键皆为反向'
    ]
  },
  {
    name: '弹簧',
    value: 9,
    class: 'spring',
    intro: [
      '触碰时无视面前第一格障碍物移动到目标方向两格位置',
      '若目标点为障碍物，则不触发'
    ]
  },
  {
    name: '单向传送门入口',
    value: 10,
    class: 'single-portal-entry',
    intro: [
      '与单向传送门出口联调',
      '触碰后随机前往传送门出口位置'
    ]
  },
  {
    name: '单向传送门出口',
    value: 11,
    class: 'single-portal-exit',
    intro: [
      '与单向传送门入口联调',
      '触碰时不会传送'
    ]
  }
]

export const mapElClass = (value) => {
  for (let i of mapEl) {
    if (i.value === value) return i.class
  }
}