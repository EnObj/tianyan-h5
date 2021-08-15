<template>
  <div class="main">
    <el-breadcrumb style="margin-top:20px;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>探索</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>探索</h1>
    <el-input
      placeholder="搜索你关心的人"
      v-model="keyword"
      clearable
      prefix-icon="el-icon-search"
      v-on:change="search(keyword)"
    />
  </div>
</template>

<script>
export default {
  name: "Explore",
  data() {
    return {
      keyword: "",
    };
  },
  methods: {
    search: function (keyword) {
      this.$router.replace({ path: "/search", query: { keyword } });
    },
  },
};
</script>

<style scoped>
.main {
  padding: 0px;
  /* min-height: 50vh; */
}

.logo {
  text-align: center;
  font-size: 30px;
  font-weight: 900px;
  color: #333;
}

.inp {
  display: block;
  border: 2px #aaa solid;
  height: 50px;
  border-radius: 15px;
  margin-top: 30px;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
}
</style>