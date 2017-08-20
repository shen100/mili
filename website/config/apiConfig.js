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
    getAdminCategories: {
        url: url + '/admin/categories',
        method: 'GET',
        desc: '管理员获取分类列表'
    },
    getAdminArticles: {
        url: url + '/admin/articles',
        method: 'POST',
        desc: '获取文章列表'
    },
    updateAdminArticles: {
        url: url + '/admin/article/status/update',
        method: 'POST',
        desc: '更新文章状态'
    },
    categoryStatus: {
        url: url + '/admin/category/status/update',
        method: 'post',
        desc: '更改分类状态'
    },
    categoryCreate: {
        url: url + '/admin/category/create',
        method: 'POST',
        desc: '新增分类'
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
        url: url + '/articles/recent/:userID',
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
    },
    getMaxComment: {
        url: url + '/articles/maxcomment',
        method: 'GET',
        desc: '回复最多的话题'
    },
    getMaxBrowse: {
        url: url + '/articles/maxbrowse',
        method: 'GET',
        desc: '浏览最多的话题'
    },
    logout: {
        url: url + '/signout',
        method: 'POST',
        desc: '退出登录'
    },
    createVote: {
        url: url + '/vote/create',
        method: 'POST',
        desc: '创建投票'
    },
    getVotes: {
        url: url + '/votes',
        method: 'GET',
        desc: '获取投票列表'
    },
    getVote: {
        url: url + '/vote/:id',
        method: 'GET',
        desc: '获取投票列表'
    }
}

module.exports = api
