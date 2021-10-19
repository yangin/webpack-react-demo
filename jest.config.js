/**
 * https://jestjs.io/docs/configuration
 */
module.exports = {
  moduleDirectories: [ 'node_modules', 'src', 'test' ], // jest匹配的目标文件夹
  transform: {
    // 因为被测试的代码及测试代码是用typescript及ES6写的，所以在测试前，需通过babel将其转换后识别
    // 注意，这里的babel-jest只能读取根目录下的babel.config.js 文件里的配置
    '^.+\\.(ts|tsx|js|jsx)?$': 'babel-jest'
  }
}
