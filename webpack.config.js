var path = require('path');
var webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: './src/main.js',
    output: { path: './build/', filename: 'main.js' },
    resolve: {
        extensions: ['', '.scss', '.css', '.js', '.json'],
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['jsx', 'babel'],
                exclude: /node_modules/
            },
            {
                test: /(\.scss|\.css)$/,
                loaders: ['style', 'css', 'sass']
            }
        ]
    }
};
