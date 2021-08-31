const urlResolver = require('../resolver/bili_uper_urlResolver.js')

urlResolver.resolve('用青春').then(res=>{
  console.log(res)
})