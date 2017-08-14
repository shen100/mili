let config = require('~/config')
let url = config.apiURL

if (typeof window === 'undefined') {
    url = config.backApiURL
}

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
        desc: '获取积分排名前10的用户'
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
    },
    createArticle: {
        url: url + '/article/create',
        method: 'POST',
        desc: '新建文章'
    },
    signin: {
        url: url + '/signin',
        method: 'POST',
        desc: '登陆'
    },
    signup: {
        url: url + '/signup',
        method: 'POST',
        desc: '注册'
    },
    updateArticle: {
        url: url + '/article/update',
        method: 'POST',
        desc: '编辑文章'
    },
    changePwd: {
        url: url + '/user/password/update',
        method: 'POST',
        desc: '修改密码'
    },
    sendEmailPwd: {
        url: url + '/reset',
        method: 'POST',
        desc: '忘记密码邮箱确认'
    },
    resetPwd: {
        url: url + '/reset/:id/:key',
        method: 'POST',
        desc: '重置密码'
    },
    activeUser: {
        url: url + '/active/:id/:key',
        method: 'POST',
        desc: '账号激活'
    },
    verifyUrl: {
        url: url + '/reset/verify/:id/:key',
        method: 'GET',
        desc: '验证重置密码链接是否失效'
    },
    commentCreate: {
        url: url + '/comment/create',
        method: 'POST',
        desc: '提交评论'
    }
}

module.exports = api
