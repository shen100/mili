

const config = {
	api: {
		categories: {
			list: '/api/admin/categories',
			create: '/api/admin/category/create ',
			update: '/api/admin/category/update',
			statusUpdate: '/api/admin/category/status/update'
		},
		articleAdmin: {
			list: '/api/admin/articles',
			update: '/api/admin/article/status/update'
		},
		article: {
			create: '/api/article/create',
			update: '/api/article/update',
			item: '/api/article/'
		}
	}
}

export default config;