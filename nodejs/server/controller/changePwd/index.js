'use strict';

const Req = require('../../utils/request');

module.exports = (req, res) => {
	Promise.all([
		Req.getTop10({
			client: req
		}),
		Req.getUserInfo({
			client: req
		})
	])
	.then(data => {
		res.locals.data = {};
		console.log(data);
		res.locals.data.score 	   = data[0].data.users;
		res.locals.data.userStatus = data[1].data.user ? true : false;
		res.locals.data.user 	   = data[1].data.user || {};
		res.render('changePwd');
	})
	.catch(err => console.log(err));
}