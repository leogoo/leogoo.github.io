### 最简单的webpack使用方式
1. 全局命令
    1. 安装： `yarn global add webpack webpack-cli`
    1. 执行全局命令： `webpack index.js --mode development`，默认是production模式，打包文件后的文件是压缩过的
1. 局部使用
    1. 创建项目： `npm init -y`
    1. 项目下，`yarn add -D webpack webpack-cli`
    1. 入口文件默认是src/index
    1. 设置package文件中scripts：
        ```js
        script: {
            build: "webpack --mode development"
        }
        ```
    1. 打包： `yarn build`,生成dist/main.js

### 打包js同时生成html
1. 插件HtmlWebpackPlugin，生成html且自动将打包生成的js文件导入
1. webpack.config.js
    ```js
    var HtmlWebpackPlugin = require('html-webapck-plugin');
    module.exports = {
        entry: './src/index.js',
        plugins: [new HtmlWebpackPlugin()]
    };
    ```
1. 生成文件，dist目录下main.js和index.html

### 多入口文件
生成多个打包文件dist/app.js, dist/home.js, 直接利用entry指定输出文件名
```js
module.exports = {
    mode: 'development',
    entry: {
        app: './src/app.js',
        home: './src/home.js'
    }
};
```

### output
1. 指定输出文件名, 生成文件dist/bundle.js
    ```js
    module.exports = {
        mode: 'development',
        entry: './src/index.js',
        output: {
            filename: 'bundle.js'
        }
    };
    ```
1. 防止浏览器缓存，每次生成的文件名加上hash(修改文件后，hash会变，且多个输出文件的hash值一致）。生成文件dist/app.hash.js、dist/home.hash.js
    ```js
    module.exports = {
        entry: {
            app: './src/index.js',
            home: './src/home.js'
        },
        output: {
            // name是entry中指定的输出文件名，hash:4加上4位hash值
            filename: "[name].[hash:4].js"
        }
    }
    ```
1. 指定输出路径
    ```js
    let path = require('path');
    module.exports = {
        entry: {
            app: './src/index.js',
            home: './src/home.js'
        },
        output: {
            filename: '[name].[hash:4].js',
            // 必须是绝对路径
            // path.join()是对路径的拼接
            // path.resolve()方法可以将多个路径解析为一个规范化的绝对路径。其处理方式类似于对这些路径逐一进行cd操作
            path: path.join(__dirname, 'outputs')
        }
    }
    ```

### loader
1. loader让webpack能够去处理那些非JavaScript文件（webpack自身只理解JavaScript）。loader可以将所有类型的文件转换为 webpack能够处理的有效模块
1. css-loader的作用是在js中import css文件时可以解析css文件；style-loader则是将css引入html中
    ```js
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    module.exports = {
        entry: './src/index.js',
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.css$/,
                    // 先执行的loader放在后面
                    loader: 'style-loader!css-loader'
                }
            ]
        },
        // 以指定模板生成html
        plugins: [new HtmlWebpackPlugin({template: './src/index.html'})]
    }
    ```
1. 使用less
    1. 先安装less: `yarn add -D less`
    1. 安装less-loader(替换css-loader处理less文件): `yarn add -D less-loader`
    ```js
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    module.exports = {
        entry: './src/index.js',
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader'
                },
                {
                    test: /\.less$/,
                    use: ['style-loader', 'css-loader', 'less-loader']
                }
            ]
        },
        // 以指定模板生成html
        plugins: [new HtmlWebpackPlugin({template: './src/index.html'})]
    }
    ```
1. 使用mini-css-extract-plugin插件拆分css

### 写一个plugin
1. loader 被用于转换某些类型的模块，而插件则可以用于执行范围更广的任务
1. webpack 插件是一个具有 apply 属性的 JavaScript 对象。apply 属性会被 webpack compiler 调用，并且 compiler 对象可在整个编译生命周期访问
    ```js
    const plugin = 'ConsoleLogOnBuildWebpackPlugin';
    class ConsoleLogOnBuildWebpackPlugin {
        apply(compiler) {
            compiler.hooks.run.tap(pluginName, compilation => {
                console.log("webpack 构建开始！！！");
            })
        }
    }
    ```

### 用webpack转换TypeScript
1. 直接转换
    1. 安装： `npm install -g tsc`
    1. 转换： `tsc filename`
1. 使用webpack
    1. 安装依赖： `yarn add -D ts-loader typescript`
    1. 配置tsconfig.json
        ```js
        {
            "compilerOptions": {
                "sourceMap": true
            }
        }
        ```
    1. webpack.config.js
        ```js
        module.exports = {
            mode: 'development',
            entry: './src/index.ts',
            module: {
                rules: [
                    {
                        test: /\.ts/,
                        loader: 'ts-loader'
                    }
                ]
            }
        }
        ```

### 热更新
1. 安装webpack-dev-server: `yarn add -D webpack-dev-server`
1. 配置script： `dev: webpack-dev-server`
1. 配置webpack.config.js
    ```js
    var HtmlWebpackPlugin = require('html-webpack-plugin');
    var webpack = require('webpack');
    module.exports = {
        entry: {
            app: './src/index.js'
        },
        mode: 'development',
        devServer: {
            contentBase: './dist',// 静态文件的地址
            hot: true, //启动热替换
            // host 默认localhost
            open: true // 打开浏览器
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'webpack'
            }),
            new webpack.HotModuleReplacementPlugin()
        ]
    }
    ```

### 同时支持开发和发布环境
1. 指定配置文件
    ```js
    script: {
        "dev": 'webpack --config webpack.dev.config.js',
        "build": 'webpack --config webpack.prod.config.js
    }
    ```
1. webpack配置文件
    ```js
    // webpack.dev.config.js

    // webpack.prod.config.js
    ```
1. 抽取开发和发布环境配置文件的公共部分
    ```js
    // webpack.base.config.js
    const path = require('path');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    // 抽取css部分生成文件
    const miniCssExtractPlugin = require('mini-css-extract-plugin');
    module.exports = {
        mode: 'development',
        entry: {
            index: './src/index.js'
        },
        output: {
            path: path.resolve(__dirname, './dist_dev')
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader"
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "less-loader"
                　　 ]
                },
                {
                    test: /\.(jpg|png|svg)/,
                    loader: ['file-loader']
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].[chunkhash:8].css",
                chunkFilename: "[id].css"
            }),
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: './src/index.html',
                title: 'dev_html'
            })
        ]
    };


    // webpack.prod.config.js
    const path = require('path');
    const WebpackMerge = require('webpack-merge');
    const baseConfig = require('./webpack.base.config.js');
    module.exports = WebpackMerge(baseConfig, {
        mode: 'production',
        output: {
            path: path.resolve(__dirname, './dist_prod')
        },
        plugins: [
            new CleanWebpackPlugin('dist_prod'),
            new HtmlWebpackPlugin({
                template: './src/index.html',
                title: ' prod_html'
            })
        ]
    })
    html模板中的title，`<%= htmlWebpackPlugin.options.title %>`

### 配置一个react项目