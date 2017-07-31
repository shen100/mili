'use strict';

var Promise = require('bluebird');
const Req   = require('../../utils/request');

module.exports = function(req, res) {
	var id = req.params.id;
	Promise.all([
		Req.getCategories({client: req}),
		Req.getCategories({client: req}),
	]).then(function(arr) {
		console.log(data);
		res.locals.data = res.locals.data || {};
		res.locals.data.categoties = arr[0].data.categories;
		
		res.render('article/edit');
	}).catch(err => {
		console.log(err);
		res.render('404');
	});
};
