const path = require('path');
const copy = require('recursive-copy');
const through = require('through2');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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

const sourceNjk = path.join(__dirname, '../', 'views');
const distNjk = path.join(__dirname, '../', 'dist', 'views');
const viewInjects = [];

const copyOptions = {
    transform: function(src, dest, stats) {
        if (path.extname(src) !== '.njk') {
            return null;
        }
        return through(function(chunk, enc, done)  {
            let output = chunk.toString();
            if (src.indexOf('views/pages/') < 0) {
                done(null, output);
                return;
            }
            output += injectAssets;
            // 查找 {{ loadjs('entry/xxx.js') }} 得到entry
            let entry = output.match(/\{\{\s*loadjs\s*\(['"]([a-zA-Z0-9_\/\-]+)\.js['"]\)\s*\}\}/);
            entry = entry[1];

            viewInjects.push(new HtmlWebpackPlugin({
                filename: dest,
                template: dest,
                minify: false,
                chunks: ['runtime', 'vendor', 'common', entry],
                inject: false
            }));
            done(null, output);
        });
    }
};

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
                new CopyWebpackPlugin([
                    {
                        from: path.join(__dirname, 'fonts'),
                        to:  path.join(__dirname, 'dist', 'fonts'),
                    },
                    {
                        from: path.join(__dirname, 'images'),
                        to:  path.join(__dirname, 'dist', 'images'),
                    },
                    {
                        from: path.join(__dirname, 'js', 'libs'),
                        to:  path.join(__dirname, 'dist', 'js', 'libs'),
                    },
                    {
                        from: path.join(__dirname, 'styles', 'libs'),
                        to:  path.join(__dirname, 'dist', 'styles', 'libs'),
                    },
                ]),
                new VueLoaderPlugin(),
                new MiniCssExtractPlugin({
                    filename: 'styles/[name]-[contenthash:16].css',
                    chunkFilename: 'styles/[name]-[contenthash:16].css',
                }),
                new OptimizeCssAssetsPlugin(),
                ...viewInjects
            ]
        });

        resolve(config);
    });
};