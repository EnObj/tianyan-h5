<template>
  <div>
    <div>
      <div v-if="!user || user.loginType == 'ANONYMOUS'">
        <div v-if="user">
          <span>游客</span>
        </div>
        <button v-on:click="signIn">点击登录</button>
        <button v-on:click="signUp">点击注册</button>
      </div>
      <div v-else>
        <span>账户{{ user.uid }}</span>
      </div>
    </div>
    <p>
      <router-link to="/message-box">消息</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: "More",
  data: function () {
    return {
      user: this.cloudAuth.currentUser,
    };
  },
  methods: {
    signIn: function () {
      const email = prompt("请输入邮箱");
      const password = prompt("请输入密码");
      this.cloudAuth
        .signInWithEmailAndPassword(email, password)
        .then((item) => {
          console.log("登录成功", item);
          this.user = item.user;
        })
        .catch((error) => {
          console.error("登录失败", error);
        });
    },
    signUp: function () {
      const email = prompt("请输入邮箱");
      const password = prompt("请输入密码");
      this.cloudAuth
        .signUpWithEmailAndPassword(email, password)
        .then((item) => {
          console.log("注册成功", item);
          this.user = item.user;
        })
        .catch((error) => {
          console.error("注册失败", error);
        });
    },
  },
};
</script>