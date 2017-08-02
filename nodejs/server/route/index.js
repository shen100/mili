'use strict';

var user                = require('../middleware/user');
var IndexAction         = require('../controller/IndexAction');
var ArticleDetailAction = require('../controller/article/DetailAction');
var EditArticleAction   = require('../controller/article/EditAction');
var AdminAction         = require('../controller/admin/AdminAction');
var Signup 				= require('../controller/signup');
var Signin 				= require('../controller/signin');
var ChangePwd			= require('../controller/changePwd');
var ForgetPwd 			= require('../controller/forgetPwd');
var Reset 				= require('../controller/reset');

module.exports = function(app) {
	app.get('/',               IndexAction)
	app.get('/topic/:id',      ArticleDetailAction);
	app.get('/topic/edit/:id', user.signinRequired(), EditArticleAction);

	app.get('/admin', AdminAction);

	app.get('/change/pwd', user.signinRequired(), ChangePwd);
	app.get('/signup', Signup);
	app.get('/signin', Signin);
	app.get('/forget/pwd', ForgetPwd);
	app.get('/reset/:id/:key', Reset);
};
