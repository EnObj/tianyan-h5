<template>
  <div class="search">
    <div class="inp">
      <el-input
        placeholder="输入你关心的人"
        v-model="keywordVal"
        clearable
        prefix-icon="el-icon-search"
        v-on:change="$router.replace({ query: { keyword: keywordVal } })"
      />
    </div>
    <div
      style="margin-bottom: 20px"
      v-show="searchProgress != 0 && searchProgress != 100"
    >
      <el-progress
        v-bind:percentage="searchProgress"
        v-bind:show-text="false"
        v-bind:stroke-width="3"
      ></el-progress>
    </div>
    <div v-show="channels.length">
      <div class="not-importent">已收录</div>
      <div
        v-for="channel in channels"
        v-bind:key="channel._id"
        v-on:click="$router.push('/channel/' + channel._id)"
        class="padding-box channel flex-start"
      >
        <ChannelTemplateLogo
          v-bind:main-color="channel.channelTemplate.mainColor"
          v-bind:text="channel.channelTemplate.name.substr(0, 1)"
        />
        <div>
          <div>
            {{ channel.name }}
          </div>
          <div class="not-importent">{{ channel.channelTemplate.name }}</div>
        </div>
      </div>
    </div>
    <div v-show="maybeChannels.length">
      <div class="not-importent">建议</div>
      <div
        v-for="maybeChannel in maybeChannels"
        v-bind:key="maybeChannel._id"
        v-on:click="
          openMaybeChannel(maybeChannel.name, maybeChannel.channelTemplate._id)
        "
        class="padding-box channel flex-start"
      >
        <ChannelTemplateLogo
          v-bind:main-color="maybeChannel.channelTemplate.mainColor"
          v-bind:text="maybeChannel.channelTemplate.name.substr(0, 1)"
        />
        <div>
          <div>
            <a>
              {{ maybeChannel.name }}
            </a>
          </div>
          <div class="not-importent">
            {{ maybeChannel.channelTemplate.name }}
          </div>
        </div>
      </div>
    </div>
    <div v-show="showNewChannelDoor">
      <div class="not-importent">定制</div>
      <div class="padding-box channel flex-start" style="word-break: break-all">
        <ChannelTemplateLogo v-bind:text="'链'" />
        <div
          v-on:click="
            $router.push({ path: '/new-channel', query: { url: keyword } })
          "
        >
          {{ keyword }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CloudUtils from "./CloudUtils";
import ChannelTemplateLogo from "./ChannelTemplateLogo";
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
      keywordVal: this.keyword
    };
  },
  components: { ChannelTemplateLogo },
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
  computed: {
    searchProgress() {
      if (this.templates.length) {
        return Math.floor(
          (this.finishedSearchCount / this.templates.length) * 100
        );
      }
      return 0;
    },
  },
  methods: {
    search(keyword) {
      console.log("搜索：" + keyword);
      this.showNewChannelDoor = false;
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

<style scoped>
.search {
  padding: 0px;
}
.channel {
  margin: 10px 0;
}
.inp {
  margin-bottom: 20px;
}
</style>