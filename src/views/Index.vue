<template>
  <div class="sokoban">
    <!-- 顶部导航栏 -->
    <top-bar></top-bar>
    <!-- 游戏内容容器 -->
    <table class="game-container">
      <tr v-for="(item, index) in gameCell.length" :key="index">
        <td
          v-for="(item, index) of gameCell[index]"
          :key="index"
          :class="{
            'game-cell': true,
            'wall': item == 0,
            'floor': item == 1,
            'player': item == 2,
            'box': item == 3,
            'end': item == 4,
            'blank': item == 5
          }"
        ></td>
      </tr>
    </table>
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

import TopBar from "@/components/TopBar"

export default {
  data() {
    return {
      level: 0,
      gameCell: official[0]
    };
  },
  components: {
    TopBar
  },
  mounted() {
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
                this.changeLevel(1)
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
* {
  margin: 0;
  padding: 0;
}

.sokoban {
  background-color: #95d52f;
}

.game-container {
  border-collapse: collapse;
  border-spacing: 0;
  background-size: 30px 30px;
  background-repeat: repeat;
  background-image: url('~@/assets/img/block.gif');
  margin: 0 auto;
}

.game-container td {
  height: 30px;
  width: 30px;
}

.game-cell {
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.box {
  background-image: url('~@/assets/img/box.png');
}

.wall {
  background-image: url('~@/assets/img/wall.png');
}

.end {
  background-image: url('~@/assets/img/ball.png');
}

.player {
  background-image: url('~@/assets/img/down.png');
}

.box.end {
  background-image: url('~@/assets/img/end-box.png');
}

.analog-handle {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background-color: rgba(0, 0, 0, .2);
  border-radius: 50%;
  border: 5px rgba(0, 0, 0, .4) solid;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  margin-top: 30px;
}

.analog-handle div {
  height: 33%;
  width: 100%;
  text-align: center;
}

.analog-handle i {
  font-size: 30px;
  color: #fff;
}

.analog-handle .center {
  display: flex;
  justify-content: space-between;
}
</style>
