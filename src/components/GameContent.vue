<!-- 游戏地图 -->
<template>
  <table class="game-container">
    <tr v-for="(item, index) in gameCell.length" :key="index" @click="getRowIndex(index)">
      <td
        v-for="(item, index) of gameCell[index]"
        @click="getColumnIndex(index)"
        :key="index"
        :class="{
          'game-cell': true,
          'wall': item == 0,
          'floor': item == 1,
          'player': item == 2 || item == 6,
          'box': item == 3 || item == 5,
          'end': item == 4 || item == 5 || item == 6,
        }"
      ></td>
    </tr>
  </table>
</template>

<script>
export default {
  props: {
    gameCell: Array,
    getColumnIndex: {
      type: Function,
      default: () => {}
    },
    getRowIndex: {
      type: Function,
      default: () => {}
    }
  }
}
</script>

<style>
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
  padding: 0;
}

.game-cell {
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.floor {
  background-image: url('~@/assets/img/block.gif');
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
</style>