const webpack 			   = require('webpack');
const path 				   = require('path');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

var entryArr = [
    'article/edit',
    'admin/index',
    'signup/index',
    'signin/index',
    'changePwd/index',
    'forgetPwd/index'
];

function getEntryMap() {
    var entryMap = {};
    entryArr.forEach(function(key) {
        entryMap[key] = ['./client/javascripts/' + key + '.js'];
    });
    entryMap['vendor'] = [
        'vue'
    ];
    return entryMap;
}

module.exports = {
	devtool: '#cheap-module-eval-source-map',
	entry: getEntryMap(),
	output: {
		path: path.resolve(__dirname, './dist/static'),
		filename: './javascripts/[name].js',
		publicPath: '/',
		chunkFilename : './javascripts/[name].js'
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
				loader: 'css-loader'
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'images/[name].[hash:7].[ext]'
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
				test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
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

	    new FriendlyErrorsPlugin(),
	    new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor', 
            filename: './javascripts/vendor.js'
        }),
	]
}