<template>
  <div class="more">
    <div>
      <div>
        <div class="user-head">
          <div style="margin: auto">
            <i class="el-icon-user-solid"></i>
          </div>
        </div>
        <div class="not-importent">
          <div v-if="user.loginType == 'ANONYMOUS'" key="user-youke">
            <span>游客</span>
          </div>
          <div v-else key="user-email">
            <span>{{ user.email }}</span>
          </div>
        </div>
      </div>
      <div class="login-area">
        <el-button-group v-if="user.loginType == 'ANONYMOUS'"
          key="no-eamil">
          <el-button type="primary" v-on:click="$router.push('/sign-in')">登录</el-button>
          <el-button type="primary" v-on:click="$router.push('/sign-up')">注册</el-button>
        </el-button-group>
        <el-button-group v-else
          key="with-eamil">
          <el-button type="danger" v-on:click="signOut">退出登录</el-button>
        </el-button-group>
        <!-- <ul
          class="button-group round"
          v-if="user.loginType == 'ANONYMOUS'"
          key="no-eamil"
        >
          <li><button v-on:click="$router.push('/sign-in')" class="button">登录</button></li>
          <li>
            <button v-on:click="$router.push('/sign-up')" class="button">注册</button>
          </li>
        </ul>
        <ul class="button-group round" v-else key="with-eamil">
          <li>
            <button v-on:click="signOut" class="button alert">退出登录</button>
          </li>
        </ul> -->
      </div>
    </div>
    <p>
      <router-link to="/message-box">消息<span class="label alert round" v-show="lastUnreadedMessage">新</span></router-link>
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
      lastUnreadedMessage: null
    };
  },
  mounted(){
    // 查询最新一条未读消息
    this.cloud.database().collection('ty_user_channel_data_message').where({
      readed: false
    }).orderBy('createTime', 'desc').limit(1).get().then(res=>{
      this.lastUnreadedMessage = res.data[0] || null
    })
  },
  methods: {
    signIn: function () {
      const email = prompt("请输入邮箱");
      if(email){
        const password = prompt("请输入密码");
        if(password){
          this.cloudAuth
            .signInWithEmailAndPassword(email, password)
            .then((item) => {
              console.log("登录成功", item);
              this.user = item.user;
            })
            .catch((error) => {
              console.error("登录失败", error);
              alert('邮箱或密码错误')
            });
        }
      }
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
      const email = prompt("请输入登录邮箱");
      if(email){
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
      }
      return Promise.reject();
    },
    setPassword: function () {
      if (this.user.hasPassword) {
        return Promise.resolve();
      }
      const password = prompt("请设置登录密码");
      if(password){
        return this.cloudAuth.currentUser
          .updatePassword(password)
          .then(() => {
            return this.user.refresh();
          })
          .catch((error) => {
            console.error("更新密码失败", error);
            return Promise.reject();
          });
      }
      return Promise.reject()
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

<style scoped>
.more {
  padding: 15px;
  text-align: center;
}
.user-head {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  font-size: 40px;
  margin: 10px auto;
  color: gray;
}
.login-area{
  margin: 10px 0;
}
</style>