<template>
  <div id="app" :class="$store.state.theme">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import url('/assets/css/base.css');
@import url('/assets/css/theme.css');
</style>
