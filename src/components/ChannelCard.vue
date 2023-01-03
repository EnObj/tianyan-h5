<!--频道卡片，比如搜索结果-->
<template>
  <div class="channle-card flex items-center p-4 bg-gray-100 my-2 rounded-lg cursor-pointer hover:bg-gray-200">
    <div class="channel flex-auto flex items-center">
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
    <div class="flex-none flex">
      <div v-if="showNotify" class="m-1">
        <i class="el-icon-message-solid"></i>
      </div>
      <div v-if="showStar" class="m-1">
        <i class="el-icon-star-on"></i>
      </div>
    </div>
  </div>
</template>

<script>
import ChannelTemplateLogo from "./ChannelTemplateLogo.vue";
export default {
  props: ["channel", "showBadge", "showStar", "showNotify"],
  components: {
    ChannelTemplateLogo,
  },
};
</script>