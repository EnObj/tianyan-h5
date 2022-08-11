<template>
  <div v-if="channel">
    <el-breadcrumb style="margin-top:20px;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/channel/' + channel._id }">{{
        channel.name
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>考古</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="channel-posts">
      <div
        class="channel-post"
        v-for="channelPost in channelPosts"
        :key="channelPost._id"
      >
        <div class="channel-post-time">
          {{ channelPost.postTime | formatPass }}
        </div>
        <div class="channel-post-content">
          <el-link :href="channelPost.openResourceUrl" target="_blank">{{
            channelPost.content
          }}</el-link>
        </div>
      </div>
    </div>
    <div v-show="more" class="load-more">
      <el-link v-on:click="loadChannelPosts(channelPosts)" type="primary"
        >加载更多</el-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "ChannelPostBox",
  props: ["id"],
  data: function() {
    return {
      channelPosts: [],
      channel: null,
      more: false,
    };
  },
  created() {
    this.loadChannelPosts();
  },
  watch: {
    id: "loadChannelPosts",
  },
  methods: {
    loadChannelPosts(channelPosts = []) {
      const loading = this.$loading();
      const pageLimit = 20;
      this.cloud
        .callFunction({
          name: "loadTyChannelPost",
          data: {
            channelId: this.id,
            skip: channelPosts.length,
            limit: pageLimit,
          },
        })
        .then((res) => {
          this.channelPosts = channelPosts.concat(res.result);
          this.more = res.result.length == pageLimit;
          // 关闭loading
          loading.close();
        })
        .catch(() => {
          // 关闭loading
          loading.close();
        });
      const db = this.cloud.database();
      // 加载channel
      db.collection("ty_channel")
        .doc(this.id)
        .get()
        .then((res) => {
          this.channel = res.data[0];
        });
    },
  },
};
</script>

<style scoped>
.channel-post {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.channel-posts{
  margin-top: 20px;
}
.channel-post-time {
  color: gray;
  font-size: 14px;
  margin-bottom: 5px;
}
.channel-post-content {
  background: #eee;
  border-radius: 10px;
  padding: 10px;
}
.load-more {
  text-align: center;
  margin: 20px 0;
}
</style>
