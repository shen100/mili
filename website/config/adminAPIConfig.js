let config = require('~/config')
let url = config.apiURL

if (typeof window === 'undefined') {
    url = config.backApiURL
}

const api = {
    setKeyVaueConfig: { // 设置key, value
        url: url + '/admin/keyvalueconfig',
        method: 'POST'
    },
    createBookCategory: { // 创建图书分类
        url: url + '/admin/books/categories/create',
        method: 'POST'
    },
    getAllBookCategories: { // 图书分类列表
        url: url + '/admin/books/categories',
        method: 'GET'
    },
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
    crawl: { // 抓取文章
        url: url + '/admin/crawl',
        method: 'POST'
    },
    customCrawl: { // 自定义抓取
        url: url + '/admin/customcrawl',
        method: 'POST'
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
