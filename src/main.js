import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import VueRouter from "vue-router";
import Zhui from "./components/Zhui.vue";
import Explore from "./components/Explore.vue";
import Search from "./components/Search.vue";
import More from "./components/More.vue";
import Channel from "./components/Channel.vue";
import NewChannel from "./components/NewChannel.vue";
import MessageBox from "./components/MessageBox.vue";
import ChannelPostBox from "./components/ChannelPostBox.vue";
import About from "./components/About.vue";
import ChannelTemplate from "./components/ChannelTemplate.vue";
import cloudbase from "@cloudbase/js-sdk";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/my-style.css";
import CloudUtils from "./components/CloudUtils";
import EoCloud from "./components/EoCloud.vue";

// 链接云服务
const cloud = (Vue.prototype.cloud = cloudbase.init({
  env: process.env.VUE_APP_CLOUD_NAME,
}));
const cloudAuth = (Vue.prototype.cloudAuth = cloud.auth({
  persistence: "local",
}));

// 应用路由插件
Vue.use(VueRouter);
// 应用状态管理器
Vue.use(Vuex);
// 应用UI
Vue.use(ElementUI);

// 过滤器
function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : "0" + n;
}
Vue.filter("formatPass", function(pass) {
  var now = new Date().getTime();
  if (now - pass < 60000) {
    return "刚刚";
  }
  var passDate = new Date(pass);
  var year = passDate.getFullYear();
  var month = passDate.getMonth() + 1;
  var day = passDate.getDate();
  var hour = passDate.getHours();
  var minute = passDate.getMinutes();

  var nowDate = new Date(now);
  var nowYear = nowDate.getFullYear();
  var nowMonth = nowDate.getMonth() + 1;
  var nowDay = nowDate.getDate();

  if (year == nowYear) {
    if (month == nowMonth && day == nowDay) {
      return "今天 " + [hour, minute].map(formatNumber).join(":");
    } else {
      return (
        [month, day].map(formatNumber).join("-") +
        " " +
        [hour, minute].map(formatNumber).join(":")
      );
    }
  }

  return (
    [year, month, day].map(formatNumber).join("-") +
    " " +
    [hour, minute].map(formatNumber).join(":")
  );
});

Vue.config.productionTip = false;

const routes = [
  { path: "/", redirect: "/zhui" },
  { path: "/zhui", component: Zhui },
  { path: "/explore", component: Explore },
  {
    path: "/search",
    component: Search,
    props: (route) => ({ keyword: route.query.keyword }),
  },
  { path: "/more", component: More },
  { path: "/channel/:id", component: Channel, props: true },
  {
    path: "/new-channel",
    component: NewChannel,
    props: (route) => ({ url: route.query.url }),
  },
  { path: "/channel-template/:id", component: ChannelTemplate, props: true },
  { path: "/message-box", component: MessageBox },
  { path: "/channel-post-box/:id", component: ChannelPostBox, props: true },
  { path: "/about", component: About },
  { path: "/cloud", component: EoCloud },
];

const router = new VueRouter({
  routes, // （缩写）相当于 routes: routes
});

// 路由守卫，登录验证
router.beforeEach((to, from, next) => {
  if (to.path !== "/cloud" && !cloudAuth.hasLoginState()) {
    next("/cloud");
  } else {
    next();
  }
});

const store = new Vuex.Store({
  state: {
    userChannels: [],
  },
  getters: {
    userChannelOfChannel(state) {
      return (channelId) => {
        return state.userChannels.find((userChannel) => {
          return userChannel.channel._id == channelId;
        });
      };
    },
  },
  mutations: {
    setUserChannels(state, userChannels) {
      state.userChannels = userChannels.map((userchannel) => {
        userchannel.channelDataMessage = null;
        if (!("top" in userchannel)) {
          userchannel.top = false;
        }
        if (!("notify" in userchannel)) {
          userchannel.notify = false;
        }
        return userchannel;
      });
    },
    setUserChannelDataMessage(
      state,
      { userChannelLocation, userChannelDataMessage }
    ) {
      state.userChannels[
        userChannelLocation
      ].channelDataMessage = userChannelDataMessage;
    },
    deleteUserChannelDataMessage(state, { channelId }) {
      const userChannel = state.userChannels.find((userChannel) => {
        return userChannel.channel._id == channelId;
      });
      if (userChannel) userChannel.channelDataMessage = null;
    },
    setUserChannelNotify(state, { userChannelId, notify }) {
      const userChannel = state.userChannels.find((userChannel) => {
        return userChannel._id == userChannelId;
      });
      userChannel.notify = notify;
    },
    addUserChannel(state, userChannel) {
      state.userChannels.push(userChannel);
    },
    deleteUserChannel(state, userChannelId) {
      state.userChannels = state.userChannels.filter((userChannel) => {
        return userChannel._id != userChannelId;
      });
    },
    userChannelBeTop(state, userChannelId) {
      const userChannelLocation = state.userChannels.findIndex(
        (userChannel) => {
          return userChannel._id == userChannelId;
        }
      );
      const [userChannel] = state.userChannels.splice(userChannelLocation, 1);
      userChannel.top = true;
      state.userChannels.unshift(userChannel);
    },
    userChannelNotTop(state, userChannelId) {
      const userChannelLocation = state.userChannels.findIndex(
        (userChannel) => {
          return userChannel._id == userChannelId;
        }
      );
      const [userChannel] = state.userChannels.splice(userChannelLocation, 1);
      userChannel.top = false;

      const notTopUserChannelLocation = state.userChannels.findIndex(
        (userChannel) => {
          return !userChannel.top;
        }
      );
      state.userChannels.splice(
        notTopUserChannelLocation == -1
          ? state.userChannels.length
          : notTopUserChannelLocation,
        0,
        userChannel
      );
    },
  },
  actions: {
    loadUserChannels({ commit, dispatch }, db) {
      // 加载频道
      return CloudUtils.getAll(
        db
          .collection("ty_user_channel")
          .where({})
          .orderBy("top", "desc")
          .orderBy("updateTime", "desc")
      ).then((list) => {
        commit("setUserChannels", list);
        // 加载消息（异步）
        list.forEach(function(userChannel, index) {
          dispatch("loadUserChannelDataMessage", {
            db,
            channelId: userChannel.channel._id,
            index,
          });
        });
      });
    },
    loadUserChannelDataMessage({ commit }, { db, channelId, index }) {
      return db
        .collection("ty_user_channel_data_message")
        .where({
          "channelData.channel._id": channelId,
        })
        .orderBy("createTime", "desc")
        .limit(1)
        .get()
        .then(function(res) {
          commit("setUserChannelDataMessage", {
            userChannelLocation: index,
            userChannelDataMessage: res.data[0],
          });
        });
    },
    switchUserChannelNotify({ commit, state }, { db, userChannelId }) {
      const userChannel = state.userChannels.find((userChannel) => {
        return userChannel._id == userChannelId;
      });
      const notify = !userChannel.notify;
      commit("setUserChannelNotify", { userChannelId, notify: notify });
      // 更新数据库
      return db
        .collection("ty_user_channel")
        .doc(userChannelId)
        .update({
          notify,
        });
    },
    switchUserChannelTop({ state, commit }, { db, userChannelId }) {
      const userChannel = state.userChannels.find((userChannel) => {
        return userChannel._id == userChannelId;
      });
      const top = !userChannel.top;
      if (top) {
        commit("userChannelBeTop", userChannelId);
      } else {
        commit("userChannelNotTop", userChannelId);
      }
      // 更新数据库
      return db
        .collection("ty_user_channel")
        .doc(userChannelId)
        .update({
          top,
        });
    },
  },
});

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
