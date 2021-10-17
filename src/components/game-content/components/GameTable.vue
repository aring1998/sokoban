<!-- 游戏地图 -->
<template>
  <div class="game-container">
    <div class="game-table">
      <slot :game-map="gameMap"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    gameMap: Array,
  }
}
</script>

<style lang="scss">
.game-container {
  text-align: center;
  margin: 0 auto;
  overflow: auto;
  max-height: 364px;
  max-width: 364px;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
  .game-table {
    background-size: 30px 30px;
    background-repeat: repeat;
    background-image: url('~@/assets/img/theme/forest/floor.png');
    display: inline-block;
    text-align: center;
    border: 2px #e8eaeda6 solid;
    .game-row {
      display: flex;
      .game-cell {
        height: 30px;
        width: 30px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
      }
    }
  }
}

/* 作为缩略图 */
.map-thumbnail {
  .game-container {
    overflow: unset;
    .game-table {
      background-size: 8px 8px;
      border: none;
      .game-row {
        .game-cell {
          height: 8px;
          width: 8px;
        }
      }
    }
  }
}
</style>
