<template>
  <div id="app">
    <p>
      <router-link to="/zhui">追更</router-link>
      <router-link to="/explore">探索</router-link>
      <router-link to="/more">更多</router-link>
    </p>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  padding: 15px;
}
</style>
