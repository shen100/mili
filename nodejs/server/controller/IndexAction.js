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
		}),
		Req.getTop10({
			client: req
		}),
		Req.getUserInfo({
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
		res.locals.data.score 	   = data[2].data.users;
		res.locals.data.userStatus = data[3].data.user ? true : false;
		res.locals.data.user 	   = data[3].data.user || {};
		res.locals.data.cate 	   = query.cate || false;
		console.log(res.locals.data.userStatus);
		console.log(data[3]);
		res.render('home');
	})
	.catch(err => {
		console.log(err);
		res.render('home');
	});
};
