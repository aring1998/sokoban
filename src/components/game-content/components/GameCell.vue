<template>
  <div class="game-cell" :class="randerClass"></div>
</template>

<script>
import { staticMapRander, acitveMapRander } from './game-cell'

export default {
  props: {
    staticValue: {
      type: Number,
      default: 1
    },
    activeValue: {
      type: Number,
      default: 1
    }
  },
  computed: {
    randerClass() {
      let res = ''
      // 静止层渲染
      if (staticMapRander[this.staticValue]) res = staticMapRander[this.staticValue]
      // 活动层渲染
      if (acitveMapRander[this.activeValue]) res += acitveMapRander[this.activeValue]
      return res
    }
  }
}
</script>

<style>

</style>