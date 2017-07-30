'use strict';
const Req = require('../utils/request');

module.exports = function(req, res) {
	const query = req.query || {};
	Promise.all([
		Req.getCategories({
			client: req
		}),
		Req.getArticles({
			client: req
		})
	])	
	.then(data => {
		res.locals.data = {};
		if (query.cate) {
			data[0].data.categories.map(item => {
				if (item.id == query.cate) {
					item.select = true;
				}
			})
		}
		res.locals.data.categoties = data[0].data.categories;
		res.locals.data.articles   = data[1].data.articles;
		res.locals.data.cate 	   = query.cate || false;
		console.log(data, typeof data);
		res.render('home');
	})
	.catch(err => {
		console.log(err);
		res.render('home');
	});
};
