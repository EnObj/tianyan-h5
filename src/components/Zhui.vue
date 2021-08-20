<template>
  <div>
    <div class="flex-between">
      <h1>爱追更</h1>
      <div>
        <el-button
          icon="el-icon-search"
          circle
          @click="$router.push('/explore')"
        ></el-button>
        <el-button
          icon="el-icon-message-solid"
          circle
          @click="$router.push('/message-box')"
        ></el-button>
        <el-button
          icon="el-icon-user-solid"
          circle
          @click="$router.push('/cloud')"
        ></el-button>
      </div>
    </div>
    <div v-if="userChannels.length" class="user-channels">
      <div
        v-for="userChannel in userChannels"
        v-bind:key="userChannel._id"
        v-on:click="openChannel(userChannel)"
        class="user-channel padding-box flex-between"
        v-bind:style="{
          borderLeftColor:
            userChannel.channel.channelTemplate.mainColor || 'gray',
        }"
      >
        <div class="flex-start" style="flex: auto; overflow: hidden">
          <div class="channel-name no-wrap">
            {{ userChannel.channel.name }}
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
            v-on:click.stop="switchNotify(userChannel._id)"
          >
            <i class="el-icon-bell"></i>
          </div>
          <div v-else v-on:click.stop="$router.push('/cloud')">
            <i class="el-icon-bell">请登录</i>
          </div>
        </div>
        <div class="top" v-if="userChannel.top"></div>
      </div>
    </div>
    <div v-else-if="userChannelsLoaded">
      <div class="empty-tip abs-center">
        <div
          class="abs-center-content flex-start"
          style="flex-direction: column"
        >
          <p class="nothing not-importent">还没有任何订阅</p>
          <el-button type="primary" round v-on:click="$router.push('/explore')"
            >探索</el-button
          >
        </div>
      </div>
      <div class="not-importent flex-around">
        <el-link v-on:click="$router.push('/about')" type="primary"
          >“爱追更”是什么？</el-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Zhui",
  data: () => {
    return {};
  },
  computed: mapState(["userChannels", "userChannelsLoaded"]),
  methods: {
    switchNotify: function(userChannelId) {
      this.$store.dispatch("switchUserChannelNotify", {
        db: this.cloud.database(),
        userChannelId: userChannelId,
      });
    },
    openChannel(userChannel) {
      // 清空消息标记
      userChannel.channelDataMessage = null;
      this.$router.push("/channel/" + userChannel.channel._id);
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
  padding: 0;
}
.user-channel {
  max-width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border-left: gray 10px solid;
  border-radius: 10px;
  padding: 15px 10px;
  margin: 10px 0;
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
  color: #409eff;
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
.top {
  position: absolute;
  right: -11px;
  top: -11px;
  width: 20px;
  height: 20px;
  transform: rotate(45deg);
  background: #aaa;
}
</style>
