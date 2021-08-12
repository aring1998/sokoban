<template>
  <div class="workshop">
    <top-bar></top-bar>
    <p class="workshop-title out-title">创意工坊</p>
    <!-- 搜索框 -->
    <div class="workshop-searchMap">
      <van-field v-model="searchInfo.mapName" label="地图名称" placeholder="请输入地图名称" />
      <van-field v-model="searchInfo.creator" label="作者名称" placeholder="请输入作者名称" />
      <van-button type="primary" @click="getGameMap">搜索</van-button>
    </div>
    <!-- tab标签 -->
    <van-tabs v-model="workshopTab" color="var(--mainColor)" class="workshop-tab">
      <van-tab title="最新"></van-tab>
      <van-tab title="最热门"></van-tab>
      <van-tab title="我的收藏"></van-tab>
      <van-tab title="本地地图"></van-tab>
    </van-tabs>
    <!-- 创意工坊列表 -->
    <div class="workshop-content">
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
            <game-content :gameMap="item.mapData"></game-content>
          </div>
          <div class="map-intro">
            <span class="name">{{ item.mapName }}</span>
            <span class="creator">{{ item.creator }}</span>
            <!-- 点赞/收藏/分享 -->
            <div class="tool-bar">
              <van-icon
                name="good-job"
                v-show="item.hasPraise"
                @click.stop="like(index, item.id)"
              />
              <van-icon
                name="good-job-o"
                v-show="!item.hasPraise"
                @click.stop="like(index, item.id)"
              />
              <van-icon
                name="star"
                v-show="item.hasCollect"
                @click.stop="collect(index, item.id)"
              />
              <van-icon
                name="star-o"
                v-show="!item.hasCollect"
                @click.stop="collect(index, item.id)"
              />
              <van-icon
                name="share"
                v-show="index == shareIndex"
                @click.stop="share(index, item.mapName)"
              />
              <van-icon
                name="share-o"
                v-show="index != shareIndex"
                @click.stop="share(index, item.mapName)"
              />
              <span class="date">{{ item.time | formatDate }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 分页 -->
    <van-pagination
      v-model="current"
      :total-items="total"
      :items-per-page="size"
      @change="changePage"
      style="margin: 0 20px"
    />
  </div>
</template>

<script>
import { request } from '@/network/request'
import TopBar from '@/components/TopBar'
import GameContent from '@/components/GameContent'

export default {
  data() {
    return {
      mapData: [], // 地图数据
      current: 1, // 页码
      size: 20, // 每页条数
      total: '', // 总条数
      searchInfo: {
        // 搜索列表
        mapName: '', // 地图名
        creator: '', // 作者
        sort: 0, // 排序
        type: '' // 方式
      },
      workshopTab: 0,
      shareIndex: null
    }
  },
  components: {
    TopBar,
    GameContent
  },
  created() {
    this.searchInfo.mapName = this.$route.query.mapName
    this.getGameMap()
  },
  watch: {
    workshopTab: {
      handler(value) {
        this.searchInfo.sort = 0
        this.searchInfo.type = ''
        if (value === 3) {
          this.mapData = []
          for (let i = 0; i < 99; i++) {
            if (window.localStorage.getItem('map' + i)) {
              this.mapData.push(JSON.parse(window.localStorage.getItem('map' + i)))
            } else return
          }
        }
        if (value === 1) this.searchInfo.sort = 1
        if (value === 2) this.searchInfo.type = 'collect'
        this.getGameMap()
      }
    }
  },
  methods: {
    // 获取地图数据
    getGameMap() {
      this.$toast.loading({ message: '加载中', forbidClick: true })
      request({
        url: '/map/page',
        methods: 'GET',
        params: {
          size: this.size, // 条数
          current: this.current, // 页码
          ...this.searchInfo // 展开搜索参数
        }
      }).then(res => {
        this.total = res.data.total // 获取总条数
        this.mapData = res.data.records // 地图数据赋值
        this.$toast.clear()
      })
    },
    // 分页页码改变时触发
    changePage(value) {
      this.current = value
      this.getGameMap()
    },
    // 点赞
    like(index, id) {
      this.$toast.loading({ message: '加载中', forbidClick: true })
      request({
        url: `like/${id}`,
        methods: 'GET'
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
      this.$toast.loading({ message: '加载中', forbidClick: true })
      request({
        url: `collect/${id}`,
        methods: 'GET'
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/animation.css';

.workshop {
  height: 100vh;
  background: var(--mainColor);
  overflow: hidden;
  .workshop-searchMap {
    background: var(--mainColor);
    .van-field {
      width: 80%;
      margin: 0 auto;
      margin-top: 10px;
    }
    .van-button {
      width: 20%;
      margin-top: 10px;
      margin-left: 70%;
    }
  }
  .workshop-tab {
    border-bottom-left-radius: unset;
    border-bottom-right-radius: unset;
    margin: 10px 20px 0 20px;
  }
  .workshop-content {
    margin: -1px 20px 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .workshop-map {
      display: flex;
      flex-flow: column nowrap;
      height: calc(100vh - 400px);
      overflow: scroll;
      padding: 10px;
      background-color: #fff;
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
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          margin-top: 5px;
          i {
            margin-right: 8px;
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            padding: 4px;
          }
        }
      }
    }
  }
}
.van-pagination__item .van-pagination__item--active .van-pagination__page .van-hairline {
  background-color: var(--mainColor);
}
</style>
