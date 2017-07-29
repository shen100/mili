'use strict';
const Req = require('../utils/request');

module.exports = function(req, res) {
	req.body = {};
	Req.getCategories(req)
		.then(res => {
			res.locals.data.categoties = res.data.categories;
			console.log(res.data.categories);
			res.render('home');
		})
		.catch(err => {
			console.log(err);
			res.render('home');
		});
};
