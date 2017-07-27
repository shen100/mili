'use strict';

var IndexAction         = require('../controller/IndexAction');
var ArticleDetailAction = require('../controller/ArticleDetailAction');

module.exports = function(app) {
	app.get('/',          IndexAction)
	app.get('/topic/:id', ArticleDetailAction);
};
