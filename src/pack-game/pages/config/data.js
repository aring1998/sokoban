import store from '@/store/index'
export const formOptions = [
  {
    label: '地图名',
    prop: 'mapName'
  },
  {
    label: '作者',
    prop: 'creator',
    initValue: store.state.userInfo.username
  }
]
