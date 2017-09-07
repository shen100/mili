package model

// NoParent 无父结点时的parent_id
const NoParent = 0

const (
	// MaxUserNameLen 用户名的最大长度
	MaxUserNameLen = 20	

	// MinUserNameLen 用户名的最小长度
	MinUserNameLen = 4	

	// MaxPassLen 密码的最大长度
	MaxPassLen = 20	

	// MinPassLen 密码的最小长度
	MinPassLen = 6

	// MaxNameLen 名称最大长度
	MaxNameLen = 200
)

// 积分相关
const (
	// CreateArticleScore 创建话题增加的积分
	CreateArticleScore = 5	

	// CreateCommentScore 话题或投票被评论增加的积分
	ByCommentScore = 2

	// ByCollectScore 话题或投票被收藏增加的积分
	ByCollectScore = 2
)

// 为了防止从redis中存取数据时key混乱了，在此集中定义常量来作为各key的名字
const (
	// ActiveTime 生成激活账号的链接
	ActiveTime = "activeTime"

	// ResetTime 生成重置密码的链接
	ResetTime = "resetTime"
)