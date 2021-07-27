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
    <div class="workshop-content">
      <ul class="workshop-map">
        <li
          class="workshop-map-item"
          v-for="(item, index) in mapData"
          :key="index"
          @click="
            $router.push({
              name: 'game',
              params: { gameMap: item.mapData, life: item.playerHP },
              query: { type: 'workshop' }
            })
          "
        >
          <div class="map-thumbnail">
            <game-content :gameMap="item.mapData"></game-content>
          </div>
          <div class="map-intro">
            <span class="name">{{ item.mapName }}</span>
            <span class="creator">{{ item.creator }}</span>
            <span class="date">{{ item.time.split(' ')[0] }}</span>
          </div>
        </li>
      </ul>
      <!-- 分页 -->
      <div>
        <van-pagination
          v-model="current"
          :total-items="total"
          :items-per-page="size"
          @change="changePage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { request } from '@/network/request'
import TopBar from '@/components/TopBar'
import GameContent from '@/components/GameContent'

export default {
  data: function() {
    return {
      mapData: [], // 地图数据
      current: 1, // 页码
      size: 20, // 每页条数
      total: '', // 总条数
      searchInfo: { // 搜索列表
        mapName: '',
        creator: ''
      }
    }
  },
  components: {
    TopBar,
    GameContent
  },
  created() {
    this.getGameMap()
  },
  methods: {
    // 获取地图数据
    getGameMap() {
      request({
        url: '/map/page',
        methods: 'GET',
        params: {
          size: this.size, // 条数
          current: this.current, // 页码
          mapName: this.searchInfo.mapName, // 地图名称
          creator: this.searchInfo.creator // 作者名称
        }
      })
        .then(res => {
          console.log(res);
          this.total = res.data.total // 获取总条数
          this.mapData = res.data.records // 地图数据赋值
        })
        .catch(err => {
          this.$notify({ type: 'err', message: '获取地图数据失败，错误：' + err })
        })
    },
    // 分页页码改变时触发
    changePage(value) {
      this.current = value
      this.getGameMap()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/animation.css';

.workshop {
  height: 100vh;
  background: var(--mainColor);
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
  .workshop-content {
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .workshop-map {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      max-height: calc(100vh - 400px);
      overflow: scroll;
      padding: 10px 0;
      margin-bottom: 20px;
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
      }
    }
  }
}
</style>
