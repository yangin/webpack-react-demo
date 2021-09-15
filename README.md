# 搭建一个react-webpack框架

环境： webpack 5.x

疑问：明明已经有create-react-app脚手架了，为何还要自己去用webpack去重新做一个脚手架？

> 当然，create-react-app是一个很棒的脚手架了，我们查看其源码，知道其也是在webpack基础上封装的一个脚手架工具，再细看其配置内容，就知道为何需要自己封装一个自己的框架了。

> 1.因为其在打包时，是将node_module目录下所有包都打包到一个vender.chunk里的，而所有自定义的js部分，都打包到一个default.chunk下的，且css也是直接在default内部的，未进行拆分，因此，其打包出来的这个资源包，会非常大。会影响资源的加载速度。尤其是首页的渲染速度。

> 2.其webpack的配置是隐藏的，因此当需要更多的自定义配置时，如处理less时，就需要调出webpack配置或重新引入一个文件进行覆盖，但又不知道原配置里是如何写的，因此这个覆盖的成败也是比较高的。

> 因此，就需要我们自己定义一个webpack来进行开发框架的封装，根据实际项目需求来自己调整配置，从而提高开发效率并满足个性化的开发需求。

## 一、简介

webpack是javascript应用程序的一个资源打包器（核心功能）。再配合其插件（plugins）与转换(loader)功能，可以实现代码的解析与转换，从而十分方便的对代码进行打包构建。

### 优点

* 通过对代码的打包（包括打包与拆包）降低页面资源的网络请求次数与单个资源包的大小，从而实现首屏的快速加载与页面的快速访问。

* 配合插件（plugins）与转换(loader)功能，对代码进行转换，如通过babel_loader解析jsx、es6语法，通过less_loader来将less转译成css语法等，毕竟浏览器是只认识最基本的javascript、css、es5的语法的，对jsx、es6、less的语法规则无法识别，所以最终需要将其打包成能够被浏览器识别的语法。

* 通过插件（plugins）对代码进行压缩，来降低资源包的大小，从而增加页面的响应速度。

* 配合其热更新功能，可以实现快速编码。

## 二、准备工作

### 搭建流程

搭建一个react框架，需要做哪些事儿

* 构建一个html作为访问与渲染入口。
* 识别react的相关语法，如jsx,es6等，可以编写react项目
* 根据需要，识别less语法，引入postcss
* 对css进行打包
* 对image进行打包
* 热更新
* 分别配置生产环境与开发环境下的配置文件
* 对webpack进行性能优化，提高打包效率

### 环境准备

#### 第1步：创建一个node项目,初始化一个package.json

```shell
npm init -y
```

#### 第2步：安装webpack相关的包

```shell
npm install -D webpack webpack-cli
```

#### 第3步：准备webpack.config.js和index.js文件

```
.
+-- scripts
|    +-- webpack.config.js
+-- src
|    +-- index.js
+-- package.json
+-- package-lock.json
```

webpack.config.js

```javascript
const path = require('path');

//将相对路径解析为绝对路径，__dirname为当前文件所在的目录下，此处为./webpack文件夹
function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}

const webpackConfig = {
  //打包模式:'production' or development' 
  mode:'production',
  
  //entery为webpack解析的入口（解析各种包依赖关系的入口），而不是项目访问的入口
  //官网描述：指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始
  entry: {
    app: [resolve('../src/index.js')], 
  },
  
  //output为项目打包后的输出位置
  //官网描述：告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist
  output: {
    path: resolve('../dist'), //path为打包后的输出文件夹位置，此处为 ./dist文件夹
    filename:'bundle.js'
  },
  
  plugins:[]
}

module.exports = webpackConfig
```

index.js

```javascript
console.log('Hello Webpack');
```

#### 第4步：在package.json里配置webpack的启动命令

package.json

```json
  "scripts":{
    "build": "webpack --config ./scripts/webpack.config.js"
  },
```

#### 第5步：验证webpack是否生效

在项目根目录下执行webpack命令

```shell
npm run build 
```

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/2-3-5-1.png)

dist/bundle.js 为生成的打包文件

在 dist 目录下启动项目，并在浏览器端查看结果
> 此处暂时先用http-server，方便在浏览器端查看效果，等整合热更新时，再换成dev-server

```
npx http-server
```

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/2-3-5-2.png)

至此，完成了webpack打包环境的准备工作。

## 三、用 webpack5.x 集成 react 框架

### 1. 构建一个html作为访问与渲染入口

