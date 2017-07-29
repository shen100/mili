'use strict';

var Req = require('../../utils/request');

module.exports = function(req, res) {
	var id = req.params.id;
	
	if (id == 'create') {
		res.render('article/create');
	} else {
		res.render('article/detail');
	}
};
