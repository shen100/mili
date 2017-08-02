'use strict';

const Promise = require('bluebird');
const Req     = require('../../utils/request');

module.exports = function(req, res) {
	var id = req.params.id;
	if (!id) {
		return res.render('404');
	}
	Promise.all([
		Req.getCategories({client: req}),
		Req.getArticle({
			client : req,
			params : {
				id : id
			},
			query: {
				f  : 'md'
			}
		}),
		Req.getRecentArticles({client: req})
	]).then(function(arr) {
		console.log(arr);
		res.locals.data = res.locals.data || {};
		res.locals.data.categories     = arr[0].data.categories;
		res.locals.data.article        = arr[1].data.article;
		res.locals.data.recentArticles = arr[2].data.articles;

		var ra = res.locals.data.recentArticles;
		if (ra && ra.length > 0) {
			res.locals.data.hasRecentArticles = true;
		}
		
		res.render('article/edit');
	}).catch(err => {
		console.log(err);
		res.render('404');
	});
};
