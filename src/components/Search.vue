<template>
  <div class="search">
    <el-breadcrumb style="margin-top: 20px">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/explore' }">探索</el-breadcrumb-item>
      <el-breadcrumb-item>搜索</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="inp">
      <el-input
        placeholder="搜索你关心的人"
        v-model="keyword"
        clearable
        prefix-icon="el-icon-search"
      />
    </div>
    <div class="search-templates flex flex-wrap gap-2 mb-4" v-show="!!keyword">
      <div v-for="template in templates" :key="template._id">
        <el-button
          type="default"
          class="search-template"
          @click="searchByTemplate(template)"
        >
          搜索：{{ template.name }}
        </el-button>
      </div>
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
        v-on:click="$router.push('/channel/' + channel._id)"
        v-for="channel in channels"
        v-bind:key="channel._id"
      >
        <ChannelCardVue :channel="channel" />
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
        class="padding-box channel flex-start cursor-pointer"
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
import ChannelCardVue from "./ChannelCard.vue";
import _ from "lodash";
export default {
  name: "Search",
  data: function () {
    return {
      templates: [],
      channels: [],
      maybeChannels: [],
      finishedSearchCount: 0,
      showNewChannelDoor: false,
      keyword: "",
    };
  },
  components: { ChannelTemplateLogo, ChannelCardVue },
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
      this.searchLocalChannel(nVal);
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
    // 搜索已收录
    searchLocalChannel: _.debounce(async function (name) {
      if (!name) {
        this.channels = [];
        this.maybeChannels = [];
        return;
      }
      // 实时搜索本地库
      const { data: channels } = await this.cloud
        .database()
        .collection("ty_channel")
        .where({ name: new RegExp(name, "i") })
        .limit(20)
        .get();
      console.log(channels);
      this.channels = channels;
    }, 300),
    async searchByTemplate(template) {
      const loading = this.$loading();
      const templateId = template._id;
      this.showSearchByTemplate = false;
      this.channels = [];
      try {
        const { result } = await this.cloud.callFunction({
          name: "resolveTyChannel",
          data: {
            templateId,
            key: this.keyword,
          },
        });
        console.log(result);
        if (!result.errCode && !result.errorCode) {
          this.channels = [result.channel];
        } else {
          // 处理405建议：
          if (result.errCode == 405) {
            this.maybeChannels = result.advices.map((advice) => {
              return {
                name: `${advice}`,
                channelTemplate: template,
              };
            });
          } else {
            console.error(result);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        loading.close();
      }
    },
    search(keyword) {
      const loading = this.$loading();
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
            // 关闭加载遮罩
            if (this.finishedSearchCount == 1) {
              loading.close();
            }
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
            // 关闭加载遮罩
            if (this.finishedSearchCount == 1) {
              loading.close();
            }
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
  margin: 20px 0;
}
</style>