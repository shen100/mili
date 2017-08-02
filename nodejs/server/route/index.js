'use strict';

var user                = require('../middleware/user');
var IndexAction         = require('../controller/IndexAction');
var ArticleDetailAction = require('../controller/article/DetailAction');
var EditArticleAction   = require('../controller/article/EditAction');
var AdminAction         = require('../controller/admin/AdminAction');
var Signup 				= require('../controller/signup');
var Signin 				= require('../controller/signin');
var UserInfoAction      = require('../controller/user/UserInfoAction');

module.exports = function(app) {
	app.get('/',               IndexAction)
	app.get('/topic/:id',      UserInfoAction, ArticleDetailAction);
	app.get('/topic/edit/:id', user.signinRequired(), EditArticleAction);

	app.get('/admin', AdminAction);

	app.get('/signup', Signup);
	app.get('/signin', Signin);
};
