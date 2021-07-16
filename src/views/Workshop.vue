<template>
  <div class="workshop">
    <p class="workshop-title out-title">创意工坊</p>
    <div class="workshop-content">
      <div class="player" v-for="(item,index) in mapValue" :key="index">
          <p>{{item.name}}</p>
          <p>{{item.author}}</p>
          <p>{{item.date}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { request } from '@/network/request'
export default {
  data: function() {
    return {
        //地图数据
        mapValue:[
        {name:"我的地图",author:"张三",date:"2021-7-16"},
        {name:"我的地图",author:"张三",date:"2021-7-16"},
        {name:"我的地图",author:"张三",date:"2021-7-16"},
        {name:"我的地图",author:"张三",date:"2021-7-16"},
        {name:"我的地图",author:"张三",date:"2021-7-16"},
        {name:"我的地图",author:"张三",date:"2021-7-16"},
        {name:"我的地图",author:"张三",date:"2021-7-16"},
        {name:"我的地图",author:"张三",date:"2021-7-16"},
        {name:"我的地图",author:"张三",date:"2021-7-16"},
        {name:"我的地图",author:"张三",date:"2021-7-16"}],
    }
  },
  methods: {
    //获取地图数据
    getPlayerMap() {
      request({
        url: 'map/list',
        method: 'get'
      }).then(res => {
        res.data.forEach(el => {
            this.mapValue.push(el)
        });
      }).catch(err=>{
          this.$message({
          message: '获取地图失败：' + err,
          type: 'error'
        });
      })
    }
  },
  created() {
    this.getPlayerMap()
  }
}
</script>

<style scoped>
@import '../assets/css/animation.css';
.workshop {
  width: 100vw;
  padding-top: 30px;
  background: #95d52f;
}
.workshop-content{
    width: 80%;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.player{
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
</style>
