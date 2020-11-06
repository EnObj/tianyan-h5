const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    configureWebpack: {
      plugins: [
        new HtmlWebpackPlugin({title: '爱追更 - 追你所爱'})
      ]
    }
  }