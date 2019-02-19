const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = [{
    entry: path.resolve(__dirname, 'src/server.js'),
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    devtool: 'source-map',
    module: {
        rules: [{
            enforce: 'pre',
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'eslint-loader',
                options: {
                    fix: true
                }
            }
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    },
    externals: [nodeExternals()],
    mode: 'production',
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    cache: true,
                    parallel: true,
                    output: {
                        comments: false,
                        semicolons: false
                    }
                }
            })
        ]
    }
}];