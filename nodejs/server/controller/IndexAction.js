'use strict';
const Req = require('../utils/request');

module.exports = function(req, res) {
	req.body = {};
	Req.getCategories({
			client: req
		})
		.then(data => {
			res.locals.data = {};
			res.locals.data.categoties = data.data.categories;
			console.log(data, typeof data);
			res.render('home');
		})
		.catch(err => {
			console.log(err);
			res.render('home');
		});
};
