let config = require('~/config')
let url = config.apiURL

if (typeof window === 'undefined') {
    url = config.backApiURL
}

const api = {
    categoryCreate: { // 新增分类
        url: url + '/admin/categories/create',
        method: 'POST'
    },
    categoryUpdate: { // 编辑分类
        url: url + '/admin/categories/update',
        method: 'PUT'
    },
    getAdminCategories: {
        url: url + '/admin/categories',
        method: 'GET',
        desc: '管理员获取分类列表'
    },
    categoryStatus: {
        url: url + '/admin/category/status/update',
        method: 'post',
        desc: '更改分类状态'
    },
    getAdminArticles: {
        url: url + '/admin/articles',
        method: 'GET',
        desc: '获取文章列表'
    },
    updateArticleStatus: { // 更新文章状态
        url: url + '/admin/articles/status/update',
        method: 'PUT'
    },
    getComments: {
        url: url + '/admin/comments',
        method: 'GET'
    },
    updateCommentStatus: { // 更新评论状态
        url: url + '/admin/comments/update/status/:id',
        method: 'PUT'
    },
    getAdminUserList: {
        url: url + '/admin/users',
        method: 'GET',
        desc: '获取用户列表'
    },
    crawl: {
        url: url + '/admin/crawl',
        method: 'POST',
        desc: '爬取微信文章'
    },
    getCrawlAccount: {
        url: url + '/admin/crawl/account', // 获取爬虫账号
        method: 'GET'
    },
    createCrawlAccount: {
        url: url + '/admin/crawl/account', // 获取爬虫账号
        method: 'POST'
    },
    pushToBaidu: {
        url: url + '/admin/pushBaiduLink', // 链接提交到百度
        method: 'POST'
    }
}

module.exports = api
