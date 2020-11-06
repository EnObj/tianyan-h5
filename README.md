# 爱追更-h5
爱追更是一款用于实时追踪网络信息片段变更并提供即时通知的个人效率工具（[详细介绍](https://v2ex.com/t/712339#reply49)），本项目是此产品的h5版。

## 线上体验
[爱追更](https://enobj.github.io/#/zhui)

## 技术栈
- 前端：vue + element-ui
- 后台服务：云开发（腾讯云）
    - 逻辑：云函数（基于NodeJS）
    - 数据库：NoSQL类数据库
- 静态网站托管：Github Pages

## 安装部署

### 后台服务部分
ps: 这一步需要结合[云开发文档](https://docs.cloudbase.net/quick-start/web.html#zhun-bei-gong-zuo)进行
1. 开通云开发服务（会获取一个环境ID）
2. 创建数据库表（表定义位于./doc/table目录下）
3. 导入基础数据（基础数据位于./doc/init目录下，文件名即为需要导入的表）
4. 部署云函数（云函数位于./cloud/functions目录下）
5. 开启匿名登录&邮箱密码登录


### 前端部分
```
// 下载此仓库源码
git clone https://github.com/EnObj/tianyan-h5.git mydir

cd mydir
npm install

// 配置云开发环境ID（代码位于main.js）
const cloud = Vue.prototype.cloud = cloudbase.init({
    env: 'yourEnvID',
})

// 本地启动（预览地址：http://localhost:8080）
npm run serve

// 构建（./dist目录）
npm run build

// 发布构建物（可以发布到任意静态资源托管平台）
...
```

## 参与贡献
- 提交issue
- fork代码仓库并提交pull request
- 线上产品使用问题：可至[爱追更社区](https://support.qq.com/products/290950)反馈

## 联系开发者
- 个人邮箱：laoji52125@163.com
