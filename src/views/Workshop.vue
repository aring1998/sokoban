<template>
  <div class="workshop">
    <top-bar></top-bar>
    <p class="workshop-title out-title">创意工坊</p>
    <div class="workshop-content">
      <ul class="workshop-map">
        <li
          class="workshop-map-item"
          v-for="(item, index) in mapData"
          :key="index"
          @click="
            $router.push({
              name: 'game',
              params: {gameMap: item.mapData},
              query: {type: 'workshop'}
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
      //地图数据
      mapData: []
    }
  },
  components: {
    TopBar,
    GameContent
  },
  methods: {
    //获取地图数据
    getGameMap() {
      request({
        url: 'map/list',
        method: 'GET'
      })
        .then(res => {
          console.log(res)
          this.mapData = res.data
        })
        .catch(err => {
          this.$notify({ type: 'danger', message: '获取地图失败，错误：' + err })
        })
    }
  },
  created() {
    this.getGameMap()
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/animation.css';

.workshop {
  height: 100vh;
  padding-top: 30px;
  background: var(--mainColor);
  .workshop-content {
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .workshop-map {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
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
