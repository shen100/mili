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
			url: url + '/admin/articles',
			method: 'GET',
			name: 'getArticles',
			desc: '获取文章列表'
		}
	}
}

console.log(api.home.categories.url);
module.exports = api;