<template>
  <div id="app">
    <el-tabs v-bind:value="$route.path" @tab-click="openPage">
      <el-tab-pane label="爱追更" name="/zhui"></el-tab-pane>
      <el-tab-pane label="探索" name="/explore"></el-tab-pane>
      <el-tab-pane label="更多" name="/more"></el-tab-pane>
    </el-tabs>
    <!-- <el-dropdown @command="openPage">
      <span class="el-dropdown-link">
        爱追更<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="zhui">追更</el-dropdown-item>
        <el-dropdown-item command="explore">探索</el-dropdown-item>
        <el-dropdown-item command="more">更多</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    openPage(page) {
      this.$router.push(page.name);
    },
  },
};
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