#### 第1步：安装html-webpack-plugin插件

```
npm install -D html-webpack-plugin
```

#### 第2步：新建一个index.html文件作为入口文件的模板

目录结构

```
.
+-- scripts
    +-- template
        +-- index.html
```

index.html

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>React</title>
  </head>
  <body>
    <div id="root" class="root"></div>
  </body>
</html>
```

#### 第3步：在webpack.config.js中进行相关配置

webpack.config.js

```
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = {
  ...
  plugins:[
     //为项目生成一个可以访问的html文件，否则全是.js文件，没有访问的页面入口。默认为index.html,路径是基于根目录的相对路径
     new HtmlWebpackPlugin({
      template: './public/index.html',  //引用模板html文件生成项目的入口文件html
    }),
  ]
  ...
}
```

#### 第4步：打包并验证结果

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-1-3-1.png)

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-1-3-2.png)

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-1-3-3.png)

至此，完成了对html-webpack-plugin插件的引入，并生成了一个入口文件index.html，可以供在浏览器端访问。

### 2. 识别react的相关语法，如 jsx, es6 等，可以编写react项目

#### 第1步：安装 babel 及 react 相关插件

```
npm install react react-dom
```

```
npm install @babel/core
```

```
npm install -D @babel/preset-env @babel/preset-react babel-loader
```

#### 第2步：修改src目录下index.js文件的内容，改成react的语法

index.js

```
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <div>
      <span>Hello React</span>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
