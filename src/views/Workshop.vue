<template>
  <div class="workshop">
    <top-bar></top-bar>
    <p class="workshop-title out-title">创意工坊</p>
    <!-- 搜索框 -->
    <div class="workshop-searchMap">
      <van-field
        v-model="searchDate"
        label="地图名称"
        placeholder="请输入地图名称"
      />
      <van-field
        v-model="searchAuthor"
        label="作者名称"
        placeholder="请输入作者名称"
      />
      <van-button type="primary" @click="query">搜索</van-button>
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
              params: { gameMap: item.mapData },
              query: { type: 'workshop' },
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
  data: function () {
    return {
      //地图数据
      mapData: [],
      current: 1, //页码
      size: 20, //每页条数
      total: '', //总条数
      searchDate: '', //地图数据
      searchAuthor: '', //作者数据
    }
  },
  components: {
    TopBar,
    GameContent,
  },
  methods: {
    //获取地图数据
    // getGameMap() {
    //   request({
    //     url: 'map/list',
    //     method: 'GET',
    //   })
    //     .then(res => {
    //       console.log(res)
    //       this.mapData = res.data
    //     })
    //     .catch(err => {
    //       this.$notify({ type: 'danger', message: '获取地图失败，错误：' + err })
    //     })
    // },
    //分页请求
    getListDate() {
      request({
        url: '/map/page',
        methods: 'get',
        params: {
          size: this.size, //条数
          current: this.current, //页码
          mapName: this.mapName, //地图名称
          creator: this.creator, //作者名称
        },
      }).then((res) => {
        this.total = res.data.total //获取总条数
        this.mapData = res.data.records //地图数据赋值
      })
    },
    //分页页码改变时触发
    changePage(val) {
      this.current = val
      console.log(val)
      this.getListDate()
    },
    //查询
    query(mapName, creator) {
      mapName = this.searchDate //地图名称参数
      this.mapName = mapName
      creator = this.searchAuthor //作者名称参数
      this.creator = creator
      this.getListDate() //调用查询
    },
  },
  created() {
    //this.getGameMap();
    this.getListDate()
  },

  //监听input查询
  // watch: {
  //   //地图
  //   'searchDate': {
  //     handler: function (mapName) {
  //       this.mapName=mapName //地图名称
  //       this.getListDate(); //调用查询
  //     },
  //   },
  //   //作者
  //   'searchAuthor': {
  //     handler: function (creator) {
  //       this.creator=creator //作者名称
  //       this.getListDate(); //调用查询
  //     },
  //   },
  // },
}
</script>

<style lang="scss" scoped>
@import '../assets/css/animation.css';

.workshop {
  height: 100vh;
  padding-top: 30px;
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
      max-height: 280px;
      overflow: scroll;
      .workshop-map-item {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        padding: 0 10px;
        background-color: var(--deepMainColor);
        height: 100px;
        border-radius: 5px;
        margin-bottom: 10px;
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
