// 此处的配置只给jest调用， webpack时配置在babel-loader中
// 2处的需求不同，所以分开来配置
module.exports = {
  'presets': [
    '@babel/preset-env',
    [ '@babel/preset-typescript', { isTSX: true, allExtensions: true, allowNamespaces: true } ]
  ]
}
