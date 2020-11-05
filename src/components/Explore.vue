<template>
  <div class="main">
    <h1>探索</h1>
    <!-- <div class="inp"> -->
    <!-- <input class="inp"
          v-on:keyup.enter="search($event.target.value)"
          placeholder="输入你关心的人"
        /> -->
    <el-input
      placeholder="输入你关心的人"
      v-model="keyword"
      clearable
      prefix-icon="el-icon-search"
      v-on:change="search(keyword)"
    />
    <!-- </div> -->
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
      this.$router.push({ path: "/search", query: { keyword } });
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