<template>
  <div v-if="channelTemplate" class="channel-template">
    <el-breadcrumb style="margin-top:20px;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>节点</el-breadcrumb-item>
    </el-breadcrumb>
    <h1>{{ channelTemplate.name }}</h1>
    <p>{{ channelTemplate.desc }}</p>
    <div v-if="channelTemplate.keyName">
      <div style="margin-top:30px;">
        <el-input
          v-bind:placeholder="'请输入' + channelTemplate.keyName"
          v-model="keyword"
          clearable
          prefix-icon="el-icon-search"
          v-on:change="search(keyword)"
        />
      </div>
      <div v-if="advices.length">
        <p class="not-importent">建议</p>
        <!-- <div v-for="advice in advices" v-bind:key="advice">
          <button v-on:click="search(advice)">{{ advice }}</button>
        </div> -->
        <div
          v-for="advice in advices"
          v-bind:key="advice"
          v-on:click="search(advice)"
          class="padding-box channel flex-start"
        >
          <ChannelTemplateLogo
            v-bind:main-color="channelTemplate.mainColor"
            v-bind:text="channelTemplate.name.substr(0, 1)"
          />
          <div>
            <div>
              <a>
                {{ advice }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChannelTemplateLogo from "./ChannelTemplateLogo";
export default {
  name: "ChannelTemplate",
  props: ["id"],
  data: function() {
    return {
      channelTemplate: null,
      advices: [],
      keyword: "",
    };
  },
  components: { ChannelTemplateLogo },
  mounted: function() {
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
    search: function(key) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
      });
      this.cloud
        .callFunction({
          name: "resolveTyChannel",
          data: {
            templateId: this.channelTemplate._id,
            key,
          },
        })
        .then((res) => {
          loading.close();
          if (!res.result.errCode) {
            this.$router.push("/channel/" + res.result.channel._id);
          } else {
            if (res.result.errCode == 405) {
              this.advices = res.result.advices;
            } else {
              this.$message({
                message: res.result.errMsg,
                type: "warning",
              });
            }
          }
        })
        .catch((err) => {
          loading.close();
          console.error(err);
          this.$message({
            message: "操作失败，请稍后重试",
            type: "warning",
          });
        });
    },
  },
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
