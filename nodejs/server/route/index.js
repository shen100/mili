'use strict';

var IndexAction         = require('../controller/IndexAction');
var ArticleDetailAction = require('../controller/article/DetailAction');
var EditArticleAction   = require('../controller/article/EditAction');
var AdminAction         = require('../controller/admin/AdminAction');
var Signup 				= require('../controller/signup');

module.exports = function(app) {
	app.get('/',               IndexAction)
	app.get('/topic/:id',      ArticleDetailAction);
	app.get('/topic/edit/:id', EditArticleAction);

	app.get('/admin', AdminAction);

	app.get('/signup', Signup);
};