```

#### 第3步：在webpack.config.js文件里配置babel

webpack.config.js

```
const webpackConfig = {
  ...
  //module此处为loader区域，一般文件内容解析，处理放在此处，如babel，less,postcss转换等
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          }
        }
      }
    ]
  },
  ...
}
```

#### 第4步：打包并验证结果

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-2-4-1.png)

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-2-4-2.png)
至此，webpack对babel的引入成功，项目可以解析react相关语法，此时项目框架正式成为一个react项目了

### 3. 打包样式文件

#### 3.1 识别.css文件

当我们在没有任何配置的情况下，添加一个.css文件
![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-3-1-1.png)

打包结果如图

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-3-1-2.png)

表示index.css文件解析失败，需要用一个loader来处理文件。

#### 第1步：安装css-loader、style-loader

```
npm install -D css-loader style-loader
```

#### 第2步：在webpack.config.js文件里配置css-loader、style-loader

webpack.config.js

```
const webpackConfig = {
  ...
  //module此处为loader区域，一般文件内容解析，处理放在此处，如babel，less,postcss转换等
  module: {
    rules: [
     ...
     {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
      ...
    ]
  },
  ...
}
```

第3步：打包验证结果
![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-3-1-3-1.png)

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-3-1-3-2.png)

至此，css样式应用成功，被打包进bundle.js文件中，在页面中以style标签内部引用。

#### 3.2 识别.less文件

```
npm install -D less
```

当我们将3.1中的.css后缀改为.less后缀时，打包后会报错

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-3-2-1-1.png)

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-3-2-1-2.png)

表示index.less文件解析失败，需要用一个loader来处理文件，接下来，我们来处理一下

#### 第1步：安装 less-loader

```
npm install -D less-loader
```

#### 第2步：在webpack.config.js文件里配置less-loader

webpack.config.js

```
const webpackConfig = {
  ...
  //module此处为loader区域，一般文件内容解析，处理放在此处，如babel，less,postcss转换等
  module: {
    rules: [
     ...
     {
        test: /\.(css|less)$/,
        use: ['style-loader','css-loader','less-loader']
      },
      ...
    ]
  },
  ...
}
```

注意1：此处的style-loader、css-loader、less-loader的顺序不能变的，因为webpack在转换时是从后往前转的，即先将.less转成.css，然后在将.css写进style里的。

注意2：当我们引入antd.less时，需要启动less-loader的
javascriptEnabled=true,如下
webpack.config.js

```
  
  //module此处为loader区域，一般文件内容解析，处理放在此处，如babel，less,postcss转换等
  module: {
    rules: [
     ...
     {
        test: /\.(css|less)$/,
        use: [
        'style-loader',
        'css-loader',
        // 'less-loader',
        {loader: 'less-loader', options: {lessOptions: {javascriptEnabled: true}}} // 当解析antd.less，必须写成下面格式，否则会报Inline JavaScript is not enabled错误
        ]
      },
      ...
    ]
  },
  ...
}
```

引入antd

```
npm install antd
```

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-3-2-2-1.png)

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-3-2-2-2.png)

至此，完成了webpack对less的兼容。

### 3.3 引入postcss适配浏览器

#### 第1步：安装autoprefixer、postcss-loader

```
npm install -D autoprefixer postcss-loader 
```

#### 第2步：在webpack.config.js文件里配置postcss-loader

webpack.config.js

```
const webpackConfig = {
  ...
  //module此处为loader区域，一般文件内容解析，处理放在此处，如babel，less,postcss转换等
  module: {
    rules: [
     ...
     {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              require('autoprefixer')(), // 给css自动添加前缀
            ],
          },
        },
      },
     ...
    ]
  },
  ...
}
```

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-3-3-2-1.png)

#### 第3步：在package.json里配置browserslist

package.json

```
  "browserslist": {
    "production": [
      ">1%",
      "last 1 versions",
      "ie>=8",
      "Firefox> 20",
      "Chrome > 31"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
```

第4步：打包验证结果

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-3-3-4-1.png)

至此，表示webpack中集成postcss成功。

### 3.4 对样式文件进行单独打包

正如上文看到的，我们正常打包，css样式是以style标签的形式直接内联在html页面中的，随HTML页面一同加载。根据w3c规范，我们是需要将样式文件单独提取出来，然后通过外部引用的。

#### 第1步：安装mini-css-extract-plugin插件

```
npm install -D mini-css-extract-plugin
```

#### 第2步：在webpack.config.js文件里配置mini-css-extract-plugin

webpack.config.js

```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackConfig = {
  ...
  //module此处为loader区域，一般文件内容解析，处理放在此处，如babel，less,postcss转换等
  module: {
    rules: [
     ...
     {
      test: /\.(css|less)$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,  // MiniCssExtractPlugin.loader 需要在css-loader之后解析
          },
          'css-loader',
          ...
        ]
     }      
     ...
   ]
 },
 plugins:[
   ...
   new MiniCssExtractPlugin(),
   ...
 ]
}
```

注意：module中loader需要放在css-loader前，取代原来style-loader的位置。style-loader 将 css 直接写入到html页面中，而MiniCssExtractPlugin 是将 css 单独提取成一个 .css 文件。

#### 第3步：打包验证

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-3-4-3-1.png)

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-3-4-3-2.png)
至此，完成了对样式文件的单独打包。

### 4. 对image进行打包

当我们正常在项目中引入一张图片时

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-4-0-1.png)
然后用webpack打包时，会报错，表示图片无法处理，需要一个loader来处理它。

#### 第1步：安装url-loader、file-loader

```
npm install -D url-loader file-loader
```

第2步：在webpack.config.js文件里配置url-loader
webpack.config.js

```
const webpackConfig = {
  ...
  //module此处为loader区域，一般文件内容解析，处理放在此处，如babel，less,postcss转换等
  module: {
    rules: [
     ...
      //loader-image
     {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: /node_modules/,
        include: [resolve('../public/images')],
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '[name].[ext]',
          outputPath: '/images'
        }
      },
       //loader-font
      {
        test: /\.(woff|eot|ttf|svg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'font/[name].[ext]'
        }
      }
     ...
   ]
 },
...
}
```

说明： loader-image 会根据 配置里的 include,outputPath,name 在打包时对项目里的image引用url进行替换.

注意： loader-image 的 outputPath 尽量与开发目录中的名字保持一致，否则在配合webpack-dev-server时，会因为打包后的路径与开发目录对应不上而无法显示。

第三步： 打包验证

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-4-3-1.png)

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/3-4-3-2.png)

至此，用webpack打包图片成功。

至此， webpack 集成 react 开发相关的 插件已完毕，已可以正常完成编写打包，发布流程。

## 四、 热更新

为什么需要热更新？因为我们在开发时，经常需要调试代码，查看代码在浏览器中的效果，如果不通过热更新，那么每次的查看都需要 build一次代码，这个过程是非常费时的。

webpack-dev-server 有许多配置参数，这里只做了一个简单的集成，具体的参数可以参考[官方文档](https://webpack.docschina.org/configuration/dev-server/)。

#### 第1步： 安装webpack-dev-server

```
npm install -D webpack-dev-server
```

#### 第2步：在webpack.config.js文件里配置webpack-dev-server

webpack.config.js

```
//打包模式:'production' or development' 
mode:'development',

