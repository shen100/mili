const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const stylesPath = path.join(__dirname, 'public', 'styles');
const jsPath = path.join(__dirname, 'public', 'js');

const publicPath = process.env.PUBLIC_PATH || 'http://dev.golang123.com/';

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

// https://vue-loader.vuejs.org/zh/
module.exports = {
    mode: 'development',
    entry: {
        'entry/index': './js/entry/index.js',
        'entry/boilingpoint/boilingpoint': './js/entry/boilingpoint/boilingpoint.js',
        'entry/codeStats': './js/entry/codeStats.js',
        'entry/signin': './js/entry/signin.js',
        'entry/signup': './js/entry/signup.js',
        'entry/user/user': './js/entry/user/user.js',
        'entry/messages': './js/entry/messages.js',
        'entry/article/articleDetail': './js/entry/article/articleDetail.js',
        'entry/tag/tag': './js/entry/tag/tag.js',
        'entry/tag/tagDetail': './js/entry/tag/tagDetail.js',
        'entry/collection/collection': './js/entry/collection/collection.js',
        'entry/collection/edit': './js/entry/collection/edit.js',
        'entry/editor/editMarkdownDraft': './js/entry/editor/editMarkdownDraft.js',
        'entry/editor/editRichDraft': './js/entry/editor/editRichDraft.js',
        'entry/editor/published': './js/entry/editor/published.js',
        'entry/editor/drafts': './js/entry/editor/drafts.js',
        'entry/book/books': './js/entry/book/books.js',
        'entry/book/bookDetail': './js/entry/book/bookDetail.js',
        'entry/book/chapter': './js/entry/book/chapter.js',
        'entry/handbook/handbooks': './js/entry/handbook/handbooks.js',
        'entry/handbook/handbookDetail': './js/entry/handbook/handbookDetail.js',
        'entry/handbook/editHandbook': './js/entry/handbook/editHandbook.js',
        'entry/search/search': './js/entry/search/search.js',
        'entry/recommendations/users': './js/entry/recommendations/users.js',
        'entry/admin/app': './js/entry/admin/app.js',
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
                            plugins: [
                                require('autoprefixer')
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
            '~': path.resolve(__dirname, '')
        },
        extensions: ['.js', '.vue', '.css', '.scss']
    },
    externals: {
        jquery: 'jQuery',
    },
    plugins: [
    ],
};
