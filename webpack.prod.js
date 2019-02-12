const path = require('path');
const copy = require('recursive-copy');
const through = require('through2');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const common = require('./webpack.common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const MyInjectWebpackPlugin = require('./my-inject-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const walk = require('walk');
const viewInjects = [];

const walkOptions = {
    listeners: {
        file: function (root, fileStats, next) {
            if (fileStats.name.indexOf('.njk') >= 0) {
                let viewDir = root.replace(__dirname + path.sep + 'views', '');
                if (viewDir) {
                    viewDir += path.sep;
                }
                if (viewDir.charAt(0) === path.sep) {
                    viewDir = viewDir.substr(1);
                }

                const viewName = viewDir + fileStats.name;
                viewInjects.push(new MyInjectWebpackPlugin({
                    viewDir: path.join(__dirname, 'views'),
                    viewName: viewName,
                    jsDirName: 'js',
                    cssDirName: 'styles',
                    layoutDirname: 'layout',
                }));
            }
            next();
        },
        errors: function (root, nodeStatsArray, next) {
            process.exit(-1);
        }
    }
};

// walk.walkSync(path.join(__dirname, 'views', 'pages'), walkOptions);

const injectAssets = `

{% block css %}
  {% if env !== 'development' %}
    <% for (let css in htmlWebpackPlugin.files.css) { %>
    <link href="<%= htmlWebpackPlugin.files.css[css] %>" rel="stylesheet">
    <% } %>
  {% endif %}
{% endblock %}

{% block js %}
  {% if env !== 'development' %}
    <% for (let chunk in htmlWebpackPlugin.files.chunks) { %>
    <script src="<%= htmlWebpackPlugin.files.chunks[chunk].entry %>"></script>
    <% } %>
  {% endif %}
{% endblock %}`;

const sourceNjk = path.join(__dirname, 'views');
const distNjk = path.join(__dirname, 'dist', 'njk');

const copyOptions = {
    transform: function(src, dest, stats) {
        if (path.extname(src) !== '.njk') { return null; }
        return through(function(chunk, enc, done)  {
            var output = chunk.toString();
            // 查找 {{ loadjs('entry/index.js') }} 得到entry
            output += injectAssets;
            done(null, output);
        });
    }
};

viewInjects.push(new HtmlWebpackPlugin({
    filename: '../views/pages/signup.njk',
    template: './dist/njk/pages/signup.njk',
    minify: false,
    chunks: ['runtime', 'vendor', 'common', 'entry/signup'],
    inject: false
}));

module.exports = () => {
    return new Promise(async (resolve, reject) => {
        await copy(sourceNjk, distNjk, copyOptions);
  
        const config = merge(common, {
            mode: 'production',
            devtool: 'source-map',
            output: {
                filename: 'js/[name].[contenthash:8].js',
                chunkFilename: 'js/[name].[contenthash:8].js',
            },
            performance: {
                hints: 'warning', // false | "error" | "warning"
                maxEntrypointSize: 200000, // bytes
                maxAssetSize: 200000 // bytes
            },
            optimization: {
                runtimeChunk: 'single',
                splitChunks: {
                    cacheGroups: {
                        default: false,
                        vendors: false,
                        iview: {
                            name: 'iview',
                            priority: 2,
                            test: /[\\/]node_modules[\\/]iview[\\/]/

                        },
                        vendor: {
                            name: 'vendor',
                            test: /[\\/]node_modules[\\/]/,
                            chunks: 'all',
                            enforce: true,
                            priority: 1
                        },
                        common: {
                            name: 'common',
                            chunks: 'all',
                            minChunks: 2,
                            enforce: true,
                            priority: 0
                        }
                    }
                }
            },
            performance: {
                hints: 'warning',
                maxEntrypointSize: 200000, // bytes
                maxAssetSize: 200000 // bytes
            },
            plugins: [
                new BundleAnalyzerPlugin({
                    openAnalyzer: false,
                    analyzerMode: 'static',
                    reportFilename: 'bundle-analyzer-report.html'
                }),
                new webpack.HashedModuleIdsPlugin(),
                // webpack 4+, 使用 mode 选项, 不需要DefinePlugin了
                // new webpack.DefinePlugin({
                //     'process.env.NODE_ENV': JSON.stringify('production')
                // }),
                new CopyWebpackPlugin([{
                    from: path.join(__dirname, 'public', 'images'),
                    to: './images' // 目标地址，相对于output的path目录
                }]),
                new VueLoaderPlugin(),
                // new ExtractTextPlugin('styles/[name].[chunkhash:16].css'),
                new MiniCssExtractPlugin({
                    filename: 'styles/[name]-[contenthash:16].css',
                    chunkFilename: 'styles/[name]-[contenthash:16].css',
                }),
                new OptimizeCssAssetsPlugin(),
                // new UglifyJSPlugin({
                //     sourceMap: true
                // }),
                ...viewInjects
            ]
        });

        resolve(config);
    });
};