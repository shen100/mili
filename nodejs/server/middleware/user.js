'use strict';

const Req = require('../utils/request');

exports.signinRequired = function(format) {
	return function(req, res, next) {
		Req.getUserInfo({client: req})
		.then(data => {
			if (data.errNo == 1001) {
				if (format == 'json') {
					res.json(data);
				} else {
					res.redirect('/signin');
				}
			} else {
				next();
			}
		})
		.catch(err => {
			console.log(err);
			res.render('404');	
		});
	};
};