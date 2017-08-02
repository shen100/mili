'use strict';

module.exports = (req, res) => {
	const params = req.params || {};
	if (!params.id || !params.key) {
		return res.render(404);
	}
	
	res.locals.data.params = {
		id: params.id,
		key: params.key
	}
 	res.render('reset');
}