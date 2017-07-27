'use strict';

var IndexAction       = require('../controller/IndexAction');
var EditArticleAction = require('../controller/EditArticleAction');
var AdminAction       = require('../controller/admin/AdminAction');

module.exports = function(app) {
	app.get('/',              IndexAction)
	app.get('/topic/edit/:id', EditArticleAction);

	app.get('/admin', AdminAction);
};
