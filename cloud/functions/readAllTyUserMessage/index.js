// 云函数入口文件
const tcb = require('@cloudbase/node-sdk')

const cloud = tcb.init({
  env: tcb.SYMBOL_CURRENT_ENV
})

const auth = cloud.auth()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // 查询用户信息
  const { userInfo } = await auth.getEndUserInfo()

  return db.collection('ty_user_channel_data_message').where({
    _openid: userInfo.uid,
    readed: false
  }).update({
    data: {
      readed: true
    }
  })
}