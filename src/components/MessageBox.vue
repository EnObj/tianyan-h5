<template>
  <div class="message-box" style="overflow:auto">
    <h1>消息列表</h1>
    <div
      v-for="message in messages"
      v-bind:key="message._id"
      class="flex-start message"
    >
      <ChannelTemplateLogo
        v-bind:main-color="
          message.channelData.channel.channelTemplate.mainColor
        "
        v-bind:text="
          message.channelData.channel.channelTemplate.name.substr(0, 1)
        "
      />
      <div class="flex-start channel-data">
        <el-link v-on:click="$router.push('/channel/' + message.channelData.channel._id)" type="primary">{{ message.channelData.channel.name }}</el-link>
        <div class="not-importent">
          <span>{{ message.createTime | formatPass }}</span>
        </div>
        <div class="datas">
          <div
            v-for="attr in message.channelData.channel.attrs ||
            message.channelData.channel.channelTemplate.attrs"
            v-bind:key="attr.name"
            class="data"
          >
            <span>{{ attr.name }}</span>
            <span class="not-importent data-value">{{
              message.channelData.data[attr.name]
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-show="more" class="load-more">
      <el-link v-on:click="loadMessages(messages)" type="primary">加载更多</el-link>
    </div>
    <div class="nothing not-importent" v-show="loaded && !messages.length">
      啥也没有
    </div>
  </div>
</template>

<script>
import ChannelTemplateLogo from "./ChannelTemplateLogo";
export default {
  name: "MessageBox",
  data: function () {
    return {
      messages: [],
      loaded: false,
      more: false,
      pageSize: 20,
    };
  },
  components: { ChannelTemplateLogo },
  mounted: function () {
    this.loadMessages();

    // 全部已读
    this.cloud
      .callFunction({
        name: "readAllTyUserMessage",
      })
      .then((res) => {
        console.log(res.result);
      });
  },
  methods: {
    loadMessages(messages = []) {
      this.cloud
        .database()
        .collection("ty_user_channel_data_message")
        .where({})
        .orderBy("createTime", "desc")
        .skip(messages.length)
        .limit(this.pageSize)
        .get()
        .then((res) => {
          this.messages = messages.concat(res.data);
          (this.more = res.data.length == this.pageSize), (this.loaded = true);
        });
    },
  },
};
</script>

<style scoped>
.message-box {
  padding: 0;
}
.channel-data {
  flex-direction: column;
  align-items: flex-start;
}

.datas {
  margin-top: 5px;
  background: #f6f6f6;
  word-break: break-all;
  border-radius: 15px;
  padding: 15px;
}

.data-value {
  margin-left: 5px;
}
.message {
  align-items: flex-start;
  margin: 15px 0;
}
.data-value {
  margin-left: 5px;
}
.nothing{
  margin-top: 25vh;
  text-align: center;
}
.load-more{
  text-align: center;
  margin: 20px 0;
}
</style>