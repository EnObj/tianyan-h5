// 云函数入口文件
const tcb = require('@cloudbase/node-sdk')

const cloud = tcb.init({
  env: tcb.SYMBOL_CURRENT_ENV
})

const auth = cloud.auth()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  const { channelId, skip=0, limit=20} = event

  // 如果是已经存在post记录了，直接返回结束
  var channelPosts = await returnFromDb(channelId, skip, limit)
  if(channelPosts.length){
    return channelPosts
  }

  // 配置了支持showPost，则联网采集
  const { data: [channel] } = await db.collection('ty_channel').doc(channelId).get()
  if (channel.channelTemplate.showPost || channel.showPost) {
    const crawler = require(`./crawler/${channel.channelTemplate._id}.js`)
    // 分批次落库
    await crawler.crawlPosts(channel, async posts => {
      await db.collection('ty_channel_post').add(posts)
    })
    return await returnFromDb(channelId, skip, limit)
  }

  return []
}

async function returnFromDb(channelId, skip, limit) {
  const { data: channelPosts } = await db.collection('ty_channel_post').where({
    'channel._id': channelId
  }).orderBy('postTime', 'asc').skip(skip).limit(limit).get()

  return channelPosts
}