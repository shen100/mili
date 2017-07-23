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
	ArticleID      uint               `json:"articleID"`  
	Ups            []Up               `gorm:"ForeignKey:TargetID" json:"ups"` 
}

const (
    // CommentVerifying 审核中
    CommentVerifying      = 1

    // CommentVerifySuccess 审核通过
    CommentVerifySuccess  = 2

    // CommentVerifyFail 审核未通过
    CommentVerifyFail     = 3
)