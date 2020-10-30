import Vue from 'vue'
import App from './App.vue'

const tcb = require('tcb-js-sdk')

const app = tcb.init({
  env: 'dev-4f5fdb'
})
app.auth({
  persistence: 'local'
}).anonymousAuthProvider().signIn().then(item=>{
  console.log('登录成功', item)

  const db = app.database()
  const userDb = db.collection('ty_channel')
  userDb.get().then(item=>{
    console.log(item)
  }).catch(error=>{
    console.error(error)
  })

  app.callFunction({
    name: 'node-app',
    data: {
      user: 'tom',
      invoker: 'browser'
    }
  }).then(item=>{
    console.log(item)
  }).catch(error=>{
    console.error(error)
  })

}).catch(error=>{
  console.error('登录失败', error)
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
