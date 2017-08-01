'use strict';

const Req = require('../../utils/request');

module.exports = function(req, res) {
	var id = req.params.id;
	
	Req.getCategories({
			client: req
		})
		.then(data => {
			res.locals.data = res.locals.data || {};
			res.locals.data.categories = data.data.categories;
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