const webpackConfig = {
  ...
  target: 'web', //必须添加此配置，才能实现浏览器的实时刷新
  devServer: {
    port: 8090,
    contentBase: resolve('../public'),  //当存在静态资源时，此项必须有。指向开发的静态资源目录，配合url-loader的outPath，匹配文件中的静态资源引用地址
    open: true,    //启动后是否在浏览器自动打开
  },
  ...
```

注意： 此处需要将 mode 调整为 development。

#### 第3步：在package.json里配置webpack的调试命令

package.json

```json
  "scripts":{
    "start": "webpack serve --config ./scripts/webpack.config.js" 
  },
```

#### 第4步： 执行启动命令并运行结果

```
npm run start
```

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/4-4-1.png)

并在编辑器中修改文件内容，会在浏览器中看到内容的实时更新。

至此，完成了webpack的热更新功能集成。

## 五、将配置文件拆分成Prod与Dev环境

如上，已完成了一个简单的react-webpack框架的集成与使用，但真正用到生产环境中时，咱们还需要做的更精细一些。

#### 第一步：安装webpack-merge

```
npm install -D webpakc-merge
```

#### 第二步：拆配置文件

将之前的单个webpack.config.js文件拆成 3个文件

> `webpack.base.config.js`: 用来管理通用dev与prod环境下的通用配置项

> `webpack.dev.config.js`: 用来管理只存在于dev环境下的配置项，如 dev-server

> `webpack.prod.config.js`: 用来管理只存在与prod环境系的配置项

结果分别如下：
webpack.base.config.js

```
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// 将相对路径解析为绝对路径，__dirname为当前文件所在的目录下，此处为./webpack文件夹
function resolve (relatedPath) {
  return path.join(__dirname, relatedPath)
}

const webpackConfigBase = {
  // entery为webpack解析的入口（解析各种包依赖关系的入口），而不是项目访问的入口
  // 官网描述：指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始
  entry: {
    app: [ resolve('../src/index.js') ]
  },

  // output为项目打包后的输出位置
  // 官网描述：告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist
  output: {
    path: resolve('../dist'), // path为打包后的输出文件夹位置，此处为 ./dist文件夹
    filename: 'bundle.js' // 打包后的入口文件的文件名
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
        include: [ resolve('../public/images') ],
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
      template: './scripts/templates/index.html' // 引用模板html文件生成项目的入口文件html
    }),
    new MiniCssExtractPlugin()
  ]
}
module.exports = webpackConfigBase
```

webpack.dev.config.js

```
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
    port: 8090
    // historyApiFallback: true, // 为true时，当路径找不到时，即404时，会重新加载本页面，否则报错。当react-router为BrowserRouter时，需要配置为true,否则原路径刷新报错，此时也可以用HashRoute来代替
    // compress: true, // enable gzip compression
    // proxy: { // proxy URLs to backend development server
    //   '/api': 'http://localhost:3000'
    // },
  }
}

module.exports = merge(webpackConfigBase, webpackConfigDev)

```

webpack.prod.config.js

```
const { merge } = require('webpack-merge')
const webpackConfigBase = require('./webpack.base.config')

const webpackConfigProd = {
  mode: 'production'
}
module.exports = merge(webpackConfigBase, webpackConfigProd)

```

#### 第三步：修改package.json中webpack的启动命令

package.json

```json
  "scripts":{
    "build": "webpack --config ./scripts/webpack.prod.config.js",
    "start": "webpack serve --config ./scripts/webpack.dev.config.js",
  },
