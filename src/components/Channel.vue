<template>
  <div class="channel">
    <div v-if="channel">
      <h1>
        {{ channel.name }}
      </h1>
      <div class="flex-start cells">
        <div class="cell channel-template">
          <div class="cell-icon">
            <router-link
              v-bind:to="'/channel-template/' + channel.channelTemplate._id"
            >
              <i class="fi-folder"></i>
            </router-link>
          </div>
          <div class="not-importent">
            {{ channel.channelTemplate.name }}
          </div>
        </div>
        <div class="cell" v-if="channel.openResourceUrl">
          <div class="cell-icon">
            <a v-bind:href="channel.openResourceUrl" target="_blank"
              ><i class="fi-link"></i
            ></a>
          </div>
          <div class="not-importent">网页</div>
        </div>
        <div v-if="userChannel" class="notify-switch cell">
          <div
            class="cell-icon"
            v-bind:class="{ 'notify-switch-on': userChannel.notify }"
          >
            <div
              v-if="cloudAuth.currentUser.email"
              v-on:click="
                userChannel.notify = !userChannel.notify;
                switchNotify();
              "
            >
              <i class="fi-mail"></i>
            </div>
            <div v-else v-on:click="$router.push('/more')">
              <i class="fi-mail"></i>
            </div>
          </div>
          <div class="not-importent">通知我</div>
        </div>
      </div>
      <div>
        <div v-if="!userChannel">
          <button v-on:click="sub" class="button small expand">订阅</button>
        </div>
        <div v-else>
          <div>
            <button v-on:click="unsub" class="button secondary small expand">
              已订阅
            </button>
          </div>
        </div>
      </div>
      <div v-for="channelData in channelDatas" v-bind:key="channelData._id">
        <div>
          <span>{{ channelData.createTime | formatPass }}</span>
        </div>
        <div
          v-for="attr in channelData.channel.attrs ||
          channelData.channel.channelTemplate.attrs"
          v-bind:key="attr.name"
        >
          <span>{{ attr.name }}</span>
          <span>{{ channelData.data[attr.name] }}</span>
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
      userChannel: null,
      channelDatas: [],
    };
  },
  watch: {
    "userChannel.notify": function (nVal) {
      if (this.userChannel) {
        this.cloud
          .database()
          .collection("ty_user_channel")
          .doc(this.userChannel._id)
          .update({
            notify: nVal,
          });
      }
    },
  },
  mounted: function () {
    const db = this.cloud.database();
    // 加载channel
    db.collection("ty_channel")
      .doc(this.id)
      .get()
      .then((res) => {
        this.channel = res.data[0];
      });
    // 加载用户channel
    db.collection("ty_user_channel")
      .where({
        "channel._id": this.id,
      })
      .get()
      .then((res) => {
        this.userChannel = res.data[0] || null;
        // 更新用户频道下的消息为已读
        db.collection("ty_user_channel_data_message")
          .where({
            "channelData.channel._id": this.id,
          })
          .update({
            readed: true,
          });
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
  methods: {
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
              this.userChannel = res.data[0];
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
          this.userChannel = null;
        });
    },
    switchNotify: function () {
      if (this.userChannel) {
        this.cloud
          .database()
          .collection("ty_user_channel")
          .doc(this.userChannel._id)
          .update({
            notify: this.userChannel.notify,
          });
      }
    },
  },
};
</script>

<style scoped>
.channel {
  padding: 15px;
}
.cells {
  margin: 20px 0;
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
.notify-switch-on {
  color: #008cba;
}
</style>