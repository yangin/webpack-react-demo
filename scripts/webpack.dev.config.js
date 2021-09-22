const path = require('path')
const { merge } = require('webpack-merge')
const webpackConfigBase = require('./webpack.base.config')

function resolve (relatedPath) {
  return path.join(__dirname, relatedPath)
}

const webpackConfigDev = {
  mode: 'development', // 设置为development模式

  target: 'web', // 必须添加此配置，才能实现浏览器的实时刷新
  // devServer 为热更新服务，通过hot:true来启动
  devServer: {
    contentBase: resolve('../public'), // 当存在静态资源时，此项必须有。指向开发的静态资源目录，配合url-loader的outPath，匹配文件中的静态资源引用地址。
    hot: true,
    open: true, // 启动后是否在浏览器自动打开
    host: 'localhost',
    port: 8090,
    // historyApiFallback: true, // 为true时，当路径找不到时，即404时，会重新加载本页面，否则报错。当react-router为BrowserRouter时，需要配置为true,否则原路径刷新报错，此时也可以用HashRoute来代替
    historyApiFallback: {
      rewrites: [
        { from: /^\/(app|app\/)/, to: '/app.html' },
        { from: /^\/(dashboard|dashboard\/)/, to: '/dashboard.html' },
        { from: /./, to: '/app.html' }
      ]
    }
    // compress: true, // enable gzip compression
    // proxy: { // proxy URLs to backend development server
    //   '/api': 'http://localhost:3000'
    // },
  }
}

module.exports = merge(webpackConfigBase, webpackConfigDev)
