<template>
  <div>
    <div>
      <div>{{ user.uid }}</div>
      <div v-if="user.loginType == 'ANONYMOUS'">
        <span>游客</span>
        <button v-on:click="signIn">登录</button>
        <button v-on:click="signUp">成为正式用户</button>
      </div>
      <div v-else>
        <span>正式用户（{{user.email}}）</span>
        <button v-on:click="signOut">退出登录</button>
      </div>
    </div>
    <p>
      <router-link to="/message-box">消息</router-link>
    </p>
    <p>
      <a href="https://support.qq.com/product/290950" target="_blank">反馈</a>
    </p>
    <p>
      <router-link to="/about">关于</router-link>
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
      // 需要先通过updateUsername把匿名用户转换为正式用户
      this.updateUsername().then(() => {
        this.setPassword().then(() => {
          this.updateEmail();
        });
      });
    },
    updateEmail: function () {
      const email = prompt("请输入邮箱");
      return this.user
        .updateEmail(email)
        .then(() => {
          alert("验证邮件已发送");
          return this.user.refresh();
        })
        .catch((error) => {
          console.error("更新失败", error);
          return Promise.reject();
        });
    },
    setPassword: function () {
      if (this.user.hasPassword) {
        return Promise.resolve();
      }
      const password = prompt("请输入密码");
      return this.cloudAuth.currentUser
        .updatePassword(password)
        .then(() => {
          return this.user.refresh();
        })
        .catch((error) => {
          console.error("更新密码失败", error);
          return Promise.reject();
        });
    },
    updateUsername: function () {
      return this.cloudAuth.currentUser
        .updateUsername(this.user.uid)
        .then(() => {
          return this.user.refresh();
        })
        .catch((error) => {
          console.error("更新用户名失败", error);
          return Promise.reject();
        });
    },
    signOut() {
      this.cloudAuth.signOut().then(() => {
        // 再以匿名用户登录
        this.cloudAuth
          .anonymousAuthProvider()
          .signIn()
          .then((item) => {
            console.log("登录成功", item);
            this.user = this.cloudAuth.currentUser;
          })
          .catch((error) => {
            console.error("登录失败", error);
          });
      });
    },
  },
};
</script>