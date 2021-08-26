<template>
  <div
    class="game-cell"
    :class="randerClass"
  ></div>
</template>

<script>

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
      const staticMapRander = {
        0: () => { res = 'wall' },
        4: () => { res = 'end' },
        5: () => { res = 'spikeweed' },
        6: () => { res = 'fire' },
        8: () => { res = 'toadstool' },
        9: () => { res = 'spring' },
        10: () => { res = 'single-portal-entry' },
        11: () => { res = 'single-portal-exit' },
        12: () => { res = 'beer' },
        13: () => { res = 'nectar' },
      }
      if (staticMapRander[this.staticValue]) staticMapRander[this.staticValue]()
      // 活动层渲染
      const acitveMapRander = {
        2: () => { res += ' player' },
        3: () => { res += ' box' },
        7: () => { res += ' ice-box' }
      }
      if (acitveMapRander[this.activeValue]) acitveMapRander[this.activeValue]()
      return res
    }
  }
}
</script>

<style>

</style>