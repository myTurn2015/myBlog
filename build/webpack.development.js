console.log('进入development');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseWebpackConfig = require('./_base');

var devConfig = merge(baseWebpackConfig, {
    module: {
        rules: [
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'sass-loader']
                })
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: '../views/index.html',
            template: 'index.html',
            inject: true
        }),
        new ExtractTextPlugin('styles/site.css')
    ]
});

module.exports = devConfig;