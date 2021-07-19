<template>
  <div class="sokoban">
    <!-- 顶部导航栏 -->
    <top-bar></top-bar>
    <!-- 人物生命值 -->
    <div class="life">
      <span>当前生命：</span>
      <van-icon name="like" color="red" v-for="(item, index) in 2" :key="index" />
      <van-icon name="like" color="gray" v-for="(item, index) in 1" :key="index"/>
    </div>
    <!-- 游戏内容 -->
    <game-content :game-map="gameMap"></game-content>
    <div class="checkpoint">
      <van-button class="regret" @click="onRegret" type="primary" size="mini">悔棋</van-button>
      <van-button class="reset" @click="onReset" type="primary" size="mini">重置</van-button>
    </div>
    <!-- 虚拟手柄 -->
    <div class="analog-handle">
      <div class="top">
        <van-icon name="arrow-up" @click="move('y', -1)" />
      </div>
      <div class="center">
        <van-icon name="arrow-left" @click="move('x', -1)" />
        <van-icon name="arrow" @click="move('x', 1)" />
      </div>
      <div class="bottom">
        <van-icon name="arrow-down" @click="move('y', 1)" />
      </div>
    </div>
    <div class="checkpoint">
      <van-button @click="changeLevel(-1)" type="primary" size="mini">上一关</van-button>
      <van-button @click="changeLevel(1)" type="primary" size="mini">下一关</van-button>
    </div>
    <popover v-show="popShow" v-if="this.$route.query.type == 'created'">
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
  </div>
</template>

<script>
import Vue from 'vue'

import { official } from '@/assets/js/level'
import { request } from '@/network/request'

// import { deepClone } from '../utils'
import TopBar from '@/components/TopBar'
import GameContent from '@/components/GameContent'
import Popover from '@/components/Popover'

export default {
  data() {
    return {
      level: 0,
      gameMap: official[0], // 游戏地图
      playerX: 0, // 人物x轴坐标
      playerY: 0, // 人物y轴坐标
      endCounter: 0, // 终点个数
      popShow: false, // 弹出框是否展示
      cloneBaseData: [],
      mark: false
    }
  },
  components: {
    TopBar,
    GameContent,
    Popover,
  },
  mounted() {
    console.log(official)
    // window.sessionStorage.setItem('baseData', JSON.stringify(deepClone(official)))

    switch(this.$route.query.type) {
      // 由选关进入
      case 'level': {
        this.changeLevel(this.$route.params.level - 1);
      }
      // 由测试地图/创意工坊进入
      case 'workshop':
      case 'created': {
        this.gameMap = this.$route.params.gameMap
      }
    }
    // 游戏初始化
    this.init(this.gameMap)
  },
  methods: {
    // 初始化
    init(gameMap) {
      this.endCounter = 0
      // 获取人物坐标、终点个数
      for (let y in gameMap) {
        for (let x in gameMap[y]) {
          if (gameMap[y][x] == 2) {
            console.log('找到玩家的坐标：', x, y)
            this.playerX = x
            this.playerY = y
          }
          if (gameMap[y][x] == 4) {
            this.endCounter++
          }
        }
      }
    },
    // 玩家移动
    move(direction, step) {
      /**
       * 变量名
       * @direction: 轴方向
       * @step: 步数
       * @fromPlace: 出发点
       * @toPlace: 目标点
       * @setY: 目标点Vue.set中object的index值
       * @setX: 目标点Vue.set中key值
       * @setBoxY: 箱子移动点Vue.set中object的index值
       * @setBoxX: 箱子移动点Vue.set中key值
       * @isDefault: 是否默认的移动方法
       */

      // 声明初始变量
      const fromPlace = this.gameMap[this.playerY][this.playerX]
      let toPlace, boxPlace, setY, setX, setBoxY, setBoxX
      let isDefault = true

      // 判断方向
      if (direction == 'x') {
        setY = this.playerY
        setX = +this.playerX + step
        setBoxY = setY
        setBoxX = setX + step
      } else {
        setY = +this.playerY + step
        setX = this.playerX
        setBoxY = setY + step
        setBoxX = setX
      }

      // 判断是否超出单元格
      if (setY < 0 || setY == this.gameMap[0].length || setX < 0 || setX == this.gameMap[0].length) return
      else toPlace = this.gameMap[setY][setX]

      // 如果出发点是箱子抵达终点或人物在终点上
      if (fromPlace == 5 || fromPlace == 6) Vue.set(this.gameMap[this.playerY], this.playerX, 4)
      else Vue.set(this.gameMap[this.playerY], this.playerX, 1)

      // 判断目标点
      switch (toPlace) {
        // 碰墙
        case 0: {
          if (fromPlace == 5 || fromPlace == 6) Vue.set(this.gameMap[this.playerY], this.playerX, 6)
          else Vue.set(this.gameMap[this.playerY], this.playerX, 2)
          return
        }
        // 碰箱子
        case 3:
        case 5: {
          if (direction == 'x') boxPlace = this.gameMap[this.playerY][+this.playerX + step * 2]
          else boxPlace = this.gameMap[+this.playerY + step * 2][this.playerX]

          // 如果箱子撞墙/箱子
          if (boxPlace == 0 || boxPlace == 3) {
            if (fromPlace == 5 || fromPlace == 6) Vue.set(this.gameMap[this.playerY], this.playerX, 6)
            else Vue.set(this.gameMap[this.playerY], this.playerX, 2)
            return
          }
          // 如果箱子能移动
          if (boxPlace == 4) {
            // 如果箱子抵达终点
            Vue.set(this.gameMap[setBoxY], setBoxX, 5)
            setTimeout(() => {
              if (document.querySelectorAll('.box.end').length == this.endCounter) {
                alert('you win!')
                if (this.$route.params.type == 'created') {
                  this.popShow = true
                } else this.changeLevel(1)
              }
            }, 0)
          } else Vue.set(this.gameMap[setBoxY], setBoxX, 3)
          // 如果目标点是箱子抵达终点或人物在终点上
          if (toPlace == 5 || toPlace == 6) {
            isDefault = false
            Vue.set(this.gameMap[setY], setX, 6)
          }
          break
        }
        // 碰终点
        case 4: {
          isDefault = false
          Vue.set(this.gameMap[setY], setX, 6)
          break
        }
      }
      // 设定移动后的玩家位置
      if (direction == 'x') this.playerX = +this.playerX + step
      else this.playerY = +this.playerY + step

      if (isDefault == true) Vue.set(this.gameMap[setY], setX, 2)
      return
    },
    // 悔棋（可以连续悔棋置第一步）
    onRegret() {

    },
    // 重置当前关卡
    onReset() {
      const { level } = this.$route.query;
      this.gameMap = JSON.parse(window.sessionStorage.getItem('baseData'))[level];
      this.init(this.gameMap)
    },
    // 切换关卡
    changeLevel(value) {
      // 待看
      // console.log(this.mark)
      // let [t, m] = this.mark.split('-');
      // if (value === -1 && this.level === 0 && t === 'T') {
      //   this.$router.push({ path: 'game', query: { level: m+=value } })
      //   this.$notify({type: 'danger', message:'当前关卡，不能进行此操作哦，宝~'})
      //   return;
      // }
      // this.mark = 'F-0';
      this.level += value;
      this.gameMap = [];
      // 修改关卡，修改路由参数
      this.$router.push({ path: 'game', query: { level: this.level } })
      this.$nextTick(() => {
        this.gameMap = official[this.level];
        this.init(this.gameMap)
      })
    },
    // 将地图存在本地
    saveLocal() {
      for (let i = 0; i < 99; i++) {
        if (!window.localStorage.getItem('map' + i)) {
          window.localStorage.setItem('map' + i, this.gameMap)
          break
        }
      }
    },
    // 将地图上传云端
    saveServe() {
      const mapData = this.gameMap
      request({
        url: 'map/add',
        method: 'POST',
        data: {
          creator: '',
          mapName: '',
          mapData,
        },
      })
        .then((res) => {
          this.$notify({type: 'success', message:'上传成功'})
        })
        .catch((err) => {
          this.$notify({type: 'danger', message:'上传失败，错误：' + err})
        })
    },
  },
}
</script>

<style lang="scss">
.sokoban {
  background-color: var(--mainColor);
  height: 100vh;
}

.operation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  .regret {
    margin-left: 15px;
  }
  .reset {
    margin-right: 15px;
  }
}

.analog-handle {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  border: 5px rgba(0, 0, 0, 0.4) solid;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  // margin-top: 30px;
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

.checkpoint {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
}

.life {
  display: flex;
  align-items: center;
  font-weight: 600;
  padding: 0 30px;
  color: #fff;
  height: 30px;
  i {
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
