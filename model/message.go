package model

import "time"

// Message 消息
type Message struct {
	ID         uint       `gorm:"primary_key" json:"id"`
	CreatedAt  time.Time  `json:"createdAt"`
	UpdatedAt  time.Time  `json:"updatedAt"`
	DeletedAt  *time.Time `sql:"index" json:"deletedAt"`
	Type       string     `json:"type"`
	Readed     bool       `json:"readed"`
	FromUserID uint       `json:"fromUserID"`
	ToUserID   uint       `json:"toUserID"`
	FromUser   User       `json:"fromUser"`
	SourceID   uint       `json:"sourceID"`
	SourceName string     `json:"sourceName"`
	CommentID  uint       `json:"commentID"`
	Title      string     `json:"title"`
	Content    string     `json:"content"`
}

const (
	// MessageTypeCommentArticle 回复了话题
	MessageTypeCommentArticle = "messageTypeCommentArticle"

	// MessageTypeCommentVote 回复了投票
	MessageTypeCommentVote = "MessageTypeCommentVote"

	// MessageTypeCommentComment 对回复进行了回复
	MessageTypeCommentComment = "messageTypeCommentComment"
)
