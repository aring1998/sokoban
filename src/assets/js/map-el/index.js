// 地图元素
export const mapEl= [
  {
    name: '墙',
    value: 0,
    class: 'wall'
  },
  {
    name: '空地',
    value: 1,
    class: 'floor'
  },
  {
    name: '玩家',
    value: 2,
    class: 'player'
  },
  {
    name: '箱子',
    value: 3,
    class: 'box'
  },
  {
    name: '终点',
    value: 4,
    class: 'end'
  },
  {
    name: '地刺',
    value: 5,
    class: 'spikeweed'
  },
  {
    name: '火',
    value: 6,
    class: 'fire'
  },
  {
    name: '冰箱子',
    value: 7,
    class: 'ice-box'
  },
  {
    name: '毒蘑菇',
    value: 8,
    class: 'toadstool'
  }
]

export const mapElClass = (value) => {
  for (let i of mapEl) {
    if (i.value === value) return i.class
  }
}