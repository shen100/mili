package model

import "time"

// Message 消息
type Message struct {
    ID             uint               `gorm:"primary_key" json:"id"`
    CreatedAt      time.Time          `json:"createdAt"`
    UpdatedAt      time.Time          `json:"updatedAt"`
    DeletedAt      *time.Time         `sql:"index" json:"deletedAt"`
	Type           int                `json:"type"`
	HasRead        bool               `json:"hasRead"`
	ArticleID      int                `json:"articleID"`
	UserID         int                `json:"userID"`
	FromUserID     int                `json:"fromUserID"`
	ChatID         int                `json:"chatID"`
	CommentID      int                `json:"commentID"`
}

const (
    // MessageTypeComment 有人评论了文章
    MessageTypeComment = 1

    // MessageTypeInvite 有人邀请回答
    MessageTypeInvite  = 2
)