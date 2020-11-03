<template>
  <div>
    <h1>消息列表</h1>
    <div v-for="message in messages" v-bind:key="message._id">
      <router-link v-bind:to="'/channel/' + message.channelData.channel._id"
        >{{ message.channelData.channel.name }}-{{
          message.channelData.channel.channelTemplate.name
        }}</router-link
      >
      <div>
        <span>{{ message.createTime | formatPass }}</span>
      </div>
      <div
        v-for="attr in message.channelData.channel.attrs ||
        message.channelData.channel.channelTemplate.attrs"
        v-bind:key="attr.name"
      >
        <span>{{ attr.name }}</span>
        <span>{{ message.channelData.data[attr.name] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageBox",
  data: function () {
    return {
      messages: [],
    };
  },
  mounted: function () {
    this.cloud
      .database()
      .collection("ty_user_channel_data_message")
      .where({})
      .orderBy("createTime", "desc")
      .limit(20)
      .get()
      .then((res) => {
        this.messages = res.data;
      });

    // 全部已读
    this.cloud
      .callFunction({
        name: "readAllTyUserMessage",
      })
      .then((res) => {
        console.log(res.result);
      });
  },
};
</script>