/**
 * Created by Thinkpad on 2017/6/2.
 */
const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const postcssOpts = {
  ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
  plugins: () => [
    autoprefixer({
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
    }),
    pxtorem({ rootValue: 100, propWhiteList: [] })
  ],
};

module.exports = {

    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        // 为 webpack-dev-server 的环境打包代码
        // 然后连接到指定服务器域名与端口，可以换成本机ip

        'webpack/hot/only-dev-server',
        // 为热替换(HMR)打包好代码
        // only- 意味着只有成功更新运行代码才会执行热替换(HMR)

        './src/index.js'
        // 我们 app 的入口文件

    ],
    // string | object | array
    // 这里应用程序开始执行
    // webpack 开始打包

    output: {
        // webpack 如何输出结果的相关选项

        path: path.resolve(__dirname, 'dist'), // string
        // 所有输出文件的目标路径
        // 必须是绝对路径（使用 Node.js 的 path 模块）

        filename: 'bundle.js', // string
        // 「入口分块(entry chunk)」的文件名模板（出口分块？）

        publicPath: './', // string

        library: "MyLibrary", // string,
        // 导出库(exported library)的名称

        libraryTarget: "umd", // 通用模块定义
        // 导出库(exported library)的类型

        /* 高级输出配置（点击显示） */

    },

    module: {
        // 关于模块配置

        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: ['es2015', 'react', 'stage-0'],
                        plugins: [
                            'transform-runtime',
                            ['import', { libraryName: 'antd-mobile', style: true }]
                        ]
                    }
                }],
                include: [
                    path.resolve(__dirname, "src")
                ],
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ]
            },{
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        'css-loader',
                        {
                            loader: "postcss-loader",
                            options: postcssOpts
                        }
                    ],
                    fallback: "style-loader"
                })
                /*use: [{
                 loader: "style-loader"
                 },{
                 loader: "css-loader"
                 }]*/
            },{
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        'css-loader',
                        {
                            loader: "postcss-loader",
                            //options: postcssOpts
                        },
                        'less-loader'
                    ],
                    fallback: "style-loader"
                })
                /*use: [{
                 loader: "style-loader" // creates style nodes from JS strings
                 }, {
                 loader: "css-loader", // translates CSS into CommonJS
                 options: {
                 sourceMap: true
                 }
                 }, {
                 loader: "less-loader", // compiles Less to CSS
                 options: {
                 sourceMap: true
                 }
                 }]*/
            },{
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    fallback: "style-loader"
                })
                /*use: [{
                 loader: "style-loader" // 将 JS 字符串生成为 style 节点
                 }, {
                 loader: "css-loader", // 将 CSS 转化成 CommonJS 模块
                 option: {
                 sourceMap: true
                 }
                 }, {
                 loader: "sass-loader", // 将 Sass 编译成 CSS
                 options: {
                 sourceMap: true
                 }
                 }]*/
            },{
                test: /\.json$/,
                use: [{
                    loader: 'json-loader'
                }]
            },{
                test: /\.(png|jpg|gif|md)$/,
                use: ['file-loader?limit=10000&name=[md5:hash:base64:10].[ext]']
            },{
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: ['url-loader?limit=10000&mimetype=image/svg+xml']
            }
        ]
    },

    resolve: {
        // 解析模块请求的选项
        // （不适用于对 loader 解析）

        modules: [
            "node_modules",
            path.resolve(__dirname, "src")
        ],
        // 用于查找模块的目录

        extensions: ['.web.js', '.js', '.jsx', '.css', '.sass', '.scss', '.less', '.json'],
        // 使用的扩展名

        alias: {
            // 模块别名列表
        }
        /* 可供选择的别名语法（点击展示） */

        /* 高级解析选项（点击展示） */
    },

    performance: {
        hints: "warning", // 枚举
        hints: "error", // 性能提示中抛出错误
        hints: false, // 关闭性能提示
        maxAssetSize: 200000, // 整数类型（以字节为单位）
        maxEntrypointSize: 400000, // 整数类型（以字节为单位）
        assetFilter: function(assetFilename) {
            // 提供资源文件名的断言函数
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    },

    devtool: "source-map", // enum
    // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
    // 牺牲了构建速度的 `source-map' 是最详细的。

    context: __dirname, // string（绝对路径！）
    // webpack 的主目录
    // entry 和 module.rules.loader 选项
    // 相对于此目录解析

    target: "web", // 枚举
    // 包(bundle)应该运行的环境
    // 更改 块加载行为(chunk loading behavior) 和 可用模块(available module)

    //externals: ["react", /^@angular\//],
    // 不要遵循/打包这些模块，而是在运行时从环境中请求他们

    stats: "verbose",
    // 精确控制要显示的 bundle 信息

    devServer: {
        contentBase: path.join(__dirname, ''), // boolean | string | array, static file location
        compress: true, // enable gzip compression
        host:"localhost", // 指定使用一个 host。默认是 localhost
        port: 8080, //指定使用一个端口，默认是8080
        historyApiFallback: true, // true for index.html upon 404, object for multiple paths
        hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
        https: false, // true for self-signed, object for cert authority
        noInfo: true, // only errors & warns on hot reload
        inline: true  //实时刷新
        // ...
    },

    plugins: [
        //new webpack.optimize.UglifyJsPlugin(),

        new webpack.BannerPlugin('Created by Thinkpad'),

        new webpack.HotModuleReplacementPlugin(),
        // 开启全局的模块热替换（HMR）

        new webpack.NamedModulesPlugin(),
        // 当模块热替换（HMR）时在浏览器控制台输出对用户更友好的模块名字信息

        new ExtractTextPlugin("bundle.css"),
        // 生成独立的CSS文件

    ],
    // 附加插件列表

    /* 高级配置（点击展示） */

    resolveLoader: { /* 等同于 resolve */ },
    // 独立解析选项的 loader

    profile: true, // boolean
    // 捕获时机信息

    bail: true, //boolean
    // 在第一个错误出错时抛出，而不是无视错误。

    cache: false, // boolean
    // 禁用/启用缓存

    watch: true, // boolean
    // 启用观察

    watchOptions: {
        aggregateTimeout: 1000, // in ms
        // 将多个更改聚合到单个重构建(rebuild)

        poll: true,
        poll: 500, // 间隔单位 ms
        // 启用轮询观察模式
        // 必须用在不通知更改的文件系统中
        // 即 nfs shares（译者注：Network FileSystem，最大的功能就是可以透過網路，讓不同的機器、不同的作業系統、可以彼此分享個別的檔案 ( share file )）
    },

    node: {
        /* TODO */
    },

    recordsPath: path.resolve(__dirname, "dist/records.json"),
    recordsInputPath: path.resolve(__dirname, "dist/records.json"),
    recordsOutputPath: path.resolve(__dirname, "dist/records.json"),
    // TODO

};