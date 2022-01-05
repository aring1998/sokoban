<template>
  <view class="create-page">
    <u-notify ref="notify"></u-notify>
    <top-bar title="创建地图" :showRight="false"></top-bar>
    <create-content :gameMap="gameMap" @getRowIndex="getRowIndex" @getColumnIndex="getColumnIndex"></create-content>
    <view class="action">
      <map-el @chioceMapEl="chioceMapEl"></map-el>
      <view class="action-btn">
        <view class="action-btn-item">
          <u-button type="primary" plain text="测试地图" @click="testMap"></u-button>
        </view>
        <view class="action-btn-item">
          <u-button type="warning" plain text="高级选项" @click="delRow" :disabled="gameMap.length === 1"></u-button>
        </view>
      </view>
      <view class="action-btn">
        <view class="action-btn-item">
          <u-button type="success" plain text="添加一行" @click="addRow" :disabled="gameMap.length === 30"></u-button>
        </view>
        <view class="action-btn-item">
          <u-button type="error" plain text="删除一行" @click="delRow" :disabled="gameMap.length === 1"></u-button>
        </view>
        <view class="action-btn-item">
          <u-button type="success" plain text="添加一列" @click="addColumn" :disabled="gameMap[0].length === 30"></u-button>
        </view>
        <view class="action-btn-item">
          <u-button type="error" plain text="删除一列" @click="delColumn" :disabled="gameMap[0].length === 1"></u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import TopBar from '@/components/top-bar.vue'
import CreateContent from '@/components/game-content/create-content.vue'
import MapEl from './components/map-el/map-el.vue'
import { checkMap } from './utils/check-map'

export default {
  data() {
    return {
      gameMap: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 2, 3, 4, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ],
      clickCellType: 0, // 点击布置元素类型
      choiceRow: 0, // 选中行
      choiceColumn: 0, // 选中列
      advancedForm: {}
    }
  },
  components: { TopBar, CreateContent, MapEl },
  async onLoad(option) {
    if (option.type === 'back') {
      const [ _, res ] = await uni.getStorage({
        key: 'mapData'
      })
      this.gameMap = JSON.parse(res.data)
    }
  },
  methods: {
    getColumnIndex(index) {
      this.choiceColumn = index
    },
    getRowIndex(index) {
      this.choiceRow = index
      this.$set(this.gameMap[this.choiceRow], this.choiceColumn, this.clickCellType)
    },
    chioceMapEl(val) {
      this.clickCellType = val
    },
    addRow() {
      this.gameMap.push([])
      for (let i = 0; i < this.gameMap[0].length; i++) {
        this.gameMap[this.gameMap.length - 1].push(1)
      }
    },
    addColumn() {
      for (let i = 0; i < this.gameMap.length; i++) {
        this.gameMap[i].push(1)
      }
    },
    delRow() {
      this.gameMap.pop()
    },
    delColumn() {
      for (let i = 0; i < this.gameMap.length; i++) {
        this.gameMap[i].pop()
      }
    },
    testMap() {
      const tip = checkMap(this.gameMap, this.advancedForm)
      if (tip) return this.$refs.notify.show({ type: 'error', message: tip })
      uni.setStorage({
        key: 'mapData',
        data: JSON.stringify(this.gameMap)
      })
      uni.navigateTo({
        url: '/pages/game/index?type=create'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.create-page {
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  background-image: url('~@/static/img/common/bg.png');
  justify-content: space-between;
  .action {
    background-color: rgba($color: #fff, $alpha: 0.8);
    padding: 30rpx 0;
    .action-btn {
      display: flex;
      justify-content: space-between;
      margin: 20rpx 0;
      padding: 0 30rpx;
      .action-btn-item {
        width: 150rpx;
        font-weight: bold;
      }
    }
  }
}
</style>
