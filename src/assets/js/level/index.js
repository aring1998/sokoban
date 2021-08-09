// 关卡地图数据

// 基础关
export const basic = [
  [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 2, 3, 1, 1, 4, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 3, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 0, 1, 1, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 4, 1, 0, 1],
    [0, 1, 1, 3, 1, 0, 0],
    [0, 1, 1, 3, 1, 2, 0],
    [0, 0, 1, 4, 1, 0, 0],
    [1, 0, 0, 0, 0, 0, 1]
  ],
  [
    [0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 2, 3, 3, 4, 0],
    [0, 1, 3, 1, 4, 0],
    [0, 1, 1, 4, 1, 0],
    [0, 0, 0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 0, 0],
    [0, 4, 4, 2, 1, 0],
    [0, 1, 3, 0, 1, 0],
    [0, 1, 3, 1, 1, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 4, 0],
    [0, 1, 3, 3, 2, 0],
    [0, 1, 4, 1, 1, 0],
    [0, 0, 0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 4, 0],
    [0, 1, 3, 3, 1, 0],
    [0, 1, 2, 4, 1, 0],
    [0, 0, 0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 0, 0],
    [0, 1, 1, 4, 4, 0],
    [0, 4, 3, 1, 1, 0],
    [0, 1, 0, 3, 3, 0],
    [0, 4, 3, 1, 2, 0],
    [0, 0, 0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 1],
    [0, 4, 1, 0, 0],
    [0, 1, 3, 4, 0],
    [0, 1, 3, 2, 0],
    [0, 0, 1, 1, 0],
    [1, 0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 0, 1],
    [0, 1, 4, 1, 0, 0],
    [0, 1, 1, 3, 2, 0],
    [0, 1, 1, 3, 4, 0],
    [0, 0, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 0]
  ],
  [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 3, 2, 1, 4, 0],
    [0, 1, 0, 3, 1, 4, 0],
    [0, 1, 3, 1, 1, 4, 0],
    [0, 0, 0, 0, 0, 0, 0]
  ],
  [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 3, 1, 1, 1, 0, 1],
    [1, 0, 3, 1, 0, 0, 0, 1, 3, 0, 1],
    [1, 0, 1, 0, 4, 4, 4, 0, 1, 0, 1],
    [0, 0, 1, 0, 4, 4, 4, 0, 1, 0, 0],
    [0, 1, 3, 1, 1, 3, 1, 1, 3, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 1, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
];

// 拓展关
export const expand = [
  {
    life: 4,
    gameMap: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 2, 5, 5, 5, 3, 4, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]
  },
  {
    life: 1,
    gameMap: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 2, 5, 1, 3, 4, 0],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ]
  },
  {
    life: 0,
    gameMap: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 0, 1, 1, 1, 0],
      [0, 2, 9, 0, 1, 3, 4, 0],
      [0, 1, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  {
    life: 1,
    gameMap: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 0, 1, 1, 11, 0],
      [0, 2, 10, 0, 1, 3, 4, 0],
      [0, 1, 1, 0, 1, 1, 11, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
]