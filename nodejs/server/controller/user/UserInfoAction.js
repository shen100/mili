'use strict';

const Req = require('../../utils/request');

module.exports = function(req, res, next) {
	Req.getUserInfo({client: req})
		.then(data => {
			if (data.errNo != 1001) {
				res.locals.data.user = data.data.user;
			}
			next();
		})
		.catch(err => {
			console.log(err);
			res.render('404');	
		});
};