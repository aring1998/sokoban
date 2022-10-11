<template>
  <view class="workshop-page">
    <top-bar title="创意工坊" @search="$refs.search.show()"></top-bar>
    <ar-popup type="common" ref="search">
      <ar-form :formOptions="formOptions" @formCreate="formCreate" @ok="search() && $refs.search.show()"></ar-form>
    </ar-popup>
    <view class="tabs">
      <ar-tabs :list="tabList" :current="currentTab" @click="item => (currentTab = item.id)"></ar-tabs>
    </view>
    <view class="map-wrap">
      <view class="map-item" v-for="(item, index) of mapData" :key="index" @click="goGame(item.id, item.localId)">
        <view class="map-thumbnail">
          <span class="map-name">{{ item.mapName }}</span>
          <create-content :gameMap="item.mapData" :shrink="true"></create-content>
        </view>
        <view class="map-info">
          <view class="map-info-item">
            <i class="ai-user" />
            <span>{{ item.creator || '(匿名)' }}</span>
          </view>
          <view class="map-info-item">
            <i class="ai-like-o" />
            <span>{{ item.praiseNumber || '0' }}</span>
          </view>
        </view>
        <view class="champion">
          <img src="https://source.aring.cc/assets/project/sokoban/imgs/workshop/champion.png" alt="" />
          <span>{{ item.mapKingName }}</span>
        </view>
      </view>
    </view>
    <view class="pagination">
      <i class="ai-caret-left" @click="prePage" :style="searchInfo.page === 1 ? 'color: gray' : ''" />
      <i class="ai-caret-right" @click="nextPage" :style="searchInfo.page >= searchInfo.total / searchInfo.pageSize ? 'color: gray' : ''" />
    </view>
  </view>
</template>

<script>
import TopBar from '@/components/top-bar.vue'
import ArPopup from '@/components/ar-popup.vue'
import ArTabs from '@/components/ar-tabs.vue'
import ArForm from '@/components/ar-form.vue'
import CreateContent from '@/components/game-content/create-content.vue'
import { tabList, formOptions } from './config/data'
export default {
  data() {
    return {
      tabList: Object.freeze(tabList),
      formOptions: Object.freeze(formOptions),
      currentTab: 0,
      searchInfo: {
        mapName: '',
        creator: '',
        page: 1,
        pageSize: 20,
        total: 0,
        sort: 0,
        type: ''
      },
      mapData: []
    }
  },
  components: { TopBar, ArPopup, ArTabs, ArForm, CreateContent },
  onReady() {
    this.search()
  },
  watch: {
    currentTab: {
      handler() {
        this.searchInfo.sort = 0
        this.searchInfo.type = ''
        this.search()
      }
    }
  },
  methods: {
    async search() {
      switch (this.currentTab) {
        case 1: {
          this.searchInfo.sort = 1
          break
        }
        case 2: {
          if (!this.$store.getters.checkLogin) return (this.mapData = [])
          this.searchInfo.type = 'collect'
          break
        }
        case 3: {
          if (!this.$store.getters.checkLogin) return (this.mapData = [])
          this.searchInfo.type = 'personal'
          break
        }
        case 4: {
          return this.searchLocal()
        }
      }
      const res = await this.$api.get('map/page', {
        ...this.searchInfo,
        ...this.form
      })
      if (res.code === 0) {
        this.mapData = res.data.records
        this.searchInfo.total = res.data.total
      }
    },
    async searchLocal() {
      const data = []
      for (let i = 0; i < 99; i++) {
        const res = uni.getStorageSync(`map${i}`)
        if (res) data.push(JSON.parse(res))
      }
      this.mapData = data
    },
    goGame(id, localId) {
      uni.navigateTo({
        url: `/pack-game/pages/index?type=workshop&id=${id}&localId=${localId}`
      })
    },
    prePage() {
      if (this.searchInfo.page === 1) return uni.showToast({ title: '已是第一页', icon: 'none' })
      this.searchInfo.page--
      this.search()
    },
    nextPage() {
      if (this.searchInfo.page >= this.searchInfo.total / this.searchInfo.pageSize) return uni.showToast({ title: '已是最后一页', icon: 'none' })
      this.searchInfo.page++
      this.search()
    },
    formCreate(form) {
      this.form = form
    }
  }
}
</script>

<style lang="scss" scoped>
.workshop-page {
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  background-image: url('https://source.aring.cc/assets/project/sokoban/imgs/common/bg.png');
  .tabs {
    background-color: rgba($color: #fff, $alpha: 0.7);
  }
  .map-wrap {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    background-color: rgba($color: #fff, $alpha: 0.7);
    width: 100%;
    padding: 10rpx;
    height: calc(100vh - 380rpx);
    overflow: auto;
    .map-item {
      display: flex;
      width: calc(50% - 20rpx);
      flex-flow: column nowrap;
      align-items: center;
      position: relative;
      .map-thumbnail {
        position: relative;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 360rpx;
        border: 8rpx $main-color solid;
        background-color: $light-main-color;
        margin: 10rpx 0;
        border-radius: 20rpx;
        overflow: hidden;
        .map-name {
          position: absolute;
          color: rgba($color: #000, $alpha: 0.6);
          font-weight: bold;
          font-size: 50rpx;
          z-index: 100;
        }
      }
      .map-info {
        width: 90%;
        background-color: #fff;
        border-radius: 99999px;
        margin-bottom: 20rpx;
        font-size: 28rpx;
        padding: 0 10rpx;
        display: flex;
        justify-content: space-between;
        .map-info-item {
          height: 40rpx;
          line-height: 40rpx;
          i {
            margin-right: 4rpx;
          }
        }
      }
      .champion {
        position: absolute;
        top: 18rpx;
        right: 8rpx;
        display: flex;
        align-items: center;
        background-color: rgba($color: #fff, $alpha: 0.6);
        border-radius: 20rpx;
        padding: 6rpx 30rpx;
        img {
          height: 40rpx;
          width: 40rpx;
        }
        span {
          font-size: 28rpx;
          font-weight: bold;
        }
      }
    }
  }
  .pagination {
    display: flex;
    justify-content: space-between;
    padding: 0 30rpx;
    background-color: rgba($color: #fff, $alpha: 0.7);
    i {
      font-size: 70rpx;
      background-color: rgba($color: #fff, $alpha: 0.7);
      border-radius: 50%;
      padding: 10rpx;
      color: $main-color;
    }
    i[disabled] {
      color: gray;
    }
  }
}
</style>
