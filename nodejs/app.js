const express = require('express');
const path    = require('path');

const app     = express();

app.use(express.static(path.join(__dirname, 'client')));

const webpack 			   = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig        = require('./webpack.dev.conf');
const compiler             = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
	publicPath: webpackConfig.output.publicPath,
    noInfo: true,
    stats: {
        colors: true
    }
}));
app.use(webpackHotMiddleware(compiler));

app.listen(8023);