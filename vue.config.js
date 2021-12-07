const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
const path = require('path')

console.info(process.env.NODE_ENV)

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: true,
  productionSourceMap: false, // 去掉打包后js中，会自动生成的一些map文件
  devServer: {
    port: 8080, // 端口
    proxy: {
      '/api': {
        target: 'http://wx.lohike.net',
        changeOrigin: true, // target是域名的话，需要这个参数，
        secure: false, // 设置支持https协议的代理
        pathRewrite: { '^/api': '' }
      },
      '/shop_api': {
        target: 'https://api.it120.cc/xiaochengxu',
        // target: 'https://api.it120.cc/kekee0724',
        changeOrigin: true, // target是域名的话，需要这个参数，
        secure: false, // 设置支持https协议的代理
        pathRewrite: { '^/shop_api': '' }
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve(''))
      .set('@mall', resolve('mall'))
      .set('@static', resolve('static'))
      .set('@assets', resolve('assets'))
      .set('@styles', resolve('styles'))
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 50,
            unitPrecision: 3,
            propList: ['*', '!font*'],
            // 注意：如果有使用第三方UI如VUX，则需要配置下忽略选择器不转换。
            // 规则是class中包含的字符串，如vux中所有的class前缀都是weui-。也可以是正则。
            selectorBlackList: ['uni-', 'weui-', 'cp-icon-', '.ignore ', '.hairlines', 'van-circle__layer', '.van-hairline'],
            exclude: /pages/,
            minPixelValue: 2
          })
        ]
      }
    }
  }
}
