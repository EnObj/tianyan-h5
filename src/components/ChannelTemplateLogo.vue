<template>
  <div
    class="logo"
    v-bind:style="{
      background: mainColor,
    }"
  >
    <div class="text-logo">
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ChannelTemplateLogo",
  props: {
    text: String,
    mainColor: {
      type: String,
      value: "gray",
    },
  },
};
</script>

<style scoped>
.logo {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: gray;
  padding: 5px;
  display: flex;
  flex: none;
  margin-right: 10px;
}
.text-logo {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin: auto;
}
</style>