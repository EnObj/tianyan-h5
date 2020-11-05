<template>
  <div class="sign-up">
    <h1>注册</h1>
    <div>
      <p>
        <el-input
          placeholder="邮箱"
          prefix-icon="el-icon-user"
          v-model.lazy.trim="account"
        >
        </el-input>
      </p>
      <p>
        <el-input
          placeholder="密码（包含字母和数字，长度要求8～32位）"
          prefix-icon="el-icon-key"
          v-model.lazy.trim="password"
          show-password
        >
        </el-input>
      </p>
      <div class="flex-start">
        <div>
          <el-button type="primary" v-on:click="signUp"> 注册 </el-button>
        </div>
        <p class="not-importent" style="margin-left: 10px">
          <el-link v-on:click="$router.push('/sign-in')" type="primary">登录</el-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignUp",
  data() {
    return {
      account: "",
      password: "",
      user: this.cloudAuth.currentUser,
    };
  },
  methods: {
    signUp: function () {
      // 需要先通过updateUsername把匿名用户转换为正式用户
      this.updateUsername().then(() => {
        this.setPassword().then(() => {
          this.updateEmail();
        });
      });
    },
    updateEmail: function () {
      return this.user
        .updateEmail(this.account)
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
      return this.cloudAuth.currentUser
        .updatePassword(this.password)
        .then(() => {
          return this.user.refresh();
        })
        .catch((error) => {
          console.error("更新密码失败", error);
          alert("密码不合法");
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
  },
};
</script>

<style scoped>
.sign-up {
  padding: 15px;
}
</style>