<template>
  <div class="mainpage">
    <top-bar>
      <van-icon name="question-o" @click="$refs.intro.popShow()" />
    </top-bar>
    <div class="choosebox" :class="{ show: ifChoice }">
      <p class="choosebox-title">PUSH THE BOX!</p>
      <button class="choosebtn" @click="choiceLevel">选择关卡</button>
      <button class="choosebtn" @click="$router.push('/workshop')">
        创意工坊
      </button>
      <button class="choosebtn" @click="$router.push('/create')">
        创建地图
      </button>
    </div>
    <!--弹窗-->
    <div class="out" :class="{ show: ifChoice }">
      <p class="out-title">选择关卡</p>
      <div class="level-content">
        <button
          v-for="(item, index) in official"
          :key="index"
          class="btn"
          @click="level = index + 1"
          :class="{ active: level == index + 1 }"
        >
          {{ index + 1 }}
        </button>
      </div>
      <div class="level-btn">
        <button class="btn btn-ok" @click="toGame">确定</button>
        <button class="btn btn-no" @click="choiceLevel">返回</button>
      </div>
    </div>
    <!-- 关于游戏弹窗 -->
    <white-popover class="index-intro" ref="intro">
      <van-tabs v-model="tabIndex" color="var(--mainColor)">
        <van-tab title="游戏玩法" class="index-intro-item">
          <span>&emsp;&emsp;通过虚拟手柄</span>
          <img src="~@/assets/img/index-intro/handle.png" alt="" />
          <span>控制人物移动，</span>
          <span>将所有箱子</span>
          <img src="~@/assets/img/box.png" alt="" />
          <span>推入终点</span>
          <img src="~@/assets/img/ball.png" alt="" />
          <span>即可获得胜利！</span>
        </van-tab>
        <van-tab title="地图手册" class="index-intro-item"> </van-tab>
        <van-tab title="意见反馈" class="index-intro-item"> </van-tab>
        <van-tab title="关于项目" class="index-intro-item">
          <span>&emsp;&emsp;该项目为开源项目，欢迎开发者参考学习，并且无比期盼您能加入我们，项目地址如下：</span>
          <a href="https://gitee.com/aring1998/sokoban">https://gitee.com/aring1998/sokoban</a>
          <p>也欢迎您为我们点一个star<van-icon name="star-o" color="orange" /></p>
          <br>
          <p>团队成员(按首字母排序)：</p>
          <p style="font-weight: 600">aring, lyl, wangz, yuanyuanna</p>
        </van-tab>
      </van-tabs>
    </white-popover>
  </div>
</template>

<script>
import { official } from '@/assets/js/level'

import TopBar from '@/components/TopBar'
import WhitePopover from '@/components/WhitePopover'

export default {
  data() {
    return {
      ifChoice: false,
      official: official,
      level: '',
      tabIndex: 0
    }
  },
  components: {
    TopBar,
    WhitePopover
  },
  methods: {
    //选择关卡按钮弹出
    choiceLevel() {
      this.ifChoice = !this.ifChoice
      this.level = ''
    },
    //跳转游戏页面
    toGame() {
      if (this.level === '') {
        this.$notify({ type: 'danger', message: '请先选择关卡！' })
      } else {
        this.$router.push({
          name: 'game',
          query: { type: 'level' },
          params: { level: this.level }
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '../assets/css/animation.css';
/*首页*/
.mainpage {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: var(--mainColor);
}
.choosebox {
  width: 100vw;
  height: 100vh;
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
  background: var(--mainColor);
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

.van-tab__text--ellipsis {
  font-size: 16px;
  font-weight: 600;
}

.van-tabs--line {
  border-radius: 10px;
  overflow: hidden;
}

.index-intro {
  img {
    height: 25px;
    width: 25px;
  }
  .index-intro-item {
    font-size: 16px;
    padding: 10px;
    background-color: #fff;
    height: calc(90vh - 60px);
  }
  i {
    font-size: 20px;
    display: inline-block;
    margin-bottom: -100px;
    line-height: 20px;
  }
}
</style>
