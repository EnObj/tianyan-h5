<template>
  <div id="app">
    <nav class="top-bar" data-topbar>
      <ul class="title-area">
        <li class="name">
          <h1><a href="#/zhui">爱追更</a></h1>
        </li>
        <li class="toggle-topbar menu-icon">
          <a href="#"><span></span></a>
        </li>
      </ul>

      <section class="top-bar-section">
        <ul class="left">
          <li v-bind:class="{active:$route.path=='/zhui'}"><router-link to="/zhui">追更</router-link></li>
          <li v-bind:class="{active:$route.path=='/explore'}"><router-link to="/explore">探索</router-link></li>
          <li v-bind:class="{active:$route.path=='/more'}"><router-link to="/more">更多</router-link></li>
        </ul>
      </section>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.flex-end {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.flex-around {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.padding-box {
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
  background: #fff;
}

.padding-box-no-bg {
  margin: 10px;
  padding: 10px;
  border-radius: 5px;
}

.not-importent {
  color: gray;
  font-size: 14px;
}

.abs-center {
  display: flex;
}
.abs-center > .abs-center-content {
  margin: auto;
}

.no-wrap {
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ref-content {
  color: #576b95;
}

.success-content {
  color: #09bb07;
}

.nav-none-bg:active {
  background: none;
}

.active-hover:active {
  background: #eee;
}

.bg {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}

.bg-img {
  width: 100vw;
  height: 100vh;
  opacity: 0.2;
}
</style>
