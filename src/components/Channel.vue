<template>
  <div class="channel">
    <div v-if="channel">
      <div class="flex-between">
        <h1>
          {{ channel.name }}
        </h1>
        <div style="flex: none">
          <div v-if="!userChannel" key="sub">
            <el-button v-on:click="sub" type="primary" round>订阅</el-button>
          </div>
          <div v-else key="unsub">
            <div>
              <el-button v-on:click="unsub" round> 已订阅 </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-start cells">
        <div class="cell channel-template">
          <div class="cell-icon">
            <router-link
              v-bind:to="'/channel-template/' + channel.channelTemplate._id"
            >
              <i class="el-icon-folder"></i>
            </router-link>
          </div>
          <div class="not-importent">
            {{ channel.channelTemplate.name }}
          </div>
        </div>
        <div class="cell" v-if="channel.openResourceUrl">
          <div class="cell-icon">
            <a v-bind:href="channel.openResourceUrl" target="_blank"
              ><i class="el-icon-link"></i
            ></a>
          </div>
          <div class="not-importent">网页</div>
        </div>
        <div v-if="userChannel" class="notify-switch cell" key="notify">
          <div
            class="cell-icon"
            v-bind:class="{ 'switch-on': userChannel.notify }"
          >
            <div
              v-if="cloudAuth.currentUser.email"
              v-on:click="switchNotify"
            >
              <i class="el-icon-bell"></i>
            </div>
            <div v-else v-on:click="$router.push('/more')">
              <i class="el-icon-bell"></i>
            </div>
          </div>
          <div class="not-importent">通知我</div>
        </div>
        <div v-if="userChannel" class="cell" key="top">
          <div
            class="cell-icon"
            v-bind:class="{ 'switch-on': userChannel.top }"
            v-on:click="switchTop"
          >
            <i class="el-icon-top"></i>
          </div>
          <div class="not-importent">置顶</div>
        </div>
      </div>
      <el-divider content-position="left"
        ><i class="el-icon-time"></i
      ></el-divider>
      <div class="channel-datas">
        <div
          v-for="channelData in channelDatas"
          v-bind:key="channelData._id"
          class="flex-start channel-data"
        >
          <div class="not-importent">
            <span>{{ channelData.createTime | formatPass }}</span>
          </div>
          <div class="datas">
            <div
              v-for="attr in channelData.channel.attrs ||
              channelData.channel.channelTemplate.attrs"
              v-bind:key="attr.name"
            >
              <span>{{ attr.name }}</span>
              <span class="not-importent data-value">{{
                channelData.data[attr.name]
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Channel",
  props: ["id"],
  data: function () {
    return {
      channel: null,
      channelDatas: [],
    };
  },
  computed:{
    userChannel(){
      return this.$store.getters.userChannelOfChannel(this.id)
    }
  },
  watch: {
    id: function () {
      this.initChannel();
    },
  },
  created: function () {
    this.initChannel();
  },
  methods: {
    initChannel() {
      const db = this.cloud.database();
      // 加载channel
      db.collection("ty_channel")
        .doc(this.id)
        .get()
        .then((res) => {
          this.channel = res.data[0];
        });
      // 更新用户频道下的消息为已读
      db.collection("ty_user_channel_data_message")
        .where({
          "channelData.channel._id": this.id,
        })
        .update({
          readed: true,
        }).then(()=>{
          this.$store.commit('deleteUserChannelDataMessage', {channelId: this.id})
        })
      // 当前渠道下的所有等待通知的消息标记为skip
      db.collection("ty_user_channel_data_message")
        .where({
          "channelData.channel._id": this.id,
          notify: "wait",
        })
        .update({
          data: {
            notify: "skip",
          },
        });
      // 加载channelData
      db.collection("ty_channel_data")
        .where({
          "channel._id": this.id,
          dataChanged: true,
        })
        .orderBy("createTime", "desc")
        .limit(20)
        .get()
        .then((res) => {
          this.channelDatas = res.data;
        });
    },
    sub: function () {
      console.log("sub");
      this.cloud
        .database()
        .collection("ty_user_channel")
        .add({
          channel: this.channel,
          notify: false,
          createTime: Date.now(),
        })
        .then((res) => {
          this.cloud
            .database()
            .collection("ty_user_channel")
            .doc(res.id)
            .get()
            .then((res) => {
              this.$store.commit('addUserChannel', res.data[0])
            });
        });
    },
    unsub: function () {
      console.log("unsub");
      this.cloud
        .database()
        .collection("ty_user_channel")
        .doc(this.userChannel._id)
        .remove()
        .then(() => {
          this.$store.commit('deleteUserChannel', this.userChannel._id)
        });
    },
    switchNotify: function () {
      if (this.userChannel) {
        this.$store.dispatch('switchUserChannelNotify', {db: this.cloud
          .database(), userChannelId: this.userChannel._id})
      }
    },
    switchTop: function () {
      if (this.userChannel) {
        this.$store.dispatch('switchUserChannelTop', {db: this.cloud
          .database(), userChannelId: this.userChannel._id})
      }
    },
  },
};
</script>

<style scoped>
.channel {
  padding: 0px;
}
.cells {
  margin: 0;
}
.cell {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 15px;
}
.cell-icon {
  font-size: 30px;
  color: #aaa;
  border-radius: 5px;
  background: #eee;
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
  line-height: 50px;
}
.switch-on {
  color: #008cba;
}
.channel-data {
  margin: 15px 0;
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
.channel-datas {
  margin: 20px 0;
}
</style>