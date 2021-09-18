const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// 获取当前的环境变量process.env.NODE_ENV
// NODE_ENV值一般在package.json文件中通过脚本命令定义，如cross-env NODE_ENV=production
const isProduction = process.env.NODE_ENV === 'production'

const PATH_ROOT = resolve(__dirname, '../')
const PATH_SRC_ROOT = resolve(__dirname, '../src/')

const webpackConfigBase = {
  // entery为webpack解析的入口（解析各种包依赖关系的入口），而不是项目访问的入口
  // 官网描述：指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始
  entry: {
    app: [ resolve(PATH_SRC_ROOT, 'pages/app') ],
    dashboard: [ resolve(PATH_SRC_ROOT, 'pages/dashboard') ]
  },

  // output为项目打包后的输出位置
  // 官网描述：告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist
  output: {
    path: resolve(PATH_ROOT, 'dist'), // path为打包后的输出文件夹位置，此处为 ./dist文件夹
    filename: 'js/[name].[hash].js', // 打包后的入口文件的文件名
    chunkFilename: 'chunks/[name].[hash:4].js' // 非入口文件的文件名
  },

  optimization: {
    // 将runtime文件单独拆分出来，因为每次打包或者更改时,runtime内容都会更改，若将其与包一起打包，则每次更新必然是所有包的更新，效率很低
    // 所以一般将其拆除，直接内联到html中
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`
    }
  },

  // module此处为loader区域，一般文件内容解析，处理放在此处，如babel，less,postcss转换等
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-react' ]
          }
        }
      },
      {
        test: /\.(css|less)$/,
        use: [ {
          loader: MiniCssExtractPlugin.loader // MiniCssExtractPlugin.loader 需要在css-loader之后解析
        },
        'css-loader',
        {
          loader: 'postcss-loader', // postcss需要放在css之前，其他语言(less、sass等)之后，进行解析
          options: {
            postcssOptions: {
              plugins: [
                require('autoprefixer')() // 给css自动添加前缀
              ]
            }
          }
        },
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true
            }
          }
        } // 当解析antd.less，必须写成下面格式，否则会报Inline JavaScript is not enabled错误
        ]
      },
      // loader-image
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: /node_modules/,
        include: [ resolve(PATH_ROOT, 'public/images') ],
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[name].[ext]',
          outputPath: '/images'
        }
      },
      // loader-font
      {
        test: /\.(woff|eot|ttf|svg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'font/[name].[ext]'
        }
      }
    ]
  },

  plugins: [
    // 为项目生成一个可以访问的html文件，否则全是.js文件，没有访问的页面入口。默认为index.html,路径是基于根目录的相对路径
    new HtmlWebpackPlugin({
      filename: 'index.html', // 打包输出的html文件名,当多入口时，必须配置此项，否则会报输出文件名相同错误
      template: resolve(PATH_ROOT, 'scripts/templates/index.html'), // 引用模板html文件生成项目的入口文件html
      chunks: [ 'index' ] // 将指定名称的脚本注入到html模板中
      // templateContent: require('./templates/index'),  // 将内容直接覆盖到html模板中，通常从js文件中引入
      // inject: false  // 如果为false, 则禁止在html模板中注入脚本
    }),
    new HtmlWebpackPlugin({
      filename: 'dashboard.html', // 打包输出的html文件名
      template: resolve(PATH_ROOT, 'scripts/templates/dashboard.html'), // 引用模板html文件生成项目的入口文件html
      chunks: [ 'dashboard' ] // 将指定名称的脚本注入到html模板中
    }),
    new MiniCssExtractPlugin({
      filename: isProduction ? 'css/[name].[contenthash].css' : 'css/[name].css',
      chunkFilename: isProduction ? 'css/[name].[contenthash].[id].css' : 'css/[name].[id].css'
    })
  ]
}
module.exports = webpackConfigBase
