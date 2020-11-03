<template>
  <div>
    <div v-if="userChannels.length">
      <div v-for="userChannel in userChannels" v-bind:key="userChannel._id">
        <router-link v-bind:to="'/channel/' + userChannel.channel._id">{{
          userChannel.channel.name
        }}</router-link
        >-<router-link
          v-bind:to="
            '/channel-template/' + userChannel.channel.channelTemplate._id
          "
          >{{ userChannel.channel.channelTemplate.name }}</router-link
        >
        <div v-if="userChannel.channelDataMessage">
          {{ userChannel.channelDataMessage.createTime | formatPass }}
          <span v-show="!userChannel.channelDataMessage.readed">新</span>
        </div>
        <div>
          <input
            type="checkbox"
            v-bind:id="userChannel._id"
            v-model="userChannel.notify"
            v-bind:disabled="!cloudAuth.currentUser.email"
            v-on:change="switchNotify(userChannel._id, $event)"
          />
          <label v-bind:for="userChannel._id"
            >邮件通知<router-link
              v-show="!cloudAuth.currentUser.email"
              to="/more"
              >（此操作需要登录）</router-link
            ></label
          >
        </div>
      </div>
    </div>
    <div v-else>
      <p>还没有任何订阅</p>
      <div>
        <router-link to="/explore">探索</router-link>
      </div>
      <div>
        <router-link to="/about">“爱追更”是什么？</router-link>
      </div>
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
    const db = this.cloud.database();
    // 加载频道
    CloudUtils.getAll(
      db
        .collection("ty_user_channel")
        .where({})
        .orderBy("top", "desc")
        .orderBy("updateTime", "desc")
    ).then((list) => {
      this.userChannels = list;
      // 加载消息
      this.userChannels.forEach(
        function (userChannel) {
          db.collection("ty_user_channel_data_message")
            .where({
              "channelData.channel._id": userChannel.channel._id,
            })
            .orderBy("createTime", "desc")
            .limit(1)
            .get()
            .then(
              function (res) {
                this.$set(userChannel, `channelDataMessage`, res.data[0]);
              }.bind(this)
            );
        }.bind(this)
      );
    });
  },
  methods: {
    switchNotify: function (userChannelId, event) {
      this.cloud
        .database()
        .collection("ty_user_channel")
        .doc(userChannelId)
        .update({
          notify: event.target.checked,
        });
    },
  },
};
</script>