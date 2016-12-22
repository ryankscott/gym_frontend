const webpack = require('webpack');

module.exports = {
	entry: './src/main.js',
	output: {
		publicPath: '/gym/build/',
		path: './build/',
		filename: 'main.js',
	},
	plugins: [
		new webpack.DefinePlugin({
			'__GYMCLASS_URL__': JSON.stringify(process.env.GYMCLASS_URL) || JSON.stringify(''),
		}),
	],
	module: {
		loaders: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015', 'react'],
			}
		}, {
			test: /(\.scss|\.css)$/,
			loaders: ['style', 'css', 'sass'],
		}, {
			test: /\.(jpe?g|png|gif|svg)$/i,
			loaders: [
				'file?hash=sha512&digest=hex&name=[hash].[ext]',
				'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
			]
		},

		],
	},
	sassLoader: {
		includePaths: [
			'./node_modules'
		]
	}
};
