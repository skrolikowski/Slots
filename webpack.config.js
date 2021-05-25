const path = require('path')
const isDev = process.env.NODE_ENV !== 'production'
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/main.ts',
    devtool: 'source-map',
    mode: isDev ? 'development' : 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: {
            createjs: 'createjs/builds/1.0.0/createjs.js'
        },
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'dist/bundle.js',
        path: path.resolve(__dirname, 'dist'),
        // This line is VERY important for VS Code debugging to attach properly
        // Tamper with it at your own risks
        devtoolModuleFilenameTemplate: '../../[resource-path]',
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: "body",
            template: "src/index.html",
            favicon: false,

            // 'meta': {
            //     'Content-Security-Policy': { 'http-equiv': 'Content-Security-Policy', 'content': 'default-src https:' },
            //     // Will generate: <meta http-equiv="Content-Security-Policy" content="default-src https:">
            //     // Which equals to the following http header: `Content-Security-Policy: default-src https:`
            //     'set-cookie': { 'http-equiv': 'set-cookie', content: 'name=value; expires=date; path=url' },
            //     // Will generate: <meta http-equiv="set-cookie" content="value; expires=date; path=url">
            //     // Which equals to the following http header: `set-cookie: value; expires=date; path=url`
            // }
        }),
        new CleanWebpackPlugin()
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 3000,
        hot: true,
        compress: true,
    },
    optimization: {
        minimize: !isDev
    }
};