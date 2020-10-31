<template>
  <div>
    <input v-model="keyword" v-on:keyup.enter="submit" />
    <p>已收录</p>
    <div v-for="channel in channels" v-bind:key="channel._id">
      <router-link v-bind:to="'/channel/' + channel._id"
        >{{ channel.name }}-{{ channel.channelTemplate.name }}</router-link
      >
    </div>
    <p>建议</p>
    <div v-for="channel in maybeChannels" v-bind:key="channel._id">
      {{ channel.name }}-{{ channel.channelTemplate.name }}
      <button
        v-on:click="openChannel(channel.name, channel.channelTemplate._id)"
      >
        打开
      </button>
    </div>
  </div>
</template>

<script>
import CloudUtils from "./CloudUtils";
export default {
  name: "Explore",
  data: function () {
    return {
      keyword: "",
      templates: [],
      channels: [],
      maybeChannels: [],
      showNewChannelDoor: false,
      finishedSearchCount: 0,
    };
  },
  mounted() {
    CloudUtils.getAll(
      this.cloud.database().collection("ty_channel_template").where({})
    ).then((templates) => {
      this.templates = templates;
    });
  },
  methods: {
    submit() {
      if (/^https?:\/\//.test(this.keyword)) {
        this.setData({
          showNewChannelDoor: true,
        });
      }
      // 分发查询
      this.templates.forEach((template) => {
        this.cloud
          .callFunction({
            name: "resolveTyChannel",
            data: {
              templateId: template._id,
              key: this.keyword,
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
    openChannel: function (keyword, templateId) {
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