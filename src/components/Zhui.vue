<template>
  <div>
    <p>所有追更</p>
    <div v-for="userChannel in userChannels" v-bind:key="userChannel._id">
      <router-link
        v-bind:to="'/channel/' + userChannel.channel._id"
        >{{ userChannel.channel.name }}-{{userChannel.channel.channelTemplate.name}}</router-link
      >
    </div>
  </div>
</template>

<script>
import CloudUtils from "./CloudUtils";
export default {
  name: "Zhui",
  data: () => {
    return {
      userChannels: [],
    };
  },
  mounted: function () {
    // 加载频道
      CloudUtils.getAll(
        this.cloud
          .database()
          .collection("ty_user_channel")
          .where({})
          .orderBy("top", "desc")
          .orderBy("updateTime", "desc")
      ).then((list) => {
        this.userChannels = list;
      });
  },
};
</script>