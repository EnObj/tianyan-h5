module.exports = {
    // 把静态文件build到index.html同目录下
    publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = '爱追更 - 追你所爱'
                return args
            })
    }
}