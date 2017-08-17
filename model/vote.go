package model

import "time"

// Vote 投票
type Vote struct {
    ID             uint               `gorm:"primary_key" json:"id"`
    CreatedAt      time.Time          `json:"createdAt"`
    UpdatedAt      time.Time          `json:"updatedAt"`
	DeletedAt      *time.Time         `sql:"index" json:"deletedAt"`
	EndAt          time.Time          `json:"endAt"`
    Name           string             `json:"name"`
    BrowseCount    int                `json:"browseCount"`
    CommentCount   int                `json:"commentCount"`
    Status         int                `json:"status"`
    Content        string             `json:"content"`
    Comments       []Comment          `json:"comments"` 
    UserID         uint               `json:"userID"`
    User           User               `json:"user"`
    VoteItems      []VoteItem         `json:"voteItems"`
}

// VoteItem 投票项
type VoteItem struct {
	ID             uint               `gorm:"primary_key" json:"id"`
    CreatedAt      time.Time          `json:"createdAt"`
    UpdatedAt      time.Time          `json:"updatedAt"`
	DeletedAt      *time.Time         `sql:"index" json:"deletedAt"`
	Name           string             `json:"name"`
    Count          uint               `json:"count"` 
    VoteID         uint               `json:"voteID"`
}

// UserVote 用户投的票
type UserVote struct {
	ID             uint               `gorm:"primary_key" json:"id"`
    CreatedAt      time.Time          `json:"createdAt"`
    UpdatedAt      time.Time          `json:"updatedAt"`
	DeletedAt      *time.Time         `sql:"index" json:"deletedAt"`
	UserID         uint               `json:"userID"`
    User           User               `json:"user"`
    VoteID         uint               `json:"voteID"`
	VoteItemID     uint               `json:"voteItemID"`
}

const (
    // VoteUnderway 进行中
    VoteUnderway   = 1

    // VoteOver 已结束
    VoteOver       = 2
)