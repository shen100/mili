'use strict';

const express = require('express');
const path    = require('path');
const hbs     = require('hbs');
const config  = require('./server/config');
const app     = express();

hbs.registerPartials(__dirname + '/server/views/partials');
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'hbs');

app.use(function(req, res, next) {
    res.set('X-Powered-By', config.staticPoweredBy);
    next();
});

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

app.use(express.static(path.join(__dirname, 'client')));
app.use(config.page.imgPath, express.static(config.uploadImgDir));

app.listen(config.staticPort, function() {
    console.log('Server running at :' + config.staticPort);
});

