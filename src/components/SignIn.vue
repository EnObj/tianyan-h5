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
          <router-link to="/sign-up">注册</router-link>
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
      this.cloudAuth
        .signInWithEmailAndPassword(this.account, this.password)
        .then((item) => {
          console.log("登录成功", item);
          this.$router.back();
        })
        .catch((error) => {
          console.error("登录失败", error);
          alert("邮箱或密码错误");
        });
    },
  },
};
</script>

<style scoped>
.sign-in {
  padding: 15px;
}
</style>