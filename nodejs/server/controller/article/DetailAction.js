'use strict';

const Req = require('../../utils/request');

module.exports = function(req, res) {
	var id = req.params.id;
	var reqArr = [
		Req.getCategories({client: req}),
		Req.getArticle({
			client : req,
			params : {
				id: id
			}
		})
	];

	console.log(1111, res.locals.data.user);

	if (res.locals.data.user) {
		reqArr.push(Req.getRecentArticles({client: req}));
	}

	Promise.all(reqArr)
		.then(dataArr => {
			res.locals.data.categories  = dataArr[0].data.categories;
			res.locals.data.article     = dataArr[1].data.article;
			
			if (res.locals.data.user) {
				res.locals.data.recentArticles = dataArr[2].data.articles;
			}
			if (id == 'create') {
				res.render('article/edit');
			} else {
				res.render('article/detail');
			}
		})
		.catch(err => {
			console.log(err);
			res.render('404');
		});
};
