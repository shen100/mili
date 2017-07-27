const webpack 			   = require('webpack');
const path 				   = require('path');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
	devtool: '#cheap-module-eval-source-map',
	entry: {
		index: './client/js/index.js'
	},
	output: {
		path: path.resolve(__dirname, './client/dist'),
		filename: '[name].js',
		publicPath: '/dist'
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			}, 
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}, 
			{
				test: /\.css$/,
				loaders: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'img/[name].[hash:7].[ext]'
				}
			}, 
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'media/[name].[hash:7].[ext]'
				}
			}, 
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'fonts/[name].[hash:7].[ext]'
				}
			}
		]
	},
	plugins: [
	    new webpack.DefinePlugin({
		    'process.env': '"development"'
	    }),

	    new webpack.HotModuleReplacementPlugin(),
	    new webpack.NoEmitOnErrorsPlugin(),

	    new FriendlyErrorsPlugin()
	]
}