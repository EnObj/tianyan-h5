<template>
  <div class="sign-in">
    <h1>登录</h1>
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
          placeholder="密码"
          prefix-icon="el-icon-key"
          v-model.lazy.trim="password"
          show-password
        >
        </el-input>
      </p>
      <div class="flex-start">
        <div>
          <el-button type="primary" v-on:click="signIn"> 登录 </el-button>
        </div>
        <p class="not-importent" style="margin-left: 10px">
          <el-link v-on:click="$router.push('/sign-up')" type="primary"
            >注册</el-link
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignIn",
  data() {
    return {
      account: "",
      password: "",
    };
  },
  methods: {
    signIn() {
      if (this.account && this.password) {
        const loading = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
        });
        this.cloudAuth
          .signInWithEmailAndPassword(this.account, this.password)
          .then((item) => {
            console.log("登录成功", item);
            loading.close();
            this.$router.back();
          })
          .catch((error) => {
            console.error("登录失败", error);
            loading.close();
            this.$message.error("邮箱或密码错误");
          });
      } else {
        this.$message({
          message: "账户名或密码不能为空",
          type: "warning",
        });
      }
    },
  },
};
</script>

<style scoped>
.sign-in {
  padding: 0px;
}
</style>