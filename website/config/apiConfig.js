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
        url: url + '/articles/info/:id',
        method: 'GET',
        desc: '获取文章信息'
    },
    deleteArticle: {
        url: url + '/articles/delete/:id',
        method: 'DELETE',
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
        url: url + '/articles/create',
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
        url: url + '/articles/update',
        method: 'PUT',
        desc: '编辑文章'
    },
    changePwd: {
        url: url + '/user/password/update',
        method: 'PUT',
        desc: '修改密码'
    },
    sendEmailPwd: {
        url: url + '/reset/sendmail',
        method: 'POST',
        desc: '忘记密码邮箱确认'
    },
    resetPwd: {
        url: url + '/reset/password/:id/:key',
        method: 'POST',
        desc: '重置密码'
    },
    activeUser: {
        url: url + '/active/user/:id/:key',
        method: 'POST',
        desc: '账号激活'
    },
    verifyUrl: {
        url: url + '/reset/verify/:id/:key',
        method: 'GET',
        desc: '验证重置密码链接是否失效'
    },
    commentCreate: {
        url: url + '/comments/create',
        method: 'POST',
        desc: '提交评论'
    },
    commentEdit: { // 编辑评论
        url: url + '/comments/update',
        method: 'PUT'
    },
    deleteComment: {
        url: url + '/comments/delete/:id',
        method: 'DELETE',
        desc: '删除评论'
    },
    getMaxComment: {
        url: url + '/articles/max/bycomment',
        method: 'GET',
        desc: '回复最多的话题'
    },
    getSiteComments: {
        url: url + '/comments/source/:sourceName/:sourceID',
        method: 'GET'
    },
    getMaxBrowse: {
        url: url + '/articles/max/bybrowse',
        method: 'GET',
        desc: '浏览最多的话题'
    },
    logout: {
        url: url + '/signout',
        method: 'POST',
        desc: '退出登录'
    },
    createVote: {
        url: url + '/votes/create',
        method: 'POST',
        desc: '创建投票'
    },
    updateVote: {
        url: url + '/votes/update',
        method: 'PUT',
        desc: '编辑投票'
    },
    deleteVote: {
        url: url + '/votes/delete/:id',
        method: 'DELETE',
        desc: '删除投票'
    },
    editVoteItem: {
        url: url + '/votes/item/edit',
        method: 'PUT',
        desc: '编辑投票项'
    },
    addVoteItem: {
        url: url + '/votes/item/create',
        method: 'POST',
        desc: '新增投票项'
    },
    deleteVoteItem: {
        url: url + '/votes/item/delete/:id',
        method: 'DELETE',
        desc: '删除投票项'
    },
    getVotes: {
        url: url + '/votes',
        method: 'GET',
        desc: '获取投票列表'
    },
    getVote: {
        url: url + '/votes/info/:id',
        method: 'GET',
        desc: '获取投票列表'
    },
    userVote: {
        url: url + '/votes/uservote/:id',
        method: 'POST',
        desc: '投票'
    },
    getVoteMaxBrowse: {
        url: url + '/votes/max/bybrowse',
        method: 'GET',
        desc: '浏览量最多的投票'
    },
    getVoteMaxComment: {
        url: url + '/votes/max/bycomment',
        method: 'GET',
        desc: '回复最多的投票'
    },
    getTopList: {
        url: url + '/articles/top/global',
        method: 'GET',
        desc: '获取置顶文章列表'
    },
    setTop: {
        url: url + '/articles/top/:id',
        method: 'POST',
        desc: '设置置顶'
    },
    delTop: {
        url: url + '/articles/deltop/:id',
        method: 'DELETE',
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
        method: 'PUT',
        desc: '修改用户信息'
    },
    schoolAdd: {
        url: url + '/user/school/add',
        method: 'POST',
        desc: '添加教育经历'
    },
    schoolDelete: {
        url: url + '/user/school/delete/:id',
        method: 'DELETE',
        desc: '删除教育经历'
    },
    careerAdd: {
        url: url + '/user/career/add',
        method: 'POST',
        desc: '增加工作经历'
    },
    careerDelete: {
        url: url + '/user/career/delete/:id',
        method: 'DELETE',
        desc: '删除工作经历'
    },
    getCollectDirList: {
        url: url + '/collects/user/:userID/folders',
        method: 'GET',
        desc: '查询用户的收藏夹列表'
    },
    getFoldersSource: {
        url: url + '/collects/folders/withsource', // 查询用户的收藏夹列表，并且返回每个收藏夹中收藏了哪些话题或投票
        method: 'GET'
    },
    createCollectDir: {
        url: url + '/collects/folder/create',
        method: 'POST',
        desc: '创建收藏夹'
    },
    createCollect: {
        url: url + '/collects/create', // collect_source_article收藏文章; collect_source_vote收藏投票
        method: 'POST',
        desc: '收藏文章或收藏投票'
    },
    collectList: {
        url: url + '/collects',
        method: 'GET',
        desc: '获取收藏夹下的话题'
    }
}

module.exports = api
