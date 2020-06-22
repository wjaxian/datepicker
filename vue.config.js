// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const path = require('path')
const isPord = process.env.NODE_ENV === 'production'
module.exports = {
  publicPath: '/dist/',
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  devServer: {
		open: true,
		host: '127.0.0.1',
		port: 8080,
		https: false,
		hotOnly: false,
		proxy: null
	},
  configureWebpack: config => {
    if (isPord) {
      Object.assign(config.output, {
        libraryTarget: 'umd', // 指定输出格式
        umdNamedDefine: true, // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
        library: 'Wdatepicker',
        chunkFilename: '[name].[hash:5].js'
      })

      // config.plugins = config.plugins.concat([
      //   new CopyWebpackPlugin([
      //     { 
      //       from: path.resolve(__dirname, 'src/'), 
      //       to: 'lib',
      //       ignore: ['.*']
      //       // transform(content, path) {
      //       //   // return optimize(content);
      //       // }
      //     }
      //   ], {copyUnmodified: true})
      // ])
    }
  }
}