const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const stylesPath = path.join(__dirname, 'public', 'styles');
const jsPath = path.join(__dirname, 'public', 'js');

const publicPath = process.env.PUBLIC_PATH || 'https://dev.golang123.com/';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

// https://vue-loader.vuejs.org/zh/
module.exports = {
    mode: 'development',
    entry: {
        'entry/index': './public/js/entry/index.js',
        'entry/signin': './public/js/entry/signin.js',
        'entry/signup': './public/js/entry/signup.js',
        'entry/user/user': './public/js/entry/user/user.js',
        'entry/article/articleDetail': './public/js/entry/article/articleDetail.js',
        'entry/collection/collection': './public/js/entry/collection/collection.js',
        'entry/collection/edit': './public/js/entry/collection/edit.js',
        'entry/editor/editMarkdownDraft': './public/js/entry/editor/editMarkdownDraft.js',
        'entry/editor/editRichDraft': './public/js/entry/editor/editRichDraft.js',
        'entry/editor/drafts': './public/js/entry/editor/drafts.js',
        'entry/admin/app': './public/js/entry/admin/app.js',
    },
    output: {
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        path: path.join(__dirname, 'dist', 'public'),
        publicPath: publicPath,
    },
    module: {
        rules: [
            // {
            //     enforce: 'pre',
            //     test: /\.(js|vue)$/,
            //     loader: 'eslint-loader',
            //     exclude: /node_modules/,
            //     options: {
            //         formatter: eslintFriendlyFormatter
            //     }
            // },
            {
                test: /\.vue$/,
                // exclude: file => {
                //     console.log('------', file);
                //     return /node_modules/.test(file) && !/\.vue\.js/.test(file)
                // },
                use: {
                    loader: 'vue-loader',
                }
            },
            {
                test: /\.js$/,
                exclude: file => (
                    /node_modules/.test(file) && !/\.vue\.js/.test(file)
                ),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        // cacheDirectory: true,
                        plugins: [
                            'syntax-dynamic-import',
                            'transform-object-rest-spread',
                            [
                                'import', {
                                    libraryName: 'iview',
                                    libraryDirectory: 'src/components',
                                },
                            ],
                        ],
                    },
                },
            },
            {
                test: /\.(sc|sa|c)ss$/,
                use: [
                    process.env.NODE_ENV !== 'production' ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: process.env.NODE_ENV !== 'production'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            sourceMap: process.env.NODE_ENV !== 'production',
                            plugins: loader => [
                                require('autoprefixer')({
                                    browsers: [' > 0.15% in CN ']
                                })
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: process.env.NODE_ENV !== 'production'
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[hash:16].[ext]',
                            outputPath: 'images/'
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: '[name].[hash:16].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'public')
        },
        extensions: ['.js', '.vue', '.css', '.scss']
    },
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
    ]
};
