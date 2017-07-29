var config = require('./server/config');

if (config.env === 'development') {
    process.stderr.on('data', function(data) {
        console.log(data);
    });
}

//检查下依赖的模块是否都已安装
var EnvUtil = require('./server/utils').EnvUtil;

if (!EnvUtil.checkPackages()) {
    process.exit(0);
}

var logger        = require('morgan');
var http          = require('http');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var hbs           = require('hbs');
var helpers       = require('./server/helpers');
var route         = require('./server/route');

var app = express();

for (var key in helpers) {
    if (helpers.hasOwnProperty(key)) {
        hbs.registerHelper(key, helpers[key]);
    }
}

hbs.registerPartials(__dirname + '/server/views/partials');
app.enable('trust proxy');
app.set('views', path.join(__dirname, 'server', 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next) {
    res.set('X-Powered-By', config.webPoweredBy);
    var locals            = res.locals;
    locals.title          = config.page.title;
    locals.jsPath         = config.page.jsPath;
    locals.cssPath        = config.page.cssPath;
    locals.imagePath      = config.page.imagePath;
    locals.pageConfig     = config.page;
    next();
});

var server = http.Server(app);

route(app);

app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
        message : err.message,
        error   : config.env === 'development' ? err : {}
    });
});

server.listen(config.port, function() {
    console.log('Server running at :' + config.port);
});
