<template>
  <div>
    <div v-if="channel">
      <h1>{{ channel.name }}-{{ channel.channelTemplate.name }}</h1>
      <div v-if="!userChannel">
        <button v-on:click="sub">订阅</button>
      </div>
      <div v-else>
        <div>
          已订阅
          <button v-on:click="unsub">取消订阅</button>
        </div>
        <div>
          <input
            type="checkbox"
            id="notify-switch"
            v-model="userChannel.notify"
          />
          <label for="notify-switch">邮件通知</label>
        </div>
      </div>
      <div v-show="channel.openResourceUrl">
          <a v-bind:href="channel.openResourceUrl" target="_blank">网页</a>
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
      if(this.userChannel){
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
  },
};
</script>