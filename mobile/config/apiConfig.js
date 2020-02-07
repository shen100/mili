let config = require('~/config')
let url = config.apiURL

if (typeof window === 'undefined') {
    url = config.backApiURL
}

const api = {
    getSiteInfo: { // 网站信息
        url: url + '/siteinfo',
        method: 'GET'
    },
    getUserInfo: { // 获取当前登录用户信息
        url: url + '/user/info',
        method: 'GET'
    },
    getCategories: { // 获取分类列表
        url: url + '/categories',
        method: 'GET'
    },
    getArticles: { // 获取话题列表
        url: url + '/articles',
        method: 'GET'
    },
    getArticle: { // 获取话题信息
        url: url + '/articles/info/:id',
        method: 'GET'
    }
}

module.exports = api