```

至此，完成了webpack生产环境与开发环境下配置文件的拆分。

## 六、分离manifest

在使用 webpack 构建的典型应用程序或站点中，有三种主要的代码类型：

* 你或你的团队编写的源码。
* 你的源码会依赖的任何第三方的 library 或 "vendor" 代码。
* webpack 的 runtime 和 manifest，管理所有模块的交互。

manifest包含了对每个chunk、一些代码变量的的映射，runtime 会通过 manifest 来解析和加载模块。

### manifest概念

当 compiler 开始执行、解析和映射应用程序时，它会保留所有模块的详细要点。这个数据集合称为 "manifest"，当完成打包并发送到浏览器时，runtime 会通过 manifest 来解析和加载模块。

无论你选择哪种 模块语法，那些 import 或 require 语句现在都已经转换为 __webpack_require__ 方法，此方法指向模块标识符(module identifier)。通过使用 manifest 中的数据，runtime 将能够检索这些标识符，找出每个标识符背后对应的模块。

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/6-0-1.png)

当打开一个 index.html 文件时，需要通过manifest数据来加载与链接打包后的chunk

默认情况下，manifest代码会与其他部分代码一起打包进 bundle.js文件，且一般的文件的头部与尾部

### 为什么要分离manifest

当使用hash来作为bundle的文件名时(为了使用缓存来提高加载及编译速度)，每次内容修改后会产生2个部分的变化

* 修改内容时，代码变化导致的相应chunk的变化（会重新打一个新的chunk包，带来的chunk的 hash的变化）
* 重新构建时，manifest数据的变化（因为包含了对每个chunk的映射，所以当chunk的hash name改变时，manifest数据也会发生变化。甚至可以理解为，每次构建，manifest数据都会发生变化）

为了避免产生不必要的hash更改，可以将一些经常变化，或者基本不会产生变化的部分单独拆分成一个chunk。如当将react部分的library单独拆分成一个chunk，不包含manifest的内容时，每次业务代码的修改，都不会让这个chunk的hash发生改变，
从而能利用缓存来加载，提高编译与加载效率。

### 为什么要内联到html中

因为拆出来的runtime chunk文件非常小，大约2kb左右，内联到html中，可以减少一次 http请求。

### 拆分步骤

#### 第1步： 安装react-dev-utils

```
npm install -D react-dev-utils
```

react-dev-utils 包是 create-react-app 脚手架用来webpack打包的一个工具库，这里主要用到他的 InlineChunkHtmlPlugin 插件，支持对于多entry的内联。也有inline-manifest-webpack-plugin等，不过貌似只能支持一个 entry。

#### 第二步：在webpack.config.base.js文件里配置相关使用

webpack.config.base.js

```javascript
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')

const webpackConfigBase = {
  ...
  // output为项目打包后的输出位置
  // 官网描述：告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist
  output: {
    path: resolve('../dist'), // path为打包后的输出文件夹位置，此处为 ./dist文件夹
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

  plugins: [
    // 为项目生成一个可以访问的html文件，否则全是.js文件，没有访问的页面入口。默认为index.html,路径是基于根目录的相对路径
    new HtmlWebpackPlugin({
      template: './scripts/templates/index.html' // 引用模板html文件生成项目的入口文件html
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [ /runtime-.+[.]js/ ]), // 内联也可以尝试inline-manifest-webpack-plugin
    ...
  ]
  ...
```

说明：这里的 runtimeChunk的写法是针对多入口文件的，通过不同的entry产生不同的runtime chunk,然后再通过inlineChunkHtmlPlugin内连到不同的html文件中。

#### 第三步：打包验证结果

![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/6-3-1.png)

如图，可见html中多了一段 `<script>` 脚本，其就是提取出来的manifest代码片段，与js文件夹下的 runtime-app.[hash].js内容一致

## 七、多入口文件处理

#### 第一步：新建一个html模板

> 在 scripts/templates 目录下新建html文件，并给定id等作为选择器，方便js定位
dashboard.html

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>Dashboard</title>
</head>

<body>
    <div id="dashboard" class="root"></div>
</body>

</html>
```

#### 第二步：新建一个js入口文件，并指定上一步html的节点作为根节点

src/dashboard.js

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

const App = () => {
  return (
    <div>
      Hello Dashboard
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('dashboard'))
```

#### 第三步：在webpack.base.config.js文件中添加多文件入口

```javascript
const webpackConfigBase = {
  ...
  entry: {
    ...
    dashboard: [ resolve('../src/dashboard.js') ]
  },
  ...
  plugins: [
    // 为项目生成一个可以访问的html文件，否则全是.js文件，没有访问的页面入口。默认为index.html,路径是基于根目录的相对路径
    new HtmlWebpackPlugin({
      filename: 'index.html', // 打包输出的html文件名,当多入口时，必须配置此项，否则会报输出文件名相同错误
      template: './scripts/templates/index.html' // 引用模板html文件生成项目的入口文件html
    }),
    new HtmlWebpackPlugin({
      filename: 'dashboard.html', // 打包输出的html文件名
      template: './scripts/templates/dashboard.html' // 引用模板html文件生成项目的入口文件html
    }),
    ...
  ]
  ...
}
```

注意：HtmlWebpackPlugin插件的filename字段，当多入口时，必须配置此项，否则会报输出文件名相同错误

#### 第四步：打包并验证结果

```
npm run build
```

打包后结果如图
![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/7-4-1.png)

打开浏览器访问效果
![](https://raw.githubusercontent.com/yangin/code-assets/main/webpack-react-demo/images/7-4-2.png)
