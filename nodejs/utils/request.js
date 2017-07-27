'use strict';

const request = require('request');
const url 	  = require('url');
const config  = require('../config/config');

class Req {
	constructor() {
		const api = config.api;
		this.request = this.request.bind(this);
		for (const keyObj in api) {
			if (api.hasOwnProperty(keyObj)) {
				for(const key in api[keyObj]) {
					if (api[keyObj].hasOwnProperty(key)) {
						this[api[keyObj][key]] = this.request(options);
					}
				}
			}
		}

	}

	request(options) {
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
}

module.exports = new Req();