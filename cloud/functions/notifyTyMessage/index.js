// 云函数入口文件
const tcb = require('@cloudbase/node-sdk')
const nodemailer = require("nodemailer");

const cloud = tcb.init({
  env: tcb.SYMBOL_CURRENT_ENV
})

const auth = cloud.auth()

const db = cloud.database()
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async () => {

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT ? +process.env.MAILER_PORT : 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAILER_AUTH_USER, // generated ethereal user
      pass: process.env.MAILER_AUTH_PASS, // generated ethereal password
    },
  });

  const where = {
    notify: 'wait',
    readed: false
  }
  const {
    total: amount
  } = await db.collection('ty_user_channel_data_message').where(where).count()
  console.log(`待处理数目：${amount}`)

  // 通过用户进行聚合
  const {
    data: userMessages
  } = await db.collection('ty_user_channel_data_message').aggregate().match(where).group({
    _id: '$_openid',
    channelDatas: $.addToSet('$channelData')
  }).limit(50).end()

  // 一个一个处理
  for (let i = 0; i < userMessages.length; i++) {

    const userMessage = userMessages[i]
    console.log(`正在处理：${userMessage._id}`)

    // 具名渠道代表
    const channel = userMessage.channelDatas[0].channel
    const notifyUpdater = {
      notify: 'finished',
      notifyTime: Date.now()
    }
    try {
      // 查询用户信息
      const { userInfo } = await auth.getEndUserInfo(userMessage._id)

      console.log(`正在发送：${channel._id}`)

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `"爱追更" <${process.env.MAILER_AUTH_USER}>`, // sender address
        to: userInfo.email, // list of receivers
        subject: "你关注的频道有更新了", // Subject line
        text: channel.name,
        html: `
          <a href="${process.env.WEBSITE_HOST}/zhuigeng/index.html#/channel/${channel._id}">${channel.name}</a>
          <span>${(userMessage.channelDatas.length > 1 ? ("等" + userMessage.channelDatas.length + "个活动") : "") + '有更新'}</span>
          `,
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

      // 记录状态
    } catch (err) {
      console.error(err)
      notifyUpdater.notifyResult = 'fail'
    } finally {
      // 更新状态
      await db.collection('ty_user_channel_data_message').where({
        _openid: userMessage._id,
        ...where
      }).update(notifyUpdater)
    }

    // 把代表渠道的订阅标记关了
    // await db.collection('ty_user_channel').where({
    //   _openid: userMessage._id,
    //   'channel._id': channel._id
    // }).update({
    //   notify: false
    // })
  }
}