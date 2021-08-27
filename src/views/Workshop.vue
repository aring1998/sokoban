<template>
  <div class="workshop">
    <top-bar></top-bar>
    <div class="page-title">创意工坊</div>
    <!-- 搜索框 -->
    <div class="search">
      <div>
        <label for="mapName">地图名 </label>
        <input type="text" v-model="searchInfo.mapName" id="mapName">
      </div>
      <div>
        <label for="creator">作者 </label>
        <input type="text" v-model="searchInfo.creator" id="creator">
      </div>
      <van-button type="primary" @click="getGameMap" size="small" round>搜索</van-button>
    </div>
    <!-- tab标签 -->
    <van-tabs v-model="workshopTab" color="var(--mainColor)" class="workshop-tab" swipeable>
      <van-tab title="最新"></van-tab>
      <van-tab title="最热门"></van-tab>
      <van-tab title="我的收藏"></van-tab>
      <van-tab title="本地地图"></van-tab>
      <!-- 创意工坊列表 -->
      <van-pull-refresh
        class="workshop-wrapper"
        v-model="isRefresh"
        :disabled="refreshDisabled"
        success-text="刷新成功"
        @refresh="getGameMap()"
        @touchstart="controlDisabled"
        ref="list"
      >
        <div class="workshop-content" v-show="mapData.length > 0">
          <ul class="workshop-map">
            <li
              class="workshop-map-item"
              v-for="(item, index) in mapData"
              :key="index"
              @click="
                $router.push({
                  name: 'game',
                  params: { id: item.id, localId: item.localId },
                  query: { type: 'workshop' }
                })
              "
            >
              <!-- 地图缩略图 -->
              <div class="map-thumbnail">
                <create-content :gameMap="item.mapData"></create-content>
              </div>
              <div class="map-intro">
                <span class="name">{{ item.mapName }}</span>
                <span class="creator">{{ item.creator }}</span>
                <!-- 点赞/收藏/分享 -->
                <div class="tool-bar">
                  <div v-show="workshopTab != 3">
                    <van-icon :name="item.hasPraise ? 'good-job' : 'good-job-o'" @click.stop="like(index, item.id)" />
                    <van-icon :name="item.hasCollect ? 'star' : 'star-o'" @click.stop="collect(index, item.id)" />
                    <van-icon :name="shareIndex === index ? 'share' : 'share-o'" @click.stop="share(index, item.mapName)" />
                    <van-icon name="close" v-show="$store.state.userInfo.name == 'aring'" @click.stop="del(item.id, item.mapName, index)" />
                  </div>
                  <div v-show="workshopTab == 3">
                    <van-icon name="close" @click.stop="delLocalMap(item.localId, item.mapName)"/>
                    <van-icon name="upgrade" @click.stop="uploadLocalMap(item.localId, item.mapName)"/>
                  </div>
                  <span class="date">{{ item.time | formatDate }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <van-empty
          class="custom-image"
          :image="require('@/assets/img/common/empty.png')"
          image-size="90"
          description="空空如也~"
          v-show="mapData.length === 0"
        />
      </van-pull-refresh>
    </van-tabs>
    <!-- 分页 -->
    <van-pagination
      v-model="searchInfo.current"
      :total-items="searchInfo.total"
      :items-per-page="searchInfo.size"
      @change="changePage"
      style="margin: 0 10px"
    >
      <template #prev-text>
        <van-icon name="arrow-left" />
      </template>
      <template #next-text>
        <van-icon name="arrow" />
      </template>
    </van-pagination>
  </div>
</template>

<script>
import { request } from '@/network/request'
import TopBar from '@/components/TopBar'
import CreateContent from '@/components/game-content/CreateContent.vue'

export default {
  name: 'workshop',
  data() {
    return {
      mapData: [], // 地图数据
      searchInfo: { // 搜索列表
        mapName: '', // 地图名
        creator: '', // 作者
        current: 1, // 页码
        size: 20, // 每页条数
        total: 0, // 总条数
        sort: 0, // 排序
        type: '' // 方式
      },
      workshopTab: 0,
      isRefresh: false,
      shareIndex: null,
      refreshDisabled: false
    }
  },
  components: {
    TopBar,
    CreateContent
  },
  created() {
    this.searchInfo.mapName = this.$route.query.mapName
    this.getGameMap()
  },
  watch: {
    // 监听tab页变化以重新加载地图列表
    workshopTab: {
      handler(value) {
        this.searchInfo.sort = 0
        this.searchInfo.type = ''
        // 本地地图
        if (value === 3) {
          return this.getLocalMap()
        }
        // 最热门
        if (value === 1) this.searchInfo.sort = 1
        // 我的收藏
        if (value === 2) {
          if (this.$store.commit('checkLogin')) return this.mapData = []
          this.searchInfo.type = 'collect'
        }
        this.getGameMap()
      }
    }
  },
  methods: {
    // 获取地图数据
    getGameMap() {
      if (this.workshopTab === 3) return this.isRefresh = false
      this.$toast.loading({ message: '加载中', forbidClick: true })
      request({
        url: '/map/page',
        method: 'GET',
        params: {
          ...this.searchInfo // 展开搜索参数
        }
      }).then(res => {
        this.searchInfo.total = res.data.total // 获取总条数
        this.mapData = res.data.records // 地图数据赋值
        this.$toast.clear()
        this.isRefresh = false
      })
    },
    // 获取本地地图
    getLocalMap() {
      this.mapData = []
      for (let i = 0; i < 99; i++) {
        if (window.localStorage.getItem('map' + i)) {
          this.mapData.push(JSON.parse(window.localStorage.getItem('map' + i)))
        }
      }
    },
    // 分页页码改变时触发
    changePage(value) {
      this.current = value
      this.getGameMap()
    },
    // 点赞
    like(index, id) {
      if (this.$store.commit('checkLogin')) return
      this.$toast.loading({ message: '加载中', forbidClick: true })
      request({
        url: `like/${id}`,
        method: 'GET'
      }).then(res => {
        this.$toast.clear()
        if (res.code == 0) {
          this.$toast.success({ message: res.msg, duration: 500 })
          // 修改列表数据，以展示不同的点赞图标
          if (res.data) this.mapData[index].hasPraise = true
          else this.mapData[index].hasPraise = false
        }
      })
    },
    // 收藏
    collect(index, id) {
      if (this.$store.commit('checkLogin')) return
      this.$toast.loading({ message: '加载中', forbidClick: true })
      request({
        url: `collect/${id}`,
        method: 'GET'
      }).then(res => {
        this.$toast.clear()
        if (res.code == 0) {
          this.$toast.success({ message: res.msg, duration: 500 })
          // 修改列表数据，以展示不同的收藏图标
          if (res.data) this.mapData[index].hasCollect = true
          else this.mapData[index].hasCollect = false
        }
      })
    },
    // 分享
    share(index, name) {
      this.shareIndex = index
      this.$copyText(window.location.href + '?mapName=' + name)
      this.$notify({ type: 'success', message: '已复制地图链接到剪贴板，快去分享给好友吧！' })
    },
    // 删除地图
    del(id, name, i) {
      this.$dialog.confirm({
        message: `确定删除 "${name}" 吗？`
      }).then(() => {
        this.$toast.loading({ message: '加载中', forbidClick: true })
        request({
          url: `map/delete/${id}`,
          method: 'POST'
        }).then(res => {
          this.$toast.clear()
          if (res.code == 0) {
            this.$toast.success({ message: res.msg, duration: 500 })
            if (i == 0) this.mapData.splice(0, 1)
            else this.mapData.splice(i, i)
          }
        })
      })
    },
    // 删除本地地图
    delLocalMap(id, name) {
      this.$dialog.confirm({
        message: `确定删除 "${name}" 吗？`
      }).then(() => {
        this.$toast.success({ message: '删除成功', duration: 500 })
        window.localStorage.removeItem('map' + id)
        this.getLocalMap()
      })
    },
    // 上传本地地图
    uploadLocalMap(id, name) {
      const mapData = JSON.parse(window.localStorage.getItem('map' + id))
      if (mapData.mapName === '未命名') mapData.mapName = ''
      this.$dialog.confirm({
        message: `确定上传 "${name}" 吗？`
      }).then(() => {
        if (this.$store.commit('checkLogin')) return
        request({
          url: 'map/add',
          method: 'POST',
          data: mapData
        }).then(res => {
          if (res.code == 0) {
            this.$notify({ type: 'success', message: '上传成功' })
          }
        })
      })
    },
    // 控制下拉刷新是否禁用
    controlDisabled() {
      // 不在列表顶部时，禁用下拉刷新
      if (this.$refs.list.scrollTop < 10) this.refreshDisabled = false
      else this.refreshDisabled = true
    }
  }
}
</script>

<style lang="scss" scoped>
.workshop {
  height: 100vh;
  background: var(--mainColor);
  overflow: hidden;
  // 搜索框
  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    padding: 0 10px;
    div {
      display: flex;
      align-items: center;
    }
    label {
      color: #333;
      margin-right: 4px;
    }
    input {
      width: 95px;
      font-size: 12px;
      height: 25px;
      border: 2px var(--deepMainColor) solid;
      border-radius: 999px;
      padding: 0 10px;
    }
  }
  .workshop-tab {
    border-bottom-left-radius: unset;
    border-bottom-right-radius: unset;
    margin: 10px 10px 0 10px;
    background-color: #fff;
  }
  .workshop-wrapper {
    height: calc(100vh - 240px);
    overflow: auto;
    .workshop-content {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .workshop-map {
        display: flex;
        flex-flow: column nowrap;
        padding: 10px;
        .workshop-map-item {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          padding: 0 10px;
          background-color: var(--deepMainColor);
          min-height: 100px;
          border-radius: 5px;
          margin: 5px 0;
        }
        .map-thumbnail {
          height: 80px;
          width: 80px;
          border-radius: 5px;
          overflow: hidden;
          background-color: rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
        }
        .map-intro {
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-evenly;
          span {
            color: #fff;
          }
          .name {
            font-weight: 600;
            font-size: 20px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 210px;
          }
          .creator {
            font-size: 16px;
          }
          .date {
            font-size: 14px;
            margin-left: auto;
          }
          .tool-bar {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: space-between;
            font-size: 20px;
            font-weight: 600;
            color: #fff;
            margin-top: 5px;
            i {
              background-color: rgba(0, 0, 0, 0.3);
              border-radius: 50%;
              padding: 4px;
            }
          }
        }
      }
    }
  }
  
}

.van-pagination {
  overflow: hidden;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
