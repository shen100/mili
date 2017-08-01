const url = require('./index').api.url;

const api = {
	getCategories: {
		url: url + '/categories',
		method: 'GET',
		desc: '获取分类列表'
	},
	getArticles: {
		url: url + '/articles',
		method: 'GET',
		desc: '获取文章列表'
	},
	getArticle: {
		url: url + '/article/:id',
		method: 'GET',
		desc: '获取文章信息'
	},
	getTop10: {
		url: url + '/user/score/top10',
		method: 'GET',
		desc: '获取积分top10'
	},
	getRecentArticles: {
		url: url + '/articles/recent',
		method: 'GET',
		desc: '获取用户近期文章'	
	},
	getUserInfo: {
		url: url + '/user/info',
		method: 'GET',
		desc: '获取当前登录用户信息'
	}
}

module.exports = api;