<template>
  <div>
    <div v-if="userChannels.length" class="user-channels">
      <div
        v-for="userChannel in userChannels"
        v-bind:key="userChannel._id"
        class="user-channel padding-box flex-between"
        v-bind:style="{
          borderLeftColor:
            userChannel.channel.channelTemplate.mainColor || 'gray',
        }"
      >
        <div class="flex-start" style="flex: auto; overflow: hidden">
          <div class="channel-name no-wrap">
            <router-link v-bind:to="'/channel/' + userChannel.channel._id">{{
              userChannel.channel.name
            }}</router-link>
          </div>
          <div
            v-if="userChannel.channelDataMessage"
            v-show="!userChannel.channelDataMessage.readed"
            class="unreaded"
            v-bind:style="{
              background:
                userChannel.channel.channelTemplate.mainColor || 'gray',
            }"
          >
            <span>新</span>
          </div>
        </div>
        <div
          style="flex: none"
          class="notify"
          v-bind:class="{ 'notify-on': userChannel.notify }"
        >
          <div
            v-if="cloudAuth.currentUser.email"
            v-on:click="
              userChannel.notify = !userChannel.notify;
              switchNotify(userChannel._id, userChannel.notify);
            "
          >
            <i class="fi-mail"></i>
          </div>
          <div v-else v-on:click="$router.push('/sign-in')">
            <i class="fi-mail">请登录</i>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="showExplore">
      <div class="empty-tip abs-center">
        <div
          class="abs-center-content flex-start"
          style="flex-direction: column"
        >
          <p class="nothing not-importent">还没有任何订阅</p>
          <div class="door">
            <router-link to="/explore" style="color: #fff">探索</router-link>
          </div>
        </div>
      </div>
      <div class="not-importent flex-around">
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
      showExplore: false,
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
      this.showExplore = true;
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
    switchNotify: function (userChannelId, notify) {
      this.cloud
        .database()
        .collection("ty_user_channel")
        .doc(userChannelId)
        .update({
          notify,
        });
    },
  },
};
</script>

<style scoped>
.explore {
  height: 100px;
}
.unreaded {
  padding: 2px 10px;
  background: red;
  border-radius: 10px;
  margin-left: 5px;
  color: white;
  font-size: 10px;
}
.user-channels {
  /* padding: 15px; */
  padding-bottom: 1px;
}
.user-channel {
  max-width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border-left: gray 10px solid;
  border-radius: 10px;
  padding: 15px 10px;
}
.channel-name {
  margin-left: 5px;
}
.notify {
  padding: 0 10px 0 15px;
  font-size: 20px;
  color: #ddd;
}
.notify-on {
  color: #008cba;
}
.channel-template {
  margin-top: 5px;
}

.top {
  /* border-left: 3px #07c160 solid; */
  position: absolute;
  right: -11px;
  top: -11px;
  width: 20px;
  height: 20px;
  transform: rotate(45deg);
  background: #aaa;
}

.empty-tip {
  height: 80vh;
}

.door {
  padding: 10px 30px;
  background: #008cba;
  border-radius: 20px;
  margin-top: 20px;
  color: #fff;
}

.message {
  flex: none;
  margin-left: 10px;
}
</style>