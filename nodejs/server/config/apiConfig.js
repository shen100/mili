const url = require('./index').api.url;

const api = {
	home: {
		categories: {
			url: url + '/categories',
			method: 'GET',
			name: 'getCategories',
			desc: '获取分类列表'
		},
		articles: {
			url: url + '/articles',
			method: 'GET',
			name: 'getArticles',
			desc: '获取文章列表'
		},
		article: {
			url: url + '/article/:id',
			method: 'GET',
			name: 'getArticle',
			desc: '获取文章信息'
		},
		top10: {
			url: url + '/user/score/top10',
			method: 'GET',
			name: 'getTop10',
			desc: '获取积分top10'
		},
		recentArticles: {
			url: url + '/articles/recent',
			method: 'GET',
			name: 'getRecentArticles',
			desc: '获取用户近期文章'	
		},
		getUserInfo: {
			url: url + '/user/info',
			method: 'GET',
			name: 'getUserInfo',
			desc: '获取当前登录用户信息'
		}
	}
}

console.log(api.home.categories.url);
module.exports = api;