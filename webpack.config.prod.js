const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const dotenv = require('dotenv').config({path: '.env'});

// call dotenv and it will return an Object with a parsed key 
const env = dotenv.parsed;

// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
prev[`process.env.${next}`] = JSON.stringify(env[next]);
return prev;
}, {});

const config = {
    mode: "production",
    entry:  path.join(__dirname, '/static/index.jsx'),
    output: {
        path: __dirname + '/static/dist/',
        filename: 'bundle.js',
        publicPath: '/'
    },
    resolve: {
        extensions: [".js", ".jsx", ".css"]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.html$/,
                use: [
                  {
                    loader: "html-loader",
                    //options: { minimize: true }
                  }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            path: __dirname + '/static/dist',
            filename: 'styles.css',
        }),
        new webpack.DefinePlugin(envKeys),
        new HtmlWebpackPlugin({
          inject: false,
          hash: true,
          template: './static/index.html',
          filename: 'index.html'
        })
    ]
};

module.exports = config;
