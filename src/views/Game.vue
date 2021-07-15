<template>
  <div class="sokoban">
    <!-- 顶部导航栏 -->
    <top-bar></top-bar>
    <!-- 游戏内容 -->
    <game-content :game-cell="gameCell"></game-content>
    <!-- 虚拟手柄 -->
    <div class="analog-handle">
      <div class="top">
        <i class="el-icon-caret-top" @click="move(-gameCell[0].length)"></i>
      </div>
      <div class="center">
        <i class="el-icon-caret-left" @click="move(-1)"></i>
        <i class="el-icon-caret-right" @click="move(1)"></i>
      </div>
      <div class="bottom">
        <i class="el-icon-caret-bottom" @click="move(gameCell[0].length)"></i>
      </div>
    </div>
    <button @click="changeLevel(-1)">上一关</button>
    <button @click="changeLevel(1)">下一关</button>
  </div>
</template>

<script>
import {official} from "@/assets/js/level";
import {checkClass} from "@/utils/index";
import {request} from '@/network/request'

import TopBar from "@/components/TopBar"
import GameContent from "@/components/GameContent"

export default {
  data() {
    return {
      level: 0,
      gameCell: official[0]
    };
  },
  components: {
    TopBar,
    GameContent
  },
  mounted() {
    // 判断是否测试地图
    if (this.$route.params.type == 'created') {
      this.gameCell = this.$route.params.gameCell
    }
    const _this = this
    document.addEventListener('keydown', function(e){
      switch(e.keyCode) {
        case 37: {  // 左
          _this.move(-1)
          break
        }
        case 38: {  // 上
          _this.move(-_this.gameCell[0].length)
          break
        }
        case 39: {  // 右
          _this.move(1)
          break
        }
        case 40: {  // 下
          _this.move(_this.gameCell[0].length)
          break
        }
      }
    })
  },
  methods: {
    // 玩家移动
    move(step) {
      const td = document.getElementsByTagName('td')
      for(let i in td) {
        if (checkClass(td[i], 'player') != -1) {
          const j = eval(i) + step
          // 如果超出单元格
          if (j >= td.length || j < 0) return
          // 如果碰墙
          if (checkClass(td[j], 'wall') != -1) return
          // 如果碰箱子
          if (checkClass(td[j], 'box') != -1) {
            // 如果箱子撞墙或箱子
            if (checkClass(td[eval(j) + step], 'wall') != -1 || checkClass(td[eval(j) + step], 'box') != -1) return
            // 箱子移动
            td[j].classList.remove('box')
            td[eval(j) + step].classList.add('box')
            // 如果箱子抵达终点
            if (checkClass(td[eval(j) + step], 'end') != -1) {
              const endCounter = document.getElementsByClassName('end').length  // 获取终点的个数
              const boxOnEnd = document.querySelectorAll('.box.end').length  // 获取抵达终点箱子的个数
              if (boxOnEnd == endCounter) {
                alert('you win!')
                if (this.$route.params.type == 'created') {
                  this.gameCell = this.$route.params.gameCell
                }
                else this.changeLevel(1)
              }
            }
          }
          // 玩家移动
          td[i].classList.remove('player')
          td[j].classList.add('player')
          break
        }
      }
    },
    // 下一关
    changeLevel(value) {
      this.level += value
      this.gameCell = []
      setTimeout(() => {
        this.gameCell = official[this.level]
      }, 0);
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
</style>
