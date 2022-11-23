<!--频道卡片，比如搜索结果-->
<template>
  <div class="channle-card">
    <div
      class="
        p-4
        bg-gray-100
        my-2
        rounded-lg
        channel
        flex-start
        cursor-pointer
        hover:bg-gray-200
      "
    >
      <ChannelTemplateLogo
        v-bind:main-color="channel.channelTemplate.mainColor"
        v-bind:text="channel.channelTemplate.name.substr(0, 1)"
      />
      <div>
        <div>
          <el-badge is-dot :hidden="!showBadge">
            {{ channel.name }}
          </el-badge>
        </div>
        <div class="not-importent">
          {{ channel.channelTemplate.name
          }}<span class="ml-2 gray">{{ channel.userChannelCount }}人订阅</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChannelTemplateLogo from "./ChannelTemplateLogo.vue";
export default {
  props: ["channel", "showBadge"],
  components: {
    ChannelTemplateLogo,
  },
};
</script>