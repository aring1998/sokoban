export const advancedFormOptions = [
  {
    type: 'digit',
    label: '人物生命',
    prop: 'life'
  },
  {
    type: 'radio',
    label: '禁用撤回',
    prop: 'regretDisabled',
    initValue: 0,
    options: [
      {
        label: '是',
        name: 1
      },
      {
        label: '否',
        name: 0
      }
    ]
  },
  {
    type: 'radio',
    label: '黑夜模式',
    prop: 'nightMode',
    initValue: false,
    options: [
      {
        label: '是',
        name: 1
      },
      {
        label: '否',
        name: 0
      }
    ]
  }
]