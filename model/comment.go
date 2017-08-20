package model

import "time"

// Comment 评论
type Comment struct {
    ID             uint               `gorm:"primary_key" json:"id"`
    CreatedAt      time.Time          `json:"createdAt"`
    UpdatedAt      time.Time          `json:"updatedAt"`
    DeletedAt      *time.Time         `sql:"index" json:"deletedAt"`
    Status         int                `json:"status"`
    Content        string             `json:"content"`
    ParentID       uint               `json:"parentID"`  
    Parents        []Comment          `json:"parents"`  
    SourceName     string             `json:"sourceName"` 
    SourceID       uint               `json:"sourceID"`
    UserID         uint               `json:"userID"`
    User           User               `json:"user"`
}

const (
    // CommentSourceArticle 对文章进行评论
    CommentSourceArticle = "article"

    // CommentSourceVote 对投票进行评论
    CommentSourceVote    = "vote"
)

const (
    // CommentVerifying 审核中
    CommentVerifying      = 1

    // CommentVerifySuccess 审核通过
    CommentVerifySuccess  = 2

    // CommentVerifyFail 审核未通过
    CommentVerifyFail     = 3
)