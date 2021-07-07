const { merge } = require('webpack-merge')
const webpackConfigBase = require('./webpack.base.config')

const webpackConfigProd = {
  mode: 'production'
}
module.exports = merge(webpackConfigBase, webpackConfigProd)
