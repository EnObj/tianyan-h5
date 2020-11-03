<template>
  <div class="main abs-center">
    <div class="abs-center-content" style="flex:auto;">
      <div class="logo">
        <img src="./../assets/explore.png" />
      </div>
      <!-- <div class="inp"> -->
        <input class="inp"
          v-on:keyup.enter="search($event.target.value)"
          placeholder="输入你关心的人"
        />
      <!-- </div> -->
    </div>
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

<style scoped>
.main {
  padding: 30px;
  min-height: 70vh;
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
  margin: 40px auto;
  max-width: 500px;
}
</style>