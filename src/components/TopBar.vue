<template>
  <div class="top-bar">
    <img src="~@/assets/img/logo.png" alt="">
    <span>菜单</span>
  </div>
</template>

<script>
export default {

}
</script>

<style>
.top-bar {
  display: flex;
  align-items: center;
  height: 30px;
  margin-bottom: 30px;
  padding: 0 30px;
  justify-content: space-between;
}

.top-bar img {
  width: 180px;
  height: 30px;
}

.top-bar span {
  font-weight: 600;
  color: #fff;
  font-size: 16px;
}
</style>