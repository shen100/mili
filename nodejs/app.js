'use strict';
const express = require('express');
const path    = require('path');
const hbs     = require('hbs');

const app     = express();

app.set('views', path.join(__dirname, 'views')); 
app.engine('html', hbs.__express);
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

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

app.get('/', (req, res, next) => {
	res.render('home');
})

app.listen(8023);