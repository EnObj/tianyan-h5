<template>
  <div>
    <input
      v-bind:value="keyword"
      v-on:keyup.enter="
        $router.replace({ query: { keyword: $event.target.value } })
      "
    />
    <p>已收录</p>
    <div v-for="channel in channels" v-bind:key="channel._id">
      <router-link v-bind:to="'/channel/' + channel._id"
        >{{ channel.name }}-{{ channel.channelTemplate.name }}</router-link
      >
    </div>
    <p>建议</p>
    <div v-for="maybeChannel in maybeChannels" v-bind:key="maybeChannel._id">
      {{ maybeChannel.name }}-{{ maybeChannel.channelTemplate.name }}
      <button
        v-on:click="
          openMaybeChannel(
            maybeChannel.maybeChannel,
            channel.channelTemplate._id
          )
        "
      >
        打开
      </button>
    </div>
    <div v-show="showNewChannelDoor">
      <p>定制</p>
      <div>
        <router-link
          v-bind:to="{ path: '/new-channel', query: { url: keyword } }"
          >{{ keyword }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import CloudUtils from "./CloudUtils";
export default {
  name: "Search",
  props: ["keyword"],
  data: function () {
    return {
      templates: [],
      channels: [],
      maybeChannels: [],
      finishedSearchCount: 0,
      showNewChannelDoor: false,
    };
  },
  mounted() {
    CloudUtils.getAll(
      this.cloud.database().collection("ty_channel_template").where({})
    ).then((templates) => {
      this.templates = templates;
      // 尝试一次搜索
      if (this.keyword) {
        this.search(this.keyword);
      }
    });
  },
  watch: {
    keyword: function (nVal) {
      if (nVal) {
        this.search(nVal);
      }
    },
  },
  methods: {
    search(keyword) {
      console.log("搜索：" + keyword);
      if (/^https?:\/\//.test(keyword)) {
        this.showNewChannelDoor = true;
      }
      this.channels = [];
      this.maybeChannels = [];
      this.finishedSearchCount = 0;
      // 分发查询
      this.templates.forEach((template) => {
        this.cloud
          .callFunction({
            name: "resolveTyChannel",
            data: {
              templateId: template._id,
              key: keyword,
            },
          })
          .then((res) => {
            this.finishedSearchCount++;
            if (!res.result.errCode) {
              this.channels = this.channels.concat([res.result.channel]);
            } else {
              // 处理405建议：
              if (res.result.errCode == 405) {
                this.maybeChannels = this.maybeChannels.concat(
                  res.result.advices.map((advice) => {
                    return {
                      name: `${advice}`,
                      channelTemplate: template,
                    };
                  })
                );
              } else {
                console.error(res.result.errMsg);
              }
            }
          })
          .catch((err) => {
            this.finishedSearchCount++;
            console.error(err);
          });
      });
    },
    openMaybeChannel: function (keyword, templateId) {
      this.cloud
        .callFunction({
          name: "resolveTyChannel",
          data: {
            templateId,
            key: keyword,
          },
        })
        .then((res) => {
          if (!res.result.errCode) {
            this.$router.push("/channel/" + res.result.channel._id);
          } else {
            console.error(res.result.errMsg);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>