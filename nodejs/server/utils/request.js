'use strict';

const request = require('request');
const url 	  = require('url');
const api  	  = require('../config/apiConfig');
const config  = require('../config');

class Req {
	constructor() {
		this.request = this.request.bind(this);
			for(const key in api) {
				if (api.hasOwnProperty(key)) {
					this[key] = (options) => {
						return new Promise((resolve, reject) => {
							return this.request(api[key], options, resolve, reject);
						})
					}
				}
			}

	}

	request(conf, options, resolve, reject) {
		console.log(JSON.stringify(conf));
		options.uri = conf.url;
		options.method = conf.method;

		if (options.method == 'POST') {
			options.body = options.body || {};
		}

		if (options.method == 'GET') {
			let params = options.params || {};
			if (options.uri.indexOf(':id') > -1) {
				options.uri = options.uri.replace(':id', query.id);
				delete query.id;
			}

			let queryStr = '';

			queryStr = JSON.stringify(query)
							   .replace('{', '?')
							   .replace(/:/g, '=')
							   .replace(/"/g, '')
							   .replace(/,/g, '&')
							   .replace('}', '');
			if (queryStr != '?') {
				options.uri += queryStr;
			}
		}
		console.log(options.uri);

		options.json = options.json === undefined ? true : options.json;
		var client   = options.client;
		if (client.headers) {
			options.headers = {};
			options.headers['User-Agent'] = client.headers['user-agent'];
		}

		var urlObj = url.parse(options.uri);
		if (process.env.NODE_ENV !== 'production') {
			var cookies = client.cookies || {};
			var apiServer = cookies.apiServer;
			if (apiServer) {
				urlObj.host     = apiServer.host + ':' + apiServer.port;
				urlObj.port     = apiServer.port;
				urlObj.hostname = apiServer.host;
				var uri         = url.format(urlObj);
				options.uri     = uri;
				
			}
		}

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

		delete options.client;

		options.proxy = config.proxyUri;

		var startTime = new Date().getTime();
		request(options, function(error, response, data) {
			console.log({
				url : options.uri,
				time: (new Date().getTime() - startTime) + 'ms'
			});
			if (!error && typeof data === 'string') {
				error = {
					message : data,
					url     : options.uri
				};
			}

			if (error) {
		      	return reject(error);
		    } else {
		    	return resolve(data);
		    }
		})
	}
}

module.exports = new Req();