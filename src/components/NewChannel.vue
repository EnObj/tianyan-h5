<template>
  <div v-if="document">
    <h1>{{ document.title }}</h1>
    <div v-for="item in document.list" v-bind:key="item.insideId">
      <div v-if="item.type == 'text' || item.type == 'div'" v-bind:style="{paddingLeft:item.depth*20 + 'px'}">
        <input
          type="checkbox"
          v-bind:id="item.insideId"
          v-bind:value="item.selector"
          v-model="checkedSelectors"
        />
        <label v-bind:for="item.insideId">{{
          item.type == "text" ? item.content : ">>"
        }}</label>
      </div>
    </div>
    <button v-on:click="submit">确定</button>
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
      })
      .catch((err) => {
        console.error(err);
      });
  },
  methods: {
    submit: function () {
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
          if (!res.result.errCode) {
            this.$router.replace("/channel/" + res.result.channel._id);
          } else {
            alert(res.result.errMsg);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>