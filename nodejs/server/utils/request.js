'use strict';

const request = require('request');
const url 	  = require('url');
const api  	  = require('../config/apiConfig');
const config  = require('../config');

class Req {
	constructor() {
		this.request = this.request.bind(this);
		for (const keyObj in api) {
			if (api.hasOwnProperty(keyObj)) {
				for(const key in api[keyObj]) {
					if (api[keyObj].hasOwnProperty(key)) {
						this[api[keyObj][key].name] = (options) => {
							return new Promise((resolve, reject) => {
								return this.request(api[keyObj][key], options, resolve, reject);
							})
						}
					}
				}
			}
		}

	}

	request(conf, options, resolve, reject) {
		options.uri = conf.url;
		options.method = conf.method;
		if (options.headers) {
			options.headers = {};
			options.headers['User-Agent'] = options.headers['user-agent'];
		}

		const urlObj = url.parse(options.uri);

		if (options.cookies) {
			var cookieUrl = urlObj.protocol + '//' + urlObj.host;
			var j = request.jar();
			for (var key in options.cookies) {
				if (options.cookies.hasOwnProperty(key)) {
					var cookie = request.cookie(key + '=' + options.cookies[key]);
					j.setCookie(cookie, cookieUrl);
				}
			}
			options.jar = j;
		}
		delete options.body;
		request(options, function(error, response, body) {
			if (error) {
		      	return reject(error);
		    } else {
		    	return resolve(JSON.parse(body));
		    }
		})
	}
}

module.exports = new Req();