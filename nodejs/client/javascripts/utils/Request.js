import axios from 'axios';
import config from '../config';

const requestAPI = config.api;

class Request {
	constructor() {
		this.get    	= this.get.bind(this);
		this.post   	= this.post.bind(this);
		this.formatItem = this.formatItem.bind(this);
		this.result     = this.result.bind(this);
		this.error		= this.error.bind(this);
		for (let item in requestAPI) {
			if (requestAPI.hasOwnProperty(item)) {
				this.formatItem(requestAPI[item])
			}
		}
	}

	get(url, params) {
		let urlParams = '';
		const getParams = params || {};
		if (url.indexOf(':') > -1) {
			urlParams = url.split(':')[0] + getParams.params;
		} else {
			urlParams = url;
		}

		return new Promise((resolve, reject) => {
			axios.get(urlParams, {
				getParams
			})
			.then(res => this.result(resolve, reject, res))
			.catch(err => this.error(resolve, reject, err))
		})
	}

	post(url, params) {
		let urlParams = '';
		const postParams = params || {};
		if (url.indexOf(':') > -1) {
			urlParams = url.split(':')[0] + postParams.params;
		} else {
			urlParams = url;
		}

		return new Promise((resolve, reject) => {
			axios.post(urlParams, postParams)
			.then(res => this.result(resolve, reject, res))
			.catch(err => this.error(resolve, reject, err))
		})
	}

	result (resolve, reject, res) {
		if (res.data.errNo === 0) {
			resolve(res.data.data);
		} else {
			reject({msg: res.data.msg});
		}
	}

	error (resolve, reject, err) {
		return reject({msg: '网络异常请稍后重试'});
	}

	formatItem(item) {
		for (let obj in item) {
			if (item.hasOwnProperty(obj)) {
				let url = item[obj].url;
				this[item[obj].name] = (params) => this[item[obj].method](url, params);
			}
		}
	}
}

export default new Request();