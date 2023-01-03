<template>
  <div>
    <div class="flex-between">
      <h1 class="logo"></h1>
      <div class="btns">
        <el-button
          icon="el-icon-search"
          circle
          @click="$router.push('/search')"
        ></el-button>
        <el-badge is-dot v-bind:hidden="!lastUnreadedMessage">
          <el-button
            icon="el-icon-s-comment"
            circle
            @click="$router.push('/message-box')"
          ></el-button>
        </el-badge>
        <el-button
          icon="el-icon-user-solid"
          circle
          @click="$router.push('/cloud')"
        ></el-button>
      </div>
    </div>
    <div v-if="userChannels.length" class="mt-4">
      <div class="not-importent">我的订阅</div>
      <div
        v-for="userChannel in userChannels"
        v-bind:key="userChannel._id"
      >
        <div v-on:click="openChannel(userChannel)">
          <ChannelCardVue
            :channel="userChannel.channel"
            :showBadge="
              userChannel.channelDataMessage &&
              !userChannel.channelDataMessage.readed
            "
            :showNotify="userChannel.notify"
            :showStar="userChannel.top"
          ></ChannelCardVue>
        </div>
      </div>
    </div>
    <div v-else-if="userChannelsLoaded">
      <div class="empty-tip abs-center">
        <div
          class="abs-center-content flex-start"
          style="flex-direction: column"
        >
          <p class="nothing not-importent mb-2">还没有任何订阅</p>
          <el-button type="primary" round v-on:click="$router.push('/search')"
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
import ChannelCardVue from "./ChannelCard.vue";
export default {
  name: "Zhui",
  data: () => {
    return {
      lastUnreadedMessage: null,
    };
  },
  components: {
    ChannelCardVue,
  },
  computed: mapState(["userChannels", "userChannelsLoaded"]),
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 查询最新一条未读消息
      vm.cloud
        .database()
        .collection("ty_user_channel_data_message")
        .where({
          readed: false,
        })
        .orderBy("createTime", "desc")
        .limit(1)
        .get()
        .then((res) => {
          vm.lastUnreadedMessage = res.data[0] || null;
        });
    });
  },
  methods: {
    switchNotify: function (userChannelId) {
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
.logo {
  font-weight: bold;
  width: 80px;
  height: 80px;
  background: url("../assets/logo.png") center / 150% auto no-repeat;
  position: relative;
  left: -10px;
}
.btns::v-deep .el-button {
  margin-left: 10px;
}
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  grid-gap: 18px;
}
.user-channel {
  box-sizing: border-box;
  overflow: hidden;
}
.channel-name {
  font-size: 12px;
  color: gray;
  text-align: center;
  margin-top: 5px;
}
.channel-logo-c {
  border-radius: 5px;
  position: relative;
  padding: 50%;
}
.channel-logo {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffde59;
  border-radius: 5px;
  overflow: hidden;
  border-left: 3px solid rgba(0, 0, 0, 0);
  display: flex;
}
.notify {
  font-size: 18px;
  color: #ddd;
  position: absolute;
  right: -5px;
  bottom: -5px;
}
.logo-temp {
  margin: auto;
  font-size: 22px;
  font-weight: 600;
  color: #333;
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
