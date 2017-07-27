'use strict';

const request = require('request');
const url 	  = require('url');

const req = (options) => {
	const client   = options.client;
	if (client.headers) {
		options.headers = {};
		options.headers['User-Agent'] = client.headers['user-agent'];
	}
	const urlObj = url.parse(options.uri);

	if (client.cookies) {
		var cookieUrl = urlObj.protocol + '//' + urlObj.host;
		var j = request.jar();
		for (var key in client.cookies) {
			if (client.cookies.hasOwnProperty(key)) {
				var cookie = request.cookie(key + '=' + client.cookies[key]);
				j.setCookie(cookie, cookieUrl);
			}
		}
		options.jar = j;
	}
	return new Promise((resolve, reject) => {
		request(options, function(error, response, body) {
			if (error) {
		      	return reject(error);
		    } else {
		    	return resolve(body);
		    }
		})
	});
}

module.exports = req;