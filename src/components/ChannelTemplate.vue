<template>
  <div v-if="channelTemplate" class="channel-template">
    <el-breadcrumb style="margin-top: 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>节点</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 class="my-4 text-lg">{{ channelTemplate.name }}</h1>
    <p>{{ channelTemplate.desc }}</p>
    <div class="popular-channels mt-4" v-show="popularChannels.length">
      <div class="not-importent">最受欢迎</div>
      <div
        class="popular-channel"
        v-for="channel in popularChannels"
        v-on:click="$router.push('/channel/' + channel._id)"
        :key="channel._id"
      >
        <ChannelCardVue :channel="channel"></ChannelCardVue>
      </div>
    </div>
  </div>
</template>

<script>
import ChannelCardVue from "./ChannelCard.vue";
export default {
  name: "ChannelTemplate",
  props: ["id"],
  data: function () {
    return {
      channelTemplate: null,
      advices: [],
      keyword: "",
      popularChannels: [],
    };
  },
  components: { ChannelCardVue },
  async mounted() {
    const db = this.cloud.database();
    // 加载channel模板
    const {
      data: [channelTemplate],
    } = await db.collection("ty_channel_template").doc(this.id).get();
    this.channelTemplate = channelTemplate;

    // 加载模板下最受欢迎频道
    const { data: channels } = await this.cloud
      .database()
      .collection("ty_channel")
      .where({
        "channelTemplate._id": channelTemplate._id,
        userChannelCount: this.cloud.database().command.gt(1),
      })
      .orderBy("userChannelCount", "desc")
      .limit(20)
      .get();
    this.popularChannels = channels;
  },
  methods: {},
};
</script>

<style scoped>
.channel-template {
  padding: 0;
}
.channel {
  margin: 10px 0;
}
.inp {
  display: block;
  border: 2px #aaa solid;
  height: 50px;
  border-radius: 15px;
  margin-top: 30px;
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
}
</style>
