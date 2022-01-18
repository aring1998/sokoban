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
          <u-button type="warning" plain text="高级选项" @click="$refs.advanced.show()"></u-button>
        </view>
      </view>
      <view class="action-btn">
        <view class="action-btn-item">
          <u-button type="success" plain text="添加一行" @click="addRow" :disabled="gameMap.length === 30"></u-button>
        </view>
        <view class="action-btn-item">
          <u-button type="error" plain text="删除一行" @click="delRow" :disabled="gameMap.length === 5"></u-button>
        </view>
        <view class="action-btn-item">
          <u-button type="success" plain text="添加一列" @click="addColumn" :disabled="gameMap[0].length === 30"></u-button>
        </view>
        <view class="action-btn-item">
          <u-button type="error" plain text="删除一列" @click="delColumn" :disabled="gameMap[0].length === 5"></u-button>
        </view>
      </view>
    </view>
    <ar-popup ref="advanced">
      <ar-form :formOptions="advancedFormOptions" @formCreate="advancedFormCreate" okText="确定" @ok="$refs.advanced.show()"></ar-form>
    </ar-popup>
    <ar-popup ref="tips" style="padding: 0 70rpx; text-align: center">
      <h4>提示</h4>
      <span>使用该功能建议您先登录，是否前往登录？</span>
      <view class="action-btn">
        <view class="action-btn-item">
          <u-button type="error" plain shape="circle" text="不再提示" @click="doNotTip"></u-button>
        </view>
        <view class="action-btn-item">
          <u-button type="success" plain shape="circle" text="前往登录" @click="goUser"></u-button>
        </view>
      </view>
    </ar-popup>
  </view>
</template>

<script>
import TopBar from '@/components/top-bar.vue'
import CreateContent from '@/components/game-content/create-content.vue'
import ArPopup from '@/components/ar-popup.vue'
import ArForm from '@/components/ar-form.vue'
import MapEl from './components/map-el/map-el.vue'
import { checkMap } from './utils/check-map'
import { advancedFormOptions } from './config/data'

export default {
  data() {
    return {
      advancedFormOptions: Object.freeze(advancedFormOptions),
      gameMap: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ],
      clickCellType: 0, // 点击布置元素类型
      choiceRow: 0, // 选中行
      choiceColumn: 0, // 选中列
      advancedForm: {}
    }
  },
  components: { TopBar, CreateContent, MapEl, ArPopup, ArForm },
  async onLoad(option) {
    if (option.type === 'back') {
      const data = JSON.parse(uni.getStorageSync('createMap'))
      this.gameMap = data.mapData
      this.advancedForm.life = data.life
      this.advancedForm.regretDisabled = data.regretDisabled
    }
  },
  onReady() {
    if (!this.$store.state.userInfo.id && uni.getStorageSync('loginTips') !== '1') {
      this.$refs.tips.show()
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
        key: 'createMap',
        data: JSON.stringify({
          mapData: this.gameMap,
          life: this.advancedForm.life,
          regretDisabled: this.advancedForm.regretDisabled
        })
      })
      uni.navigateTo({
        url: '/pages/game/index?type=create'
      })
    },
    advancedFormCreate(form) {
      this.advancedForm = form
    },
    doNotTip() {
      uni.setStorageSync('loginTips', '1')
      this.$refs.tips.show()
    },
    goUser() {
      uni.navigateTo({
        url: '/pages/user/index'
      })
      this.$refs.tips.show()
    }
  }
}
</script>

<style lang="scss" scoped>
.create-page {
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  background-image: url('http://81.68.189.158:8080/download/sokoban-static/img/common/bg.png');
  justify-content: space-between;
  .action {
    background-color: rgba($color: #fff, $alpha: 0.8);
    padding: 30rpx 0;
  }
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
</style>
