<template>
  <div class="hello-world">
    <el-breadcrumb style="margin-top:20px;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账户</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user">
      <div class="user-icon">
        <img :src="require('../assets/' + userIcon)" alt="头像" />
      </div>
      <div class="user-name">{{ userName }}</div>
    </div>
    <div class="actions">
      <div class="action">
        <el-button
          type="primary"
          @click="
            loginForm.email = user.email;
            showLoginDialog = true;
          "
          v-if="!user.logined || user.loginType == 0"
          >{{ loginText }}</el-button
        >
      </div>
      <div class="action">
        <el-button
          type="info"
          @click="showSetEmailDialog = true"
          v-if="user.logined && user.loginType == 0 && !user.email"
          >绑定邮箱</el-button
        >
      </div>
      <div class="action">
        <el-button
          type="text"
          @click="loginAsAnonymous"
          v-if="!user.logined"
          :loading="loginLoading"
          >匿名登录</el-button
        >
      </div>
      <div class="action">
        <el-button
          type="success"
          v-if="!user.logined"
          @click="showRegisterDialog = true"
          >注册</el-button
        >
      </div>
      <div class="action">
        <el-popconfirm
          title="确定退出登录吗？"
          @confirm="logout"
          v-if="user.logined && user.loginType != 0"
        >
          <el-button type="danger" :loading="logoutLoading" slot="reference"
            >退出</el-button
          >
        </el-popconfirm>
      </div>
    </div>
    <!-- 登录弹窗 -->
    <el-dialog title="登录" :visible.sync="showLoginDialog" width="350px">
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        label-width="60px"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input
            placeholder="邮箱"
            prefix-icon="el-icon-user"
            v-model.lazy.trim="loginForm.email"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            placeholder="密码"
            prefix-icon="el-icon-key"
            v-model.lazy.trim="loginForm.password"
            show-password
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="login" :loading="loginLoading">
            登录
          </el-button>
          <el-button type="text" @click="forgetPassword">忘记密码</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 绑定邮箱弹窗 -->
    <el-dialog
      title="绑定邮箱"
      :visible.sync="showSetEmailDialog"
      width="350px"
    >
      <el-form
        :model="setEmailForm"
        :rules="setEmailRules"
        ref="setEmailForm"
        label-width="60px"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input
            placeholder="邮箱"
            prefix-icon="el-icon-user"
            v-model.lazy.trim="setEmailForm.email"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            placeholder="密码"
            prefix-icon="el-icon-key"
            v-model.lazy.trim="setEmailForm.password"
            show-password
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            v-on:click="setEmail"
            :loading="setEmailLoading"
          >
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 注册弹窗 -->
    <el-dialog title="注册" :visible.sync="showRegisterDialog" width="350px">
      <el-form
        :model="registerForm"
        :rules="registerRules"
        ref="registerForm"
        label-width="60px"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input
            placeholder="邮箱"
            prefix-icon="el-icon-user"
            v-model.lazy.trim="registerForm.email"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            placeholder="密码"
            prefix-icon="el-icon-key"
            v-model.lazy.trim="registerForm.password"
            show-password
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            v-on:click="register"
            :loading="registerLoading"
          >
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 重置密码 -->
    <el-dialog
      title="重置密码"
      :visible.sync="showResetPasswordDialog"
      width="350px"
    >
      <el-form
        :model="resetPasswordForm"
        :rules="resetPasswordRules"
        ref="resetPasswordForm"
        label-width="60px"
      >
        <el-form-item label="邮箱" prop=" ">
          <el-input
            placeholder="邮箱"
            prefix-icon="el-icon-user"
            v-model.lazy.trim="resetPasswordForm.email"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            v-on:click="resetPassword"
            :loading="resetPasswordLoading"
          >
            确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EoCloud",
  props: {
    msg: String,
  },
  data() {
    return {
      user: {
        email: "",
        logined: false, // false-未登录，true-已登录
        loginType: "", // 0-匿名登录，1-邮箱登录
      },
      showLoginDialog: false,
      // 登录相关
      loginForm: {
        email: "",
        password: "",
      },
      loginRules: {
        email: [{ required: true, trigger: "blur" }],
        password: [{ required: true, trigger: "blur" }],
      },
      loginLoading: false,
      // 登出相关
      logoutLoading: false,
      // 绑定邮箱
      showSetEmailDialog: false,
      setEmailForm: {
        email: "",
        password: "",
      },
      setEmailRules: {
        email: [{ required: true, trigger: "blur" }],
        password: [{ required: true, trigger: "blur" }],
      },
      setEmailLoading: false,
      // 注册
      showRegisterDialog: false,
      registerForm: {
        email: "",
        password: "",
      },
      registerRules: {
        email: [{ required: true, trigger: "blur" }],
        password: [{ required: true, trigger: "blur" }],
      },
      registerLoading: false,
      // 重置密码
      showResetPasswordDialog: false,
      resetPasswordForm: {
        email: "",
      },
      resetPasswordRules: {
        email: [{ required: true, trigger: "blur" }],
      },
      resetPasswordLoading: false,
    };
  },
  computed: {
    // 用户头像
    userIcon() {
      if (this.user.logined) {
        return this.user.loginType == "0" ? "an-login.svg" : "logined.svg";
      }
      return "un-login.svg";
    },
    // 用户名称
    userName() {
      if (this.user.logined) {
        return this.user.loginType == "0" ? "匿名用户" : this.user.email;
      }
      return "未登录";
    },
    // 登录按钮上的文字
    loginText() {
      return (this.user.email ? "使用" + this.user.email : "邮箱") + "登录";
    },
  },
  created() {
    // 监听登录状态变化
    this.cloudAuth.onLoginStateChanged((loginState) => {
      console.log(loginState);
      if (loginState) {
        // 有登录状态
        this.user.logined = true;
        this.user.loginType = loginState.loginType == "ANONYMOUS" ? "0" : "1";
        this.user.email = loginState.user.email;
      } else {
        // 没有登录
        this.user.logined = false;
      }
    });
  },
  methods: {
    /**
     * 登录
     */
    async login() {
      this.loginLoading = true;
      try {
        await this.$refs.loginForm.validate();
        await this.cloudAuth.signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password
        );
        // 关闭弹窗
        this.showLoginDialog = false;
        this.$notify({
          message: "登录成功",
          type: "success",
        });
      } catch (error) {
        this.$notify({
          message: error.message || "请检查表单",
          type: "error",
        });
      } finally {
        this.loginLoading = false;
      }
    },
    /**
     * 退出登录
     */
    async logout() {
      this.logoutLoading = true;
      try {
        this.cloudAuth.signOut();
      } catch (error) {
        this.$notify({
          message: error.message,
          type: "error",
        });
      } finally {
        this.logoutLoading = false;
      }
    },
    /**
     * 匿名登录
     */
    async loginAsAnonymous() {
      this.loginLoading = true;
      try {
        await this.cloudAuth.anonymousAuthProvider().signIn();
        // 关闭弹窗
        this.showLoginDialog = false;
      } catch (error) {
        this.$notify({
          message: error.message,
          type: "error",
        });
      } finally {
        this.loginLoading = false;
      }
    },
    /**
     * 绑定邮箱
     */
    async setEmail() {
      this.setEmailLoading = true;
      try {
        // 更新用户名（sdk bug，不调用这一步会报用户不存在）
        await this.cloudAuth.currentUser.updateUsername(this.cloudAuth.currentUser.uid);
        // 更新用户密码
        await this.cloudAuth.currentUser.updatePassword(this.setEmailForm.password);
        // 更新邮箱
        await this.cloudAuth.currentUser.updateEmail(this.setEmailForm.email);
        // 关闭弹窗
        this.showSetEmailDialog = false;
        this.$notify({
          message: "验证邮件已发送，请检查邮箱以激活",
          type: "success",
        });
      } catch (error) {
        this.$notify({
          message: error.message,
          type: "error",
        });
      } finally {
        this.setEmailLoading = false;
      }
    },
    /**
     * 注册
     */
    async register() {
      this.registerLoading = true;
      try {
        // 更新邮箱
        await this.cloudAuth.signUpWithEmailAndPassword(
          this.registerForm.email,
          this.registerForm.password
        );
        // 关闭弹窗
        this.showRegisterDialog = false;
        this.$notify({
          message: "验证邮件已发送，请检查邮箱以激活",
          type: "success",
        });
      } catch (error) {
        this.$notify({
          message: error.message,
          type: "error",
        });
      } finally {
        this.registerLoading = false;
      }
    },
    /**
     * 忘记密码
     */
    forgetPassword() {
      this.resetPasswordForm.email = this.loginForm.email;
      this.showResetPasswordDialog = true;
    },
    /**
     * 重置密码
     */
    async resetPassword() {
      this.resetPasswordLoading = true;
      try {
        // 更新邮箱
        await this.cloudAuth.sendPasswordResetEmail(this.resetPasswordForm.email);
        // 关闭弹窗
        this.showResetPasswordDialog = false;
        this.$notify({
          message: "验证邮件已发送，请检查邮箱以激活",
          type: "success",
        });
      } catch (error) {
        this.$notify({
          message: error.message,
          type: "error",
        });
      } finally {
        this.resetPasswordLoading = false;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.user {
  text-align: center;
  padding: 20px 0;
}
.actions {
  text-align: center;
}
.action {
  margin: 20px 0;
}
</style>
