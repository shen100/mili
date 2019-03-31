const path = require('path');
const webpack = require('webpack');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const merge = require('webpack-merge');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const common = require('./webpack.common.js');

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap(merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        // Tell the server where to serve content from. This is only necessary if you want to
        // serve static files. devServer.publicPath will be used to determine where the bundles
        // should be served from, and takes precedence.
        contentBase: path.join(__dirname, 'public'),
        hot: true,
        overlay: true,
        public: 'https://dev.golang123.com',
        host: '0.0.0.0',
        port: 9906,
        inline: true,
        headers: {
            'static-server': 'webpack-dev-server',
        },
        disableHostCheck: true,
        open: true,
        // openPage: '',
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,
            },
        },
    },
    plugins: [
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: require('./public/js/dll/tiptap-manifest.json'),
        // }),
        new webpack.HotModuleReplacementPlugin(),
        new VueLoaderPlugin(),
    ],
}));
