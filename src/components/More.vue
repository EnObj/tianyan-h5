<template>
  <div class="more">
    <div class="main">
      <p>
        <el-badge
          v-bind:value="'新'"
          class="item"
          v-bind:hidden="!lastUnreadedMessage"
        >
          <el-link v-on:click="$router.push('/message-box')" type="primary"
            >消息</el-link
          >
        </el-badge>
      </p>
      <p>
        <el-link
          href="https://support.qq.com/product/290950"
          target="_blank"
          type="primary"
          >反馈</el-link
        >
      </p>
      <p>
        <el-link v-on:click="$router.push('/about')" type="primary"
          >关于</el-link
        >
      </p>
    </div>
    <div class="not-importent to-enobj">
      power by <el-link href="https://enobj.cn" type="info">enobj.cn</el-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "More",
  data: function() {
    return {
      lastUnreadedMessage: null,
    };
  },
  mounted() {
    // 查询最新一条未读消息
    this.cloud
      .database()
      .collection("ty_user_channel_data_message")
      .where({
        readed: false,
      })
      .orderBy("createTime", "desc")
      .limit(1)
      .get()
      .then((res) => {
        this.lastUnreadedMessage = res.data[0] || null;
      });
  },
  methods: {},
};
</script>

<style scoped>
.more {
  /* padding: 15px; */
  text-align: center;
}
.user-head {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  background: #f6f6f6;
  display: flex;
  font-size: 40px;
  margin: 10px auto;
  color: gray;
}
.login-area {
  margin: 20px 0;
}
.main {
  min-height: 80vh;
  margin-top: 20px;
}
</style>
