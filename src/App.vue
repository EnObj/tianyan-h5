<template>
  <div id="app">
    <el-row type="flex" justify="space-around">
      <el-col :xs="24" :sm="20" :md="16" :lg="12">
        <div class="main">
          <el-tabs v-bind:value="$route.path" @tab-click="openPage">
            <el-tab-pane label="爱追更" name="/zhui"></el-tab-pane>
            <el-tab-pane label="探索" name="/explore"></el-tab-pane>
            <el-tab-pane label="更多" name="/more"></el-tab-pane>
          </el-tabs>
          <router-view></router-view>
        </div>
      </el-col>
    </el-row>
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
.main {
  padding: 0 15px;
}
</style>
