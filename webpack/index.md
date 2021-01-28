### loader
loader是指对(文件)进行处理实现打包
1. file-loader：处理图片、excel、字体等非js文件，直接复制到打包文件目录下，导入的是路径
    ```js
    module.export = {
        module: {
            // 模块处理规则
            rules: [
                {
                    test: /.\jepg$/,
                    use: {
                        loader: "file-loader",
                        // name是原文件名，ext是扩展名
                        name: "[name]_[hash].[ext]"，
                        // 打包目录下的路径
                        outputPath: "images/"
                    }
                }
            ]
        }
    }
    ```
1. url-loader是file-loader的升级版，可以将图片处理为base64，导入的就是base64的字符串
    ```js
     module.export = {
        module: {
            rules: [
                {
                    test: /.\jepg$/,
                    use: {
                        loader: "url-loader",
                        // name是原文件名，ext是扩展名
                        name: "[name]_[hash].[ext]",
                        // 超过size大小的限制就退化为file-loader,否则base64处理减少http请求
                        limit: 2049
                    }
                }
            ]
        }
    }
    ```
1. style-loader: 将css样式利用<style>注入
1. postcss-loader: 添加浏览器前缀
    ```js
    module.export = {
        module: {
            rules: [
                {
                    test: /.\css$/,
                    use: [
                        "style-loader",
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                indent: '',
                                plugins: [
                                    require("autoprefix"),
                                    // ...
                                ]
                            }
                        }
                    ]
                }
            ]
        }
    }
    ```
1. babel-loader
    1. @babel/polyfill, 全局变量方式注入
    ```js
    module.export = {
        module: {
            rules: [
                {
                    test: /.\js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        target: {
                                            "Android": '6.0'
                                        },
                                        useBuildIns: "usage" // polyfill按需加载, 实验性功能
                                        corejs: 2
                                    }
                                ]
                            ]

                        }
                    }
                }
            ]
        }
    }
    ```
    1. @babel/plugin-transform-runtime
        1. 不会全局污染,也不会对原型上的方法进行polyfill
        1. 安装： @babel/plugin-transform-runtime @babel/transform
            ```js
            module.export = {
                module: {
                    rules: [
                        {
                            test: /.\js$/,
                            exclude: /node_modules/,
                            use: {
                                loader: "babel-loader",
                                options: {
                                    plugins: ["@babel/plugin-transform-runtime"]
                                }
                            }
                        }
                    ]
                }
            }
            ```
1. 自定义loader
    1. loader就是一个简单的声明式普通函数，最模块的源码进行操作
        ```js
        module.export = function (source) {
            // source是模块代码的字符串
            return source.replace('xx','yy');
        }
        ```
    1. loader-utils，用来处理loader配置的options参数
    1. this.query是loader传的options
    1. this.callback，除了转换的内容还需要返回其他内容，如sourceMap，Ast。loader函数里需要返回undefined
        ```js
        module.export = function (source) {
            this.callback({
                // 无法装换原内容时的Error
                err: Error || null,
                // 装换后的的内容，如上述的source
                content: string | Buffer,
                // 用于通过装换后的内容得出原内容的Source Map，方便调试
                // 我们了解到，SourceMap我们只是会在开发环境去使用，于是就会变成可控制的，
                // webpack也提供了this.sourceMap去告诉是否需要使用sourceMap，
                // 当然也可以使用loader的option来做判断，如css-loader
                sourceMap?: SourceMap,
                // 如果本次转换同时生成ast语法树，也可以将这个ast返回，方便后续loader需要复用该ast，这样可以提高性能
                abstractSyntaxTree? AST
            })
            return;
        }
        ```
    1. this.async处理loader里的异步事件，loader函数入参的源代码，也要返回处理后的代码字符串
        ```js
        module.export = function (source) {
            // source是模块代码的字符串
            const callback = this.async();
            setTimeout(() => {
                // 第一个参数是err
                // result是source处理后的结果
                callback(null, result);
            }, 1000);
        }
        ```
    1. 路径处理
        ```js
        // webpack.config.js
        module.export = {
            resolveLoader: {
                modules: ["node_modules", "./loader"]
            },
            module: {
                rules: {
                    test: /.\js$/,
                    use: [
                        {
                            loader: 'xxx'
                        }
                    ]
                }
            }
        }
        ```

### plugins
类似生命周期，在构建过程中利用钩子函数做一些处理
1. html-webpack-plugin，生成html文件，并将打包产出的js文件导入html
    1. html中读取配置项参数
        ```js
        // webpack.config.js
        plugins: [new HtmlWebpackPlugin({
            template: '',
            filename: '',
            title: '',
            inject: true | 'body' | 'head', // true或body导入的js资源放在body
        })]

        // html
        htmlWebpackPlugin.options.title
        ```
1. clean-webpack-plugin, 打包前删除之前的生成目录
    ```js
    const {CleanWebpackPlugin} = require('clean-webpack-plugin');
    module.export = {
        plugins: [
            new CleanWebpackPlugin()
        ]
    }
    ```
1. mini-css-extract-plugin，抽离css文件,利用<link>注入样式文件，不再使用style-loader注入样式
    ```js
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    module.export = {
        module: {
            rules: [
                {
                    test: /.\css$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader"]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css'
            })
        ]
    }
    ```
### 自定义plugin
1. 钩子,插件的执行时机
    - entryOptions: 在webpack选项中的entry配置项处理过之后，执行插件
    - afterPlugins: 设置完初始插件之后执行插件
    - compilation: 编译创建之后，文件生成之前，执行插件
    - emit: 生成资源到output之前
    - done: 编译完成
1. 触发钩子，执行回调
    - tap：以同步方式触发钩子
    - tapAsync：以异步方式触发钩子；
    - tapPromise：以异步方式触发钩子，返回 Promise；


### sourceMap
1. 源代码与打包后的文件映射关系
    ```js
    module.export = {
        devtool: "source-map"
    }
    ```
1. devtool参数
    - eval: eval包裹map
    - cheap: 较快，只管行信息
    - source-map：生成.map文件
    - module： 第三方库，包含loader的map
    - inline-source-map: 将map注入到打包文件
1. 推荐配置： 
    - devtool: "cheap-module-eval-source-map", // 开发环境
    - devtool: "cheap-module-source-map" // 生产环境

### WebpackDevServer
1. 跨域
```js
module.export = {
    // 不会生成打包文件，直接存在内存里
    devServer: {
        contentBase: './build',
        open: true，// 打开浏览器
        port: '8080'，
        // 设置代理，可以用于mock数据解决跨域问题
        proxy: {
            "/api": {
                target: "http://localHost:9090"
            }
        }
    }
}
```
1. Hot Module Replace,HMR 热更新,不用刷新浏览器
    ```js
    const webpack = require('webpack');
    module.export = {
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ],
        devServer: {
            hot: true,// 开启热更新
            hotOnly: true, // 即使热更新失败，浏览器也不刷新
        }
    }
    ```
1. js模块主动热更新，入口文件
    ```js
    // js
    if (module.hot) {
        module.hot.accpet('./a.js', () => {

        })
    }
    ```

### webpack-merge
```js
const merge = require('webpack-merge');
const commonConfig = require('./webpack.config.js');

const devConfig = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map'
};

module.export = merge(commonConfig, devConfig);
```

### 性能优化
##### tree shaking
生产环境下，没有引用的代码不会构建
```js
module.export = {
    optimization: {
        usedExports: true
    }
}

// package.json
// "sideEffects": false
"sideEffects": ["*.css"]// 除css文件外，没有被引入的代码不构建，即必须import xxx from xxx;使用
```

##### code splitting
打包的时候将不会改变的公共库分离出来打包，生成多个文件，可以通过多入口方式方式实现，也可以使用optimiztion
```js
module.export = {
    optimization: {
        splitChunks: {
            chunks: 'all', // 对同步和异步引入的模块都有效
            minSize: 30000, // 模块分割的最小size
            miniChunks: 2, // 分割的模块只要被引用两次
            name: true, // 可设置chunk名字
            cacheGroups: {
                vendor: {
                    test: //
                    priority: 10,
                    filename: '' // 重置名字
                },
                default: {

                }
            }
        }
    }
}
```
##### webpackPrefetch
异步加载js代码，在浏览器空闲时加载部分js代码，提高渲染性能
```js
document.addEventListener('click', () => {
    import(/* webpackPrefetch: true */'./click.js').then(({ default: func }) => {
        func()
    })
})
```

##### dll动态链接库
事先把常用但又构建时间长的代码提前打包好（例如 react、react-dom），取个名字叫 dll。后面再打包的时候就跳过原来的未打包代码，直接用 dll。这样一来，构建时间就会缩短，提高 webpack 打包速度
1. dll打包脚本，相当于第一次请求资源的缓存，创建映射表
    ```js
    // webpack.dll.js
    const path = require('path');
    const webpack = require('webpack');

    module.exports = {
        mode: 'production',
        entry: {
            react: ['react', 'react-dom'],
        },
        // 这个是输出 dll 文件
        output: {
            path: path.resolve(__dirname, '../dll'),
            filename: '_dll_[name].js',
            library: '_dll_[name]',
        },
        // 这个是输出映射表
        plugins: [
            new webpack.DllPlugin({ 
                name: '_dll_[name]', // name === output.library
                path: path.resolve(__dirname, '../dll/[name].manifest.json'),
            })
        ]
    };
    ```
1. 链接dll文件
    ```js
    const path = require('path');
    const webpack = require('webpack');

    module.export = {
        // ...
        plugins: [
            new webpack.DllReferencePlugin({
                // 注意: DllReferencePlugin 的 context 必须和 package.json 的同级目录，要不然会链接失败
                context: path.resolve(__dirname, '../'),
                manifest: path.resolve(__dirname, '../dll/react.manifest.json'),
            })
        ]
    }
    ```

##### happyPack
多进程并行执行
```js
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });// 并行数等于CPU数

module.export = {
    module: {
        rules: [
            {
                test: /.\js$/,
                //把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
                loader: 'happypack/loader?id=happyBabel'
            }
        ]
    },
    plugins: [
        new HappyPack({
            //用id来标识 happypack处理那里类文件
            id: 'happyBabel',
            //如何处理  用法和loader 的配置一样
            loaders: [{
                loader: 'babel-loader',
            }],
            //共享进程池
            threadPool: happyThreadPool,
            //允许 HappyPack 输出日志
            verbose: true,
        })
    ]
}
```


##### 动态加载

##### 多入口多html
### 原理