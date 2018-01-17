package model

import "time"

// Comment 评论, 也称回复
type Comment struct {
	ID          uint       `gorm:"primary_key" json:"id"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
	DeletedAt   *time.Time `sql:"index" json:"deletedAt"`
	Status      int        `json:"status"`
	Content     string     `json:"content"`
	HTMLContent string     `json:"htmlContent"`
	ContentType int        `json:"contentType"`
	ParentID    uint       `json:"parentID"`   //直接父评论的ID
	Parents     []Comment  `json:"parents"`    //所有的父评论
	SourceName  string     `json:"sourceName"` //用来区分是对话题，还是对投票进行评论
	SourceID    uint       `json:"sourceID"`   //话题或投票的ID
	UserID      uint       `json:"userID"`
	User        User       `json:"user"`
}

const (
	// CommentSourceArticle 对话题进行评论
	CommentSourceArticle = "article"

	// CommentSourceVote 对投票进行评论
	CommentSourceVote = "vote"
)

const (
	// CommentVerifying 审核中
	CommentVerifying = 1

	// CommentVerifySuccess 审核通过
	CommentVerifySuccess = 2

	// CommentVerifyFail 审核未通过
	CommentVerifyFail = 3
)

// MaxCommentLen 最大的评论长度
const MaxCommentLen = 5000
