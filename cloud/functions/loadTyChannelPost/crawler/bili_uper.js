const fetch = require('node-fetch');
const { URL } = require('url')

module.exports = {
    crawlPosts: async function (channel, writer) {
        const url = new URL(channel.resourceUrl)

        const fetchByPage = async function (page) {
            url.searchParams.set('pn', page)
            const resourceObj = await fetch(url.href).then(res => res.json())
            await writer(resourceObj.data.list.vlist.map(v => {
                return {
                    "channel": channel,
                    "content": v.title,
                    "openResourceUrl": `https://www.bilibili.com/video/${v.bvid}`,
                    "postTime": v.created * 1000
                }
            }))
            return !!resourceObj.data.list.vlist.length
        }

        let more, page = 1
        do {
            more = await fetchByPage(page++)
        } while (more)
    }
}