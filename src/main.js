import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Zhui from './components/Zhui.vue'
import Explore from './components/Explore.vue'
import Search from './components/Search.vue'
import More from './components/More.vue'
import Channel from './components/Channel.vue'
import NewChannel from './components/NewChannel.vue'
import MessageBox from './components/MessageBox.vue'
import About from './components/About.vue'
import SignIn from './components/SignIn.vue'
import SignUp from './components/SignUp.vue'
import ChannelTemplate from './components/ChannelTemplate.vue'
import cloudbase from "@cloudbase/js-sdk";

// 应用路由插件
Vue.use(VueRouter)

// 过滤器
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
Vue.filter('formatPass', function (pass) {
  var now = new Date().getTime();
  if (now - pass < 60000) {
    return "刚刚"
  }
  var passDate = new Date(pass);
  var year = passDate.getFullYear();
  var month = passDate.getMonth() + 1;
  var day = passDate.getDate();
  var hour = passDate.getHours()
  var minute = passDate.getMinutes()

  var nowDate = new Date(now);
  var nowYear = nowDate.getFullYear();
  var nowMonth = nowDate.getMonth() + 1;
  var nowDay = nowDate.getDate();

  if (year == nowYear) {
    if (month == nowMonth && day == nowDay) {
      return '今天 ' + [hour, minute].map(formatNumber).join(':')
    } else {
      return [month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
    }
  }

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
})

Vue.config.productionTip = false

const routes = [
  { path: '/', redirect: '/zhui' },
  { path: '/zhui', component: Zhui },
  { path: '/explore', component: Explore },
  { path: '/search', component: Search, props: (route) => ({ keyword: route.query.keyword }) },
  { path: '/more', component: More },
  { path: '/channel/:id', component: Channel, props: true },
  { path: '/new-channel', component: NewChannel, props: (route) => ({ url: route.query.url }) },
  { path: '/channel-template/:id', component: ChannelTemplate, props: true },
  { path: '/message-box', component: MessageBox },
  { path: '/about', component: About },
  { path: '/sign-in', component: SignIn },
  { path: '/sign-up', component: SignUp },
]

const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

function signIn() {
  // 链接腾讯云
  const cloud = Vue.prototype.cloud = cloudbase.init({
    env: "dev-9g0suwuw61afb9f3",
  })
  const cloudAuth = Vue.prototype.cloudAuth = cloud.auth({
    persistence: 'local'
  })
  // 避免重复登录
  if (cloudAuth.hasLoginState()) {
    console.log('无需重复登录')
    return Promise.resolve()
  }
  return cloudAuth.anonymousAuthProvider()
    .signIn()
    .then((item) => {
      console.log("登录成功", item);
      return Promise.resolve()
    })
    .catch((error) => {
      console.error("登录失败", error);
      return Promise.reject();
    });
}

signIn().then(() => {
  // 链接成功后再实例化app
  new Vue({
    render: h => h(App),
    router
  }).$mount('#app')
})
