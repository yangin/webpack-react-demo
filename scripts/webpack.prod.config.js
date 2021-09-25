const { merge } = require('webpack-merge')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const webpackConfigBase = require('./webpack.base.config')

const smp = new SpeedMeasurePlugin()

const webpackConfigProd = {
  mode: 'production'
}
module.exports = smp.wrap(merge(webpackConfigBase, webpackConfigProd))
