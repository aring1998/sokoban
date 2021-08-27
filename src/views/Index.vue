<template>
  <div class="index">
    <top-bar>
      <van-icon name="question-o" @click="$refs.intro.show()" />
    </top-bar>
    <!-- 主界面 -->
    <div class="main">
      <img src="~@/assets/img/index/game-name.png" alt="">
      <van-button icon="flag-o" type="primary" size="large" plain round @click="$refs.level.show()">开始游戏</van-button>
      <van-button icon="shop-collect" type="primary" size="large" plain round @click="$router.push('/workshop')">创意工坊</van-button>
      <van-button icon="edit" type="primary" size="large" plain round @click="$router.push('/create')">创建地图</van-button>
      <!-- 版本 -->
      <span class="version">v {{ $store.state.version }}</span>
    </div>
    <!-- 选关弹窗 -->
    <popover type="white" class="choice-level" ref="level">
      <van-tabs v-model="levelTab" color="var(--mainColor)" swipeable>
        <van-tab title="基础关卡">
          <ul>
            <li
              v-for="(item, index) in basic"
              :key="index"
              :disabled="index + 1 > basicComplete"
              @click="toGame('basic', index, index + 1 > basicComplete)"
            >
            {{ index + 1 }}
            </li>
          </ul>
        </van-tab>
        <van-tab title="拓展关卡">
          <ul>
            <li
              v-for="(item, index) in expand"
              :key="index"
              :disabled="index + 1 > expandComplete"
              @click="toGame('expand', index, index + 1 > expandComplete)"
            >
            {{ index + 1 }}
            </li>
          </ul>
        </van-tab>
      </van-tabs>
    </popover>
    <!-- 关于游戏弹窗 -->
    <popover type="white" class="index-intro" ref="intro">
      <van-tabs v-model="aboutGameTab" color="var(--mainColor)" swipeable>
        <van-tab title="游戏玩法" class="index-intro-item">
          <span>
            &emsp;通过虚拟手柄<img src="~@/assets/img/index-intro/handle.png" alt="" />
            控制人物移动，将所有箱子<div class="img-box box"></div>
            推入终点<div class="img-box end"></div>即可获得胜利
          </span>
          <br>
          <span>&emsp;● 请留意您无法同时推动两个箱子<div class="img-box box"></div></span>
          <br>
          <span>&emsp;● 务必小心地图中各种各样的陷阱<div class="img-box spikeweed"></div>它们将夺走您的生命<van-icon name="like" color="red" /></span>
          <br>
          <span>
            &emsp;● 如果您想了解更多地图元素<div class="img-box fire"></div>的作用，请点击上方
            <span style="font-weight: 600"><img src="~@/assets/img/index-intro/mapManual.png" alt="" />地图手册</span>
          </span>
        </van-tab>
        <van-tab title="地图手册" class="index-intro-item">
          <ul>
            <li v-for="(item, index) of mapManual" :key="index">
              <div class="img-box" :class="item.class"></div>&emsp;{{ item.name }}：
              <span v-for="(item, index) of mapManual[index].intro" :key="index">{{ index + 1 }}）{{ item }}；</span>
            </li>
          </ul>
        </van-tab>
        <van-tab title="意见反馈" class="index-intro-item">
          <a href="http://wpa.qq.com/msgrd?v=3&uin=1303340995&site=qq&menu=yes">点击这里联系作者</a>
        </van-tab>
        <van-tab title="关于项目" class="index-intro-item">
          <p>&emsp;这是作者在学习前端一年后创建的第一个开源项目，目前项目仍在优化推进阶段，真挚地恳请您提出宝贵意见。</p>
          <p>&emsp;项目开源，欢迎开发者参考学习，并且无比期盼您的参与，项目地址如下：</p>
          <a href="https://gitee.com/aring1998/sokoban"><span>&emsp;https://gitee.com/aring1998/sokoban</span></a>
          <p>&emsp;同时也欢迎您前来为我们点一个star<van-icon name="star-o" color="orange" /></p>
          <p>&emsp;开发过程十分感谢以下小伙伴(按首字母排序)：</p>
          <p style="font-weight: 600">&emsp;funzeros, lyl, wangz, yuanyuanna</p>
          <br>
          <p>&emsp;祝您游戏愉快！</p>
          <br><br>
          <p style="text-align: right;font-weight: 600">aring</p>
        </van-tab>
      </van-tabs>
    </popover>
  </div>
</template>

<script>
import { basic, expand } from '@/assets/js/level/index'
import { mapEl } from '@/assets/js/map-el/index'

import TopBar from '@/components/TopBar'
import Popover from '@/components/Popover'

export default {
  data() {
    return {
      basic,
      expand,
      aboutGameTab: 0,
      levelTab: 0,
      mapManual: mapEl,
      basicComplete: 100,
      expandComplete: 99
    }
  },
  components: {
    TopBar,
    Popover
  },
  methods: {
    // 进入游戏
    toGame(pack, level, isComplete) {
      if (isComplete) return this.$notify({ type: 'danger', message: '请先挑战前面的关卡哦~' })
      this.$router.push({
        name: 'game',
        query: { type: 'level', pack },
        params: { level }
      })
    }
  }
}
</script>

<style lang="scss">
/*首页*/
.index {
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: var(--mainColor);
  .main {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    img {
      width: 355px;
      background-size: 100% 100%;
      margin: 60px 0;
    }
    button {
      width: 220px;
      margin-bottom: 20px;
      font-weight: 600;
      font-size: 20px;
      height: 60px;
      color: var(--deepMainColor);
      border-right: 2px var(--deepMainColor) solid;
      border-bottom: 4px var(--deepMainColor) solid;
    }
    .version {
      font-weight: 600;
      color: #fff;
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }
}

// 游戏介绍
.index-intro {
  img {
    height: 25px;
    width: 25px;
  }
  .index-intro-item {
    font-size: 16px;
    padding: 10px;
    background-color: #fff;
    height: calc(90vh - 150px);
    overflow: auto;
    li {
      margin-bottom: 10px;
    }
  }
  .img-box {
    height: 25px;
    width: 25px;
    background-size: 100% 100%;
    display: inline-block;
  }
  i {
    font-size: 20px;
    display: inline-block;
    margin-bottom: -100px;
    line-height: 20px;
  }
  .van-tabs__line {
    transform: translateX(38.5px) translateX(-50%)
  }
}

// 选择关卡
.choice-level {
  ul {
    display: flex;
    flex-flow: row wrap;
    background-color: #fff;
    align-content: flex-start;
    height: calc(90vh - 150px);
    overflow: auto;
    padding: 10px;
    li {
      background-color: var(--mainColor);
      height: 40px;
      line-height: 40px;
      width: 56px;
      margin: 8px;
      border-radius: 10px;
      color: #fff;
      font-weight: 900;
      font-size: 20px;
      text-align: center;
    }
    li[disabled] {
      background-color: var(--lightMainColor);
    }
    li.active {
      background-color: var(--deepMainColor);
    }
  }
  .van-tabs__line {
    transform: translateX(77.5px) translateX(-50%)
  }
}

.van-tab__text--ellipsis {
  font-size: 16px;
  font-weight: 600;
}
.van-tabs--line {
  border-radius: 10px;
  overflow: hidden;
}
</style>
