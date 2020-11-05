<template>
  <div v-if="document" class="new-channel">
    <h1>{{ document.title }}</h1>
    <div
      v-for="item in textAndDivList"
      v-bind:key="item.insideId"
      v-bind:style="{ paddingLeft: item.depth * 20 + 'px' }"
      class="item"
    >
      <input
        type="checkbox"
        v-bind:id="item.insideId"
        v-bind:value="item.selector"
        v-model="checkedSelectors"
      />
      <label v-bind:for="item.insideId">
        {{ item.type == "text" ? item.content : ">>" }}</label
      >
    </div>
    <div style="margin: 15px 0">
      <el-button type="primary" round v-on:click="submit">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewChannel",
  props: ["url"],
  data: function () {
    return {
      document: null,
      checkedSelectors: [],
    };
  },
  mounted: function () {
    const loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
    });
    this.cloud
      .callFunction({
        name: "loadWebDocument",
        data: {
          url: this.url,
        },
      })
      .then((res) => {
        if (res.result.errCode) {
          alert(res.result.errMsg);
        } else {
          let depth = 0;
          res.result.document.list.forEach((item) => {
            item.depth = depth;
            if (item.type == "div") {
              depth++;
            } else if (item.type == "/div") {
              depth--;
            }
          });
          this.document = res.result.document;
        }
        loading.close();
      })
      .catch((err) => {
        loading.close();
        console.error(err);
      });
  },
  computed: {
    textAndDivList: function () {
      return this.document.list.filter((item) => {
        return item.type == "text" || item.type == "div";
      });
    },
  },
  methods: {
    submit: function () {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
      });
      this.cloud
        .callFunction({
          name: "resolveTyChannel",
          data: {
            templateId: "other",
            resource: {
              resourceUrl: this.document.url,
              channelName: this.document.title,
              openResourceUrl: this.document.url,
              attrs: this.checkedSelectors.map((selector, index) => {
                return {
                  path: selector,
                  name: `追更数据${index + 1}`,
                };
              }),
            },
          },
        })
        .then((res) => {
          loading.close();
          if (!res.result.errCode) {
            this.$router.replace("/channel/" + res.result.channel._id);
          } else {
            alert(res.result.errMsg);
          }
        })
        .catch((err) => {
          loading.close();
          console.error(err);
        });
    },
  },
};
</script>

<style scoped>
.new-channel {
  padding: 0;
}
.item {
  word-break: break-all;
}
</style>