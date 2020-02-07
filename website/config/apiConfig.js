let config = require('~/config')
let url = config.apiURL

if (typeof window === 'undefined') {
    url = config.backApiURL
}

const api = {
    sendUserVisit: { // 发送用户访问记录
        url: url + '/stats/visit',
        method: 'GET'
    },
    getSiteInfo: { // 网站信息
        url: url + '/siteinfo',
        method: 'GET'
    },
    getCategories: { // 获取分类列表
        url: url + '/categories',
        method: 'GET'
    },
    getArticles: { // 获取文章列表
        url: url + '/articles',
        method: 'GET'
    },
    getArticle: { // 获取文章信息
        url: url + '/articles/info/:id',
        method: 'GET'
    },
    deleteArticle: { // 删除文章
        url: url + '/articles/delete/:id',
        method: 'DELETE'
    },
    getTop10: { // 获取积分排名前10的用户
        url: url + '/user/score/top10',
        method: 'GET'
    },
    getTop100: { // 获取积分排名前100的用户
        url: url + '/user/score/top100',
        method: 'GET'
    },
    getUserArticles: { // 获取用户的文章列表
        url: url + '/articles/user/:userID',
        method: 'GET'
    },
    getUserInfo: { // 获取当前登录用户信息
        url: url + '/user/info',
        method: 'GET'
    },
    createArticle: { // 新建文章
        url: url + '/articles/create',
        method: 'POST'
    },
    signin: { // 登陆
        url: url + '/signin',
        method: 'POST'
    },
    signup: { // 注册
        url: url + '/signup',
        method: 'POST'
    },
    updateArticle: { // 编辑文章
        url: url + '/articles/update',
        method: 'PUT'
    },
    changePwd: { // 修改密码
        url: url + '/user/password/update',
        method: 'PUT'
    },
    sendEmailPwd: { // 忘记密码邮箱确认
        url: url + '/reset/sendmail',
        method: 'POST'
    },
    resetPwd: { // 重置密码
        url: url + '/reset/password/:id/:key',
        method: 'POST'
    },
    activeUser: { // 账号激活
        url: url + '/active/user/:id/:key',
        method: 'POST'
    },
    verifyUrl: { // 验证重置密码链接是否失效
        url: url + '/reset/verify/:id/:key',
        method: 'GET'
    },
    commentCreate: { // 提交评论
        url: url + '/comments/create',
        method: 'POST'
    },
    commentEdit: { // 编辑评论
        url: url + '/comments/update',
        method: 'PUT'
    },
    deleteComment: { // 删除评论
        url: url + '/comments/delete/:id',
        method: 'DELETE'
    },
    getMaxComment: { // 回复最多的话题
        url: url + '/articles/max/bycomment',
        method: 'GET'
    },
    getMaxBrowse: { // 浏览最多的话题
        url: url + '/articles/max/bybrowse',
        method: 'GET'
    },
    logout: { // 退出登录
        url: url + '/signout',
        method: 'POST'
    },
    createVote: { // 创建投票
        url: url + '/votes/create',
        method: 'POST'
    },
    updateVote: { // 编辑投票
        url: url + '/votes/update',
        method: 'PUT'
    },
    deleteVote: { // 删除投票
        url: url + '/votes/delete/:id',
        method: 'DELETE'
    },
    editVoteItem: { // 编辑投票项
        url: url + '/votes/item/edit',
        method: 'PUT'
    },
    addVoteItem: { // 新增投票项
        url: url + '/votes/item/create',
        method: 'POST'
    },
    deleteVoteItem: { // 删除投票项
        url: url + '/votes/item/delete/:id',
        method: 'DELETE'
    },
    getVotes: { // 获取投票列表
        url: url + '/votes',
        method: 'GET'
    },
    getVote: { // 获取投票列表
        url: url + '/votes/info/:id',
        method: 'GET'
    },
    userVote: { // 投票
        url: url + '/votes/uservote/:id',
        method: 'POST'
    },
    getVoteMaxBrowse: { // 浏览量最多的投票
        url: url + '/votes/max/bybrowse',
        method: 'GET'
    },
    getVoteMaxComment: { // 回复最多的投票
        url: url + '/votes/max/bycomment',
        method: 'GET'
    },
    getTopList: { // 获取置顶文章列表
        url: url + '/articles/top/global',
        method: 'GET'
    },
    setTop: { // 设置置顶
        url: url + '/articles/top/:id',
        method: 'POST'
    },
    delTop: { // 取消置顶
        url: url + '/articles/deltop/:id',
        method: 'DELETE'
    },
    getMineComment: { // 获取当前用户回复
        url: url + '/comments/user/:userID',
        method: 'GET'
    },
    getMineVote: { // 获取当前用户投票
        url: url + '/votes/user/:userID',
        method: 'GET'
    },
    getPublicUser: { // 获取其他用户信息
        url: url + '/user/info/public/:id',
        method: 'GET'
    },
    sendmail: { // 发送邮件
        url: url + '/active/sendmail',
        method: 'POST'
    },
    userInfoDetail: { // 获取用户详情
        url: url + '/user/info/detail',
        method: 'GET'
    },
    updateInfo: { // 修改用户信息
        url: url + '/user/update/:type',
        method: 'PUT'
    },
    schoolAdd: { // 添加教育经历
        url: url + '/user/school/add',
        method: 'POST'
    },
    schoolDelete: { // 删除教育经历
        url: url + '/user/school/delete/:id',
        method: 'DELETE'
    },
    careerAdd: { // 增加工作经历
        url: url + '/user/career/add',
        method: 'POST'
    },
    careerDelete: { // 删除工作经历
        url: url + '/user/career/delete/:id',
        method: 'DELETE'
    },
    getCollectDirList: { // 查询用户的收藏夹列表
        url: url + '/collects/user/:userID/folders',
        method: 'GET'
    },
    getFoldersSource: {
        url: url + '/collects/folders/withsource', // 查询用户的收藏夹列表，并且返回每个收藏夹中收藏了哪些话题或投票
        method: 'GET'
    },
    createCollectDir: { // 创建收藏夹
        url: url + '/collects/folder/create',
        method: 'POST'
    },
    createCollect: { // 收藏文章或收藏投票
        url: url + '/collects/create', // collect_source_article收藏文章; collect_source_vote收藏投票
        method: 'POST'
    },
    cancelCollect: { // 取消收藏
        url: url + '/collects/delete/:id',
        method: 'DELETE'
    },
    collectList: { // 获取收藏夹下的话题
        url: url + '/collects',
        method: 'GET'
    },
    getMessages: { // 未读消息
        url: url + '/messages/unread',
        method: 'GET'
    },
    readMessage: { // 将消息标记为已读
        url: url + '/messages/read/:id',
        method: 'GET'
    },
    getBookCategories: { // 图书分类列表
        url: url + '/books/categories',
        method: 'GET'
    },
    getMyBooks: { // 获取我的图书列表
        url: url + '/books/my/:userID',
        method: 'GET'
    },
    getUserPublicBooks: { // 获取用户公开的图书列表
        url: url + '/books/user/public/:userID',
        method: 'GET'
    },
    getBooks: { // 获取图书列表
        url: url + '/books',
        method: 'GET'
    },
    getBook: { // 获取图书信息
        url: url + '/books/info/:id',
        method: 'GET'
    },
    deleteBook: { // 删除图书
        url: url + '/books/delete/:id',
        method: 'DELETE'
    },
    createBook: { // 创建图书
        url: url + '/books',
        method: 'POST'
    },
    updateBook: { // 更新图书
        url: url + '/books/update',
        method: 'PUT'
    },
    updateBookName: { // 更新图书的名称
        url: url + '/books/updatename',
        method: 'PUT'
    },
    publishBook: { // 发布图书
        url: url + '/books/publish/:bookID',
        method: 'PUT'
    },
    getBookChapters: { // 获取图书的所有章节
        url: url + '/books/chapters/:id',
        method: 'GET'
    },
    getBookChapter: { // 获取章节
        url: url + '/books/chapter/:chapterID',
        method: 'GET'
    },
    createBookChapter: { // 创建图书的章节
        url: url + '/books/chapters',
        method: 'POST'
    },
    updateBookChapterName: { // 更新图书的章节的名称
        url: url + '/books/chapters/updatename',
        method: 'PUT'
    },
    saveBookChapterContent: { // 保存图书的章节内容
        url: url + '/books/chapters/content',
        method: 'PUT'
    },
    deleteBookChapter: { // 删除图书的章节
        url: url + '/books/chapters/:chapterID',
        method: 'DELETE'
    },
    crawlNotSaveContent: { // 抓取的内容直接返回，而不保存到数据库
        url: url + '/crawlnotsavecontent',
        method: 'POST'
    }
}

module.exports = api
