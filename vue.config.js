module.exports = {
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = '爱追更 - 追你所爱'
                return args
            })
    }
}