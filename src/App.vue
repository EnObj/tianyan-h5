<template>
  <div id="app">
    <el-row type="flex" justify="space-around">
      <el-col :xs="24" :sm="20" :md="16" :lg="12">
        <div class="main">
          <el-tabs :value="activeTab" @tab-click="openPage">
            <el-tab-pane label="爱追更" name="zhui"></el-tab-pane>
            <el-tab-pane label="探索" name="explore"></el-tab-pane>
            <el-tab-pane label="更多" name="more"></el-tab-pane>
          </el-tabs>
          <keep-alive include="Zhui">
            <router-view></router-view>
          </keep-alive>
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
      this.$router.push("/" + page.name).catch(console.error);
    },
    loadUserChannels() {
      const loading = this.$loading();
      const db = this.cloud.database();
      this.$store.dispatch("loadUserChannels", db).then(
        function() {
          // 关闭遮罩
          loading.close();
        }.bind(this)
      );
    },
  },
  computed: {
    activeTab() {
      return this.$route.path.substr(1);
    },
  },
  created() {
    this.cloudAuth.onLoginStateChanged(
      function(loginState) {
        if (loginState) {
          this.loadUserChannels();
        }
      }.bind(this)
    );
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
