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
        method: 'GET',
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
    categoryUpdate: {
        url: url + '/admin/category/update',
        method: 'POST',
        desc: '编辑分类'
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
    deleteArticle: {
        url: url + '/article/delete/:id',
        method: 'POST',
        desc: '删除文章'
    },
    getTop10: {
        url: url + '/user/score/top10',
        method: 'GET',
        desc: '获取积分排名前10的用户'
    },
    getTop100: {
        url: url + '/user/score/top100',
        method: 'GET',
        desc: '获取积分排名前100的用户'
    },
    getUserArticles: {
        url: url + '/articles/user/:userID',
        method: 'GET',
        desc: '获取用户的文章列表'
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
    deleteComment: {
        url: url + '/comment/delete/:id',
        method: 'POST',
        desc: '删除评论'
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
    updateVote: {
        url: url + '/vote/update',
        method: 'POST',
        desc: '编辑投票'
    },
    deleteVote: {
        url: url + '/vote/delete/:id',
        method: 'POST',
        desc: '删除投票'
    },
    editVoteItem: {
        url: url + '/vote/item/edit',
        method: 'POST',
        desc: '编辑投票项'
    },
    addVoteItem: {
        url: url + '/vote/item/create',
        method: 'POST',
        desc: '新增投票项'
    },
    deleteVoteItem: {
        url: url + '/vote/item/delete/:id',
        method: 'POST',
        desc: '删除投票项'
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
    },
    userVote: {
        url: url + '/vote/uservote/:id',
        method: 'POST',
        desc: '投票'
    },
    getVoteMaxBrowse: {
        url: url + '/votes/maxbrowse',
        method: 'GET',
        desc: '浏览量最多的投票'
    },
    getVoteMaxComment: {
        url: url + '/votes/maxcomment',
        method: 'GET',
        desc: '回复最多的投票'
    },
    getTopList: {
        url: url + '/articles/top',
        method: 'GET',
        desc: '获取置顶文章列表'
    },
    setTop: {
        url: url + '/article/top/:id',
        method: 'POST',
        desc: '设置置顶'
    },
    delTop: {
        url: url + '/article/deltop/:id',
        method: 'POST',
        desc: '取消置顶'
    },
    getMineComment: {
        url: url + '/comments/user/:userID',
        method: 'GET',
        desc: '获取当前用户回复'
    },
    getMineVote: {
        url: url + '/votes/user/:userID',
        method: 'GET',
        desc: '获取当前用户投票'
    },
    getPublicUser: {
        url: url + '/user/info/public/:id',
        method: 'GET',
        desc: '获取其他用户信息'
    },
    sendmail: {
        url: url + '/active/sendmail',
        method: 'POST',
        desc: '发送邮件'
    },
    userInfoDetail: {
        url: url + '/user/info/detail',
        method: 'GET',
        desc: '获取用户详情'
    },
    updateInfo: {
        url: url + '/user/update/:type',
        method: 'POST',
        desc: '修改用户信息'
    },
    schoolAdd: {
        url: url + '/user/school/add',
        method: 'POST',
        desc: '添加教育经历'
    },
    schoolDelete: {
        url: url + '/user/school/delete/:id',
        method: 'POST',
        desc: '删除教育经历'
    },
    careerAdd: {
        url: url + '/user/career/add',
        method: 'POST',
        desc: '增加工作经历'
    },
    careerDelete: {
        url: url + '/user/career/delete/:id',
        method: 'POST',
        desc: '删除工作经历'
    },
    getCollectDirList: {
        url: url + '/collect/folders/:userID',
        method: 'GET',
        desc: '查询用户的收藏夹列表'
    },
    getFoldersSource: {
        url: url + '/collect/folders/source',
        method: 'GET',
        desc: '获取用户收藏列表'
    },
    createCollectDir: {
        url: url + '/collect/folder/create',
        method: 'POST',
        desc: '创建收藏夹'
    },
    createCollect: {
        url: url + '/collect/create', // collect_source_article收藏文章; collect_source_vote收藏投票
        method: 'POST',
        desc: '收藏文章或收藏投票'
    },
    collectList: {
        url: url + '/collects',
        method: 'GET',
        desc: '获取收藏夹下的话题'
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
    }
}

module.exports = api
