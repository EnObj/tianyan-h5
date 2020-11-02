<template>
  <div>
    <h1>探索</h1>
    <input
      v-on:keyup.enter="search($event.target.value)"
      placeholder="输入关键词"
    />
  </div>
</template>

<script>
export default {
  name: "Explore",
  methods: {
    search: function (keyword) {
      this.$router.push({ path: "/search", query: { keyword } });
    },
  },
};
</script>