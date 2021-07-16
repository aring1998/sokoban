<template>
  <div class="sokoban">
    <!-- 顶部导航栏 -->
    <top-bar></top-bar>
    <!-- 游戏内容 -->
    <game-content :game-cell="gameCell"></game-content>
    <!-- 虚拟手柄 -->
    <div class="analog-handle">
      <div class="top">
        <i class="el-icon-caret-top" @click="move('y', -1)"></i>
      </div>
      <div class="center">
        <i class="el-icon-caret-left" @click="move('x', -1)"></i>
        <i class="el-icon-caret-right" @click="move('x', 1)"></i>
      </div>
      <div class="bottom">
        <i class="el-icon-caret-bottom" @click="move('y', 1)"></i>
      </div>
    </div>
    <popover v-show="popShow" v-if="this.$route.params.type == 'created'">
      <div class="test-pop">
        <span>您已完成该地图的测试</span>
        <span>您可以选择将地图存储</span>
        <span>我们需要更多有趣的地图</span>
        <span>如果可以请选择上传云端</span>
        <div>
          <button @click="saveLocal">存在本地</button>
          <button @click="saveServe">上传云端</button>
        </div>
      </div>
    </popover>
    <button @click="changeLevel(-1)">上一关</button>
    <button @click="changeLevel(1)">下一关</button>
  </div>
</template>

<script>
import Vue from 'vue'

import {official} from "@/assets/js/level";
import {request} from '@/network/request'

import TopBar from "@/components/TopBar"
import GameContent from "@/components/GameContent"
import Popover from "@/components/Popover"


export default {
  data() {
    return {
      level: 0,
      gameCell: official[2],  // 游戏地图
      playerX: 0,  // 人物x轴坐标
      playerY: 0,  // 人物y轴坐标
      endCounter: 0,  // 终点个数
      popShow: false,  // 弹出框是否展示
    };
  },
  components: {
    TopBar,
    GameContent,
    Popover
  },
  mounted() {
    //判断是否通过选关进入
    if(this.$route.query.level !== undefined){
      this.level += this.$route.query.level - 1
      this.gameCell = []
      setTimeout(() => {
        this.gameCell = official[this.level]
      }, 0);
    }
    // 判断是否测试地图
    if (this.$route.params.type == 'created') {
      this.gameCell = this.$route.params.gameCell
    }
    // 游戏初始化
    this.init()
    // 
    // const _this = this
    // document.addEventListener('keydown', function(e){
    //   switch(e.keyCode) {
    //     case 37: {  // 左
    //       _this.move(-1)
    //       break
    //     }
    //     case 38: {  // 上
    //       _this.move(-_this.gameCell[0].length)
    //       break
    //     }
    //     case 39: {  // 右
    //       _this.move(1)
    //       break
    //     }
    //     case 40: {  // 下
    //       _this.move(_this.gameCell[0].length)
    //       break
    //     }
    //   }
    // })
  },
  methods: {
    // 初始化
    init() {
      // 获取人物坐标、终点个数
      for (let y in this.gameCell) {
        for (let x in this.gameCell[y]) {
          if (this.gameCell[y][x] == 2) {
            console.log('找到玩家的坐标：', x , y);
            this.playerX = x
            this.playerY = y
          }
          if (this.gameCell[y][x] == 4) {
            this.endCounter++
          }
        }
      }
    },
    // 玩家移动
    move(pos, step) {
      const fromPlace = this.gameCell[this.playerY][this.playerX]
      console.log(fromPlace);
      if (fromPlace == 6) 
        Vue.set(this.gameCell[this.playerY], this.playerX, 4)
      else
        Vue.set(this.gameCell[this.playerY], this.playerX, 1)
      
      if (pos == 'x')
        this.playerX = eval(this.playerX) + step
      else
        this.playerY = eval(this.playerY) + step

      const movePlace = this.gameCell[this.playerY][this.playerX]
      
      
      if (movePlace == 0) {  // 碰墙
        if (pos == 'x')
          this.playerX -= step  // 复原人物位置
        else
          this.playerY -= step
      }
      if (movePlace == 3 || movePlace == 5) {  // 碰箱子
        if (pos == 'x') {
          const boxPlace = this.gameCell[this.playerY][eval(this.playerX) + step] // 箱子即将抵达位置
          if (boxPlace == 0 || boxPlace == 3) {
            this.playerX -= step
          }
          if (boxPlace == 4) {  // 如果箱子抵达终点
            Vue.set(this.gameCell[this.playerY], eval(this.playerX) + step, 5)
            setTimeout(() => {
              if (document.getElementsByClassName('box-on-end').length == this.endCounter) {
                alert('you win!')
                this.changeLevel(1)
              }
            }, 0);
          } else
            Vue.set(this.gameCell[this.playerY], eval(this.playerX) + step, 3)
        }
        else {
          const boxPlace = this.gameCell[eval(this.playerY) + step][this.playerX]
          if (boxPlace == 0 || boxPlace == 3) {
            this.playerY -= step
          }
          if (boxPlace == 4) {
            Vue.set(this.gameCell[eval(this.playerY) + step], this.playerX, 5)
            setTimeout(() => {
              if (document.getElementsByClassName('box-on-end').length == this.endCounter) {
                alert('you win!')
                this.changeLevel(1)
              }
            }, 0);
          } else
            Vue.set(this.gameCell[eval(this.playerY) + step], this.playerX, 3)
        }
      }
      if (movePlace == 4) {
        Vue.set(this.gameCell[this.playerY], this.playerX, 4)
      }

      // 人物移动
      Vue.set(this.gameCell[this.playerY], this.playerX, 2)
    },
    // 切换关卡
    changeLevel(value) {
      this.level += value
      this.gameCell = []
      setTimeout(() => {
        this.gameCell = official[this.level]
        this.init()
      }, 0);
    },
    // 将地图存在本地
    saveLocal() {
      for (let i = 0; i < 99; i++){
        if (!window.localStorage.getItem('map' + i)) {
          window.localStorage.setItem('map' + i, this.gameCell)
          break
        } 
      }
    },
    // 将地图上传云端
    saveServe() {
      const mapData = this.gameCell
      request({
        url: 'map/add',
        method: 'POST',
        data: {
          creator: '',
          mapName: '',
          mapData
        }
      }).then(res => {
        console.log(res);
        this.$message({
          message: '上传成功',
          type: 'success'
        });
      }).catch(err => {
        this.$message({
          message: '上传失败，错误：' + err,
          type: 'error'
        });
      })
    }
  }
};
</script>

<style>
.sokoban {
  background-color: var(--mainColor);
  height: 100vh;
}

.analog-handle {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background-color: rgba(0, 0, 0, .2);
  border-radius: 50%;
  border: 5px rgba(0, 0, 0, .4) solid;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  margin-top: 30px;
}

.analog-handle div {
  height: 33%;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analog-handle i {
  font-size: 60px;
  color: #fff;
}

.analog-handle .center {
  display: flex;
  justify-content: space-between;
}

.test-pop {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
}

.test-pop span {
  margin-bottom: 8px;
}
</style>
