<template>
  <div v-if="channelTemplate">
    <h1>{{ channelTemplate.name }}</h1>
    <p>{{ channelTemplate.desc }}</p>
    <div v-if="channelTemplate.keyName">
      <input
        v-bind:placeholder="'请输入' + channelTemplate.keyName"
        v-on:keyup.enter="search($event.target.value)"
      />
      <div v-for="advice in advices" v-bind:key="advice">
        建议：<button v-on:click="search(advice)">{{ advice }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChannelTemplate",
  props: ["id"],
  data: function () {
    return {
      channelTemplate: null,
      advices: [],
    };
  },
  mounted: function () {
    const db = this.cloud.database();
    // 加载channel
    db.collection("ty_channel_template")
      .doc(this.id)
      .get()
      .then((res) => {
        this.channelTemplate = res.data[0];
      });
  },
  methods: {
    search: function (key) {
      this.cloud
        .callFunction({
          name: "resolveTyChannel",
          data: {
            templateId: this.channelTemplate._id,
            key,
          },
        })
        .then((res) => {
          if (!res.result.errCode) {
            this.$router.push("/channel/" + res.result.channel._id);
          } else {
            if (res.result.errCode == 405) {
              this.advices = res.result.advices;
            } else {
              alert(res.result.errMsg);
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>