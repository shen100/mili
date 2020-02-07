package model

// 通用常量
const (
	// NoParent 无父结点时的parent_id
	NoParent = 0

	// MaxOrder 最大的排序号
	MaxOrder = 10000

	// MinOrder 最小的排序号
	MinOrder = 0

	// PageSize 默认每页的条数
	PageSize = 20

	// MaxPageSize 每页最大的条数
	MaxPageSize = 100

	// MinPageSize 每页最小的条数
	MinPageSize = 5

	// MaxNameLen 最大的名称长度
	MaxNameLen = 100

	// MaxContentLen 最大的内容长度
	MaxContentLen = 50000

	// MaxCategoryCount 最多可以属于几个分类
	MaxCategoryCount = 6
)

// 积分相关常量
const (
	// ArticleScore 创建话题时增加的积分
	ArticleScore = 5

	// ByCommentScore 话题或投票被评论时增加的积分
	ByCommentScore = 2

	// ByCollectScore 话题或投票被收藏时增加的积分
	ByCollectScore = 2

	// CommentScore 评论话题或投票时增加的积分
	CommentScore = 1

	// CollectScore 收藏话题或投票时增加的积分
	CollectScore = 1
)

const (
	// ArticleMinuteLimitCount 用户每分钟最多能发表的文章数
	ArticleMinuteLimitCount = 30

	// ArticleDayLimitCount 用户每天最多能发表的文章数
	ArticleDayLimitCount = 1000

	// CommentMinuteLimitCount 用户每分钟最多能发表的评论数
	CommentMinuteLimitCount = 30

	// CommentDayLimitCount 用户每天最多能发表的评论数
	CommentDayLimitCount = 1000
)

const (
	// ContentTypeMarkdown markdown
	ContentTypeMarkdown = 1

	// ContentTypeHTML html
	ContentTypeHTML = 2
)

// redis相关常量, 为了防止从redis中存取数据时key混乱了，在此集中定义常量来作为各key的名字
const (
	// ActiveTime 生成激活账号的链接
	ActiveTime = "activeTime"

	// ResetTime 生成重置密码的链接
	ResetTime = "resetTime"

	// LoginUser 用户信息
	LoginUser = "loginUser"

	// ArticleMinuteLimit 用户每分钟最多能发表的文章数
	ArticleMinuteLimit = "articleMinuteLimit"

	// ArticleDayLimit 用户每天最多能发表的文章数
	ArticleDayLimit = "articleDayLimit"

	// CommentMinuteLimit 用户每分钟最多能发表的评论数
	CommentMinuteLimit = "commentMinuteLimit"

	// CommentDayLimit 用户每天最多能发表的评论数
	CommentDayLimit = "commentDayLimit"
)
