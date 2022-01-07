<template>
  <view class="help-info">
    <u-tabs
      :list="tabList"
      @click="item => (currentTab = item.id)"
      lineColor="#5ac725"
      activeStyle="font-size: 28rpx"
      inactiveStyle="font-size: 28rpx"
      itemStyle="padding: 16rpx"
    ></u-tabs>
    <view class="item" v-show="currentTab === 0">
      <span>
        通过虚拟手柄<img src="~@/static/img/help-info/handle.png" alt="" /> 控制人物移动，将所有箱子
        <div class="img-box box"></div>
        推入终点
        <div class="img-box end"></div>
        即可获得胜利!
      </span>
      <span
        >● 请留意您无法同时推动两个箱子
        <div class="img-box box"></div
      ></span>
      <span
        >● 务必小心地图中各种各样的陷阱
        <div class="img-box spikeweed"></div>
        它们将夺走您的生命<img src="~@/static/img/help-info/heart.png" alt=""
      /></span>
      <span>
        ● 如果您想了解更多地图元素
        <div class="img-box fire"></div>
        的作用，请点击上方
        <span style="font-weight: bold; display: inline"><img src="~@/static/img/help-info/map-manual.png" alt="" />地图手册</span>
      </span>
    </view>
    <view class="item" v-show="currentTab === 1">
      <view v-for="(item, index) of mapEl" :key="index">
        <div class="img-box" :class="item.class"></div>
        {{ item.name }}：
        <span v-for="(item, index) of mapEl[index].intro" :key="index">{{ index + 1 }}）{{ item }}；</span>
      </view>
    </view>
    <view class="item" v-show="currentTab === 2">
      <span>作者邮箱: 1303340995@qq.com</span>
    </view>
    <view class="item" v-show="currentTab === 3">
      <span>这是作者在学习前端一年后创建的第一个开源项目，目前项目仍在优化推进阶段，真挚地恳请您提出宝贵意见。</span>
      <span>项目开源，欢迎开发者参考学习，并且无比期盼您的参与，项目地址如下：</span>
      <a href="https://gitee.com/aring1998/sokoban"><span>gitee.com/aring1998/sokoban</span></a>
      <span>同时也欢迎您前来为我们点一个star</span>
      <span>开发过程十分感谢以下小伙伴(按首字母排序)：</span>
      <span style="font-weight: bold; word-break: break-all">dzz, funzeros, lyl, wangz, yuanyuanna</span>
      <br>
      <span>祝您游戏愉快！</span>
      <br><br>
      <span style="text-align: right;font-weight: bold">aring</span>
    </view>
  </view>
</template>

<script>
import { mapEl } from '@/static/js/map-el/index'
export default {
  data() {
    return {
      mapEl: Object.freeze(mapEl),
      tabList: [
        {
          id: 0,
          name: '游戏玩法'
        },
        {
          id: 1,
          name: '地图手册'
        },
        {
          id: 2,
          name: '意见反馈'
        },
        {
          id: 3,
          name: '关于项目'
        }
      ],
      currentTab: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.help-info {
  .u-tabs__wrapper__nav__item {
    font-size: 12px !important;
  }
  .item {
    width: 100%;
    padding: 20rpx;
    height: calc(100vh - 780rpx);
    overflow: auto;
    font-size: 32rpx;
    span {
      display: block;
      text-indent: 60rpx;
    }
    img {
      height: 50rpx;
      width: 50rpx;
    }
    .img-box {
      height: 50rpx;
      width: 50rpx;
      display: inline-block;
    }
  }
}
</style>
