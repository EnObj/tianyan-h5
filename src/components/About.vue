<template>
  <div class="about">
    <el-breadcrumb style="margin: 20px 0;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>关于</el-breadcrumb-item>
    </el-breadcrumb>
    <h1 class="mb-2">关于爱追更</h1>
    <h2>第1章 爱</h2>
    <p  class="mb-2">在茫茫网络世界中，你发现了真爱，TA不定期发布动态</p>
    <h2>第2章 追</h2>
    <p  class="mb-2">订阅TA的频道，本应用帮你实时追踪</p>
    <h2>第3章 更</h2>
    <p  class="mb-2">TA更新动态，你第一时间收到通知，把爱的首赞及留言放在前排</p>
    <div style="margin-top:50px;">
        <el-button v-on:click="$router.push('/search')" type="primary">现在就去找到TA</el-button>
    </div>
  </div>
</template>

<style scoped>
.about {
  padding: 0px;
}
</style>