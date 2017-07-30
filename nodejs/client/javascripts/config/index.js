

const config = {
	api: {
		categories: {
			list: {
				url:'/api/admin/categories',
				method: 'get',
				name: 'getCategories',
				desc: '获取文章分类列表'
			},
			create: {
				url: '/api/admin/category/create',
				method: 'post',
				name: 'categoryCreate',
				desc: '创建文章分类'
			},
			update: {
				url: '/api/admin/category/update',
				method: 'post',
				name: 'categoryUpdate',
				desc: '更新文章分类'
			},
			statusUpdate: {
				url: '/api/admin/category/status/update',
				method: 'post',
				name: 'categoryStatus',
				desc: '更改分类状态'
			}
		},
		articleAdmin: {
			list: {
				url: '/api/admin/articles',
				method: 'get',
				name: 'getAdminArticles',
				desc: '管理员身份获取文章列表'
			},
			update: {
				url: '/api/admin/article/status/update',
				method: 'post',
				name: 'updateAdminArticles',
				desc: '更新文章状态'
			}
		},
		article: {
			create: {
				url: '/api/article/create',
				method: 'post',
				name: 'createArticle',
				desc: '创建文章'
			},
			update: {
				url: '/api/article/update',
				method: 'post',
				name: 'updateArticle',
				desc: '更新文章'
			},
			item: {
				url: '/api/article/:id',
				method: 'get',
				name: 'getArticleItem',
				desc: '获取单个文章信息'
			}
		},
		signup: {
			signup: {
				url: '/api/signup',
				method: 'post',
				name: 'signup',
				desc: '提交登陆信息'
			}
		}
	}
}

export default config;