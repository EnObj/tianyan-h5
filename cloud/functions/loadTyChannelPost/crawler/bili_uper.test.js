const biliUper = require('./bili_uper')

test('biliUper download by page', async ()=>{
    let count = 0
    await biliUper.crawlPosts({
        'resourceUrl': 'https://api.bilibili.com/x/space/arc/search?mid=208557615&ps=30&tid=0&pn=1&keyword=&order=pubdate&jsonp=jsonp'
    }, async function(list){
        count += list.length
    })
    expect(count).toBe(319)
})