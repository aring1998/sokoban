<template>
  <div class="mainpage">
    <div class="choosebox" :class="{ show: ifchoose }">
      <p class="choosebox-title">PUSH THE BOX!</p>
      <button class="choosebtn" @click="chooseLevel">选择关卡</button>
      <button class="choosebtn" @click="$router.push('/workshop')">
        创意工坊
      </button>
      <button class="choosebtn" @click="$router.push('/create')">
        创建地图
      </button>
    </div>
    <!--弹窗-->
    <div class="out" :class="{ show: ifchoose }">
      <p class="out-title">选择关卡</p>
      <div class="level-content">
        <button
          v-for="(item, index) in official"
          :key="index"
          class="btn"
          @click="levelIs(index + 1)"
          :class="{ active: level == index + 1 }"
        >
          {{ index + 1 }}
        </button>
      </div>
      <div class="level-btn">
        <button class="btn btn-ok" @click="toGame">确定</button>
        <button class="btn btn-no" @click="chooseLevel">返回</button>
      </div>
    </div>
  </div>
</template>

<script>
import { official } from '@/assets/js/level'
export default {
  data() {
    return {
      ifchoose: false,
      official: official,
      level: ''
    }
  },
  methods: {
    //选择关卡按钮弹出
    chooseLevel() {
      this.ifchoose = !this.ifchoose
      this.level = ''
    },
    //选择关卡
    levelIs(num) {
      this.level = num
    },
    //跳转游戏页面
    toGame() {
      if (this.level === '') {
        this.$notify({ type: 'danger', message: '请先选择关卡！' })
      } else {
        this.$router.push({
          name: 'game',
          params: { level: this.level },
          query: { type: 'level' }
        })
      }
    }
  },
  created() {
    this.official = official
  }
}
</script>

<style>
@import '../assets/css/animation.css';
/*首页*/
.mainpage {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}
.choosebox {
  width: 100vw;
  height: 100vh;
  background: rgb(149, 229, 240);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.5s;
}
.choosebtn,
.choosebox-title {
  width: 50%;
  height: 50px;
  text-align: center;
  margin-top: 10px;
}
.choosebtn {
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid rgb(2, 20, 31);
}
.show {
  transform: translate(0, -100vh);
  transition: all 1s;
}
/*弹窗 */
.out {
  width: 100vw;
  height: 100vh;
  background: rgb(149, 229, 240);
  transition: all 0.5s;
  padding-top: 50px;
}
.level-content {
  width: 80%;
  height: 50vh;
  margin: 0 auto 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
}
.level-btn {
  width: 80%;
  display: flex;
  justify-content: center;
  margin: 0 auto 10px;
}
.btn {
  width: 23%;
  height: 50px;
  margin-left: 5px;
  margin-top: 5px;
  border: none;
  cursor: pointer;
  color: #ffffff;
  background: rgb(16, 162, 219);
  border-radius: 10px;
}
.btn-ok {
  background: rgb(16, 162, 219);
  margin-right: 10px;
}
.btn-no {
  background: rgb(255, 46, 46);
  margin-left: 10px;
}
.active {
  background: rgb(26, 23, 179);
}
</style>
