<template>
  <div class="main">
    <el-breadcrumb style="margin-top: 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>探索</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin: 20px 0" @click="$router.push('/search')">
      <el-input
        placeholder="搜索你关心的人"
        clearable
        prefix-icon="el-icon-search"
      />
    </div>
    <div class="popular-channels">
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
  name: "Explore",
  data() {
    return {
      popularChannels: [], // 最受欢迎的频道
    };
  },
  components: {
    ChannelCardVue,
  },
  async created() {
    const { data: channels } = await this.cloud
      .database()
      .collection("ty_channel")
      .where({ userChannelCount: this.cloud.database().command.gt(1) })
      .orderBy("userChannelCount", "desc")
      .limit(20)
      .get();
    this.popularChannels = channels;
  },
  methods: {},
};
</script>

<style scoped>
.main {
  padding: 0px;
  /* min-height: 50vh; */
}

.logo {
  text-align: center;
  font-size: 30px;
  font-weight: 900px;
  color: #333;
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