const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd
const filename = (ext) => isDev ? `bundle.${ext}`:`bundle.[hash].${ext}`;
const jsLoader = ()=>{
    const loaders =[
        {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
                }
        }
    ]

    if (isDev) {
     loaders.push('eslint-loader')
    }
    return loaders
}


module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
   entry: ['@babel/polyfill', './index.js'],
   output: {
       path: path.resolve(__dirname, 'dist'),
       filename: filename('js')
   },
    devServer: {
        port: 5000,
        hot: isDev
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            'core': path.resolve(__dirname, 'src/core'),

        }
    },
    devtool: isDev ? 'source-map': false,
    plugins: [
        new HTMLPlugin({
            filename: 'index.html',
            template: 'index.html',
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
                ]}),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoader()

            }
        ],

    },

}
