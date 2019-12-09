const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    // https://webpack.js.org/concepts/entry-points/#multi-page-application
    entry: {
        index: './src/index.js',
        // login: './src/index.js',
        // dailyLog: './src/index.js',
        // register: './src/index.js'
    },

    // https://webpack.js.org/configuration/dev-server/
    devServer: {
        port: 8080,
        writeToDisk: false,
    },


    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },

    // https://webpack.js.org/concepts/plugins/
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true,
            chunks: ['index'],
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/login.html',
            // inject: true,
            // chunks: ['index'],
            filename: 'login.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/dailyLog.html',
            // inject: true,
            // chunks: ['index'],
            filename: 'dailyLog.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/register.html',
            // inject: true,
            // chunks: ['index'],
            filename: 'register.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/entryForm.html',
            // inject: true,
            // chunks: ['index'],
            filename: 'entryForm.html'
        })
    ]
};
