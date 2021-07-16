<template>
  <div class="workshop">
    <p class="workshop-title out-title">创意工坊</p>
    <div class="workshop-content">
      <div class="player" v-for="(item, index) in mapValue" :key="index" @click="toGame(item.mapData)">
        <p class="player-creator">{{ item.creator }}</p>
        <p class="player-map-name">{{ item.mapName }}</p>
        <p class="player-time">{{ item.time }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from '@/network/request'
export default {
  data: function () {
    return {
      //地图数据
      mapValue: [],
    }
  },
  methods: {
    //跳转游戏页面
    toGame(mapData) {
      this.$router.push({ path: '/game' })
    },
    //获取地图数据
    getPlayerMap() {
      request({
        url: 'map/list',
        method: 'GET',
      })
        .then((res) => {
          console.log(res)
          res.data.forEach((item) => {
            this.mapValue.push(item)
          })
        })
        .catch((err) => {
          this.$message({
            message: '获取地图失败：' + err,
            type: 'error',
          })
        })
    },
  },
  created() {
    this.getPlayerMap()
  },
}
</script>

<style scoped>
@import '../assets/css/animation.css';

.workshop {
  width: 100vw;
  padding-top: 30px;
  /*background: #95d52f;*/
}
.workshop-content {
  width: 80%;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.player {
  width: 100%;
  height: 70px;
  margin: 10px 0;
  background: #339933;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #ffffff;
  font-size: 15px;
}
.player-creator {
  width: 25%;
  text-align: center;
}
.player-map-name,
.player-time {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
}
.player-map-name {
  width: 20%;
}
.player-time {
  width: 50%;
  text-align: center;
  font-size: 13px;
}
</style>
