package model

import (
	"time"
)

// Vote 投票
type Vote struct {
	ID            uint       `gorm:"primary_key" json:"id"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
	DeletedAt     *time.Time `sql:"index" json:"deletedAt"`
	EndAt         time.Time  `json:"endAt"`
	Name          string     `json:"name"`
	BrowseCount   int        `json:"browseCount"`
	CommentCount  int        `json:"commentCount"`
	CollectCount  int        `json:"collectCount"`
	Status        int        `json:"status"`
	Content       string     `json:"content"`
	HTMLContent   string     `json:"htmlContent"`
	ContentType   int        `json:"contentType"`
	Comments      []Comment  `gorm:"ForeignKey:SourceID" json:"comments"`
	UserID        uint       `json:"userID"`
	User          User       `json:"user"`
	LastUserID    uint       `json:"lastUserID"` //最后一个回复投票、参与投票的人
	LastUser      User       `json:"lastUser"`
	LastCommentAt *time.Time `json:"lastCommentAt"`
	VoteItems     []VoteItem `json:"voteItems"`
}

// VoteItem 投票项, 一个投票有多个投票项，用户选择投票项进行投票
type VoteItem struct {
	ID        uint       `gorm:"primary_key" json:"id"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `sql:"index" json:"deletedAt"`
	Name      string     `json:"name"`
	Count     uint       `json:"count"`
	VoteID    uint       `json:"voteID"`
}

// UserVote 用户对哪个投票项进行了投票
type UserVote struct {
	ID         uint       `gorm:"primary_key" json:"id"`
	CreatedAt  time.Time  `json:"createdAt"`
	UpdatedAt  time.Time  `json:"updatedAt"`
	DeletedAt  *time.Time `sql:"index" json:"deletedAt"`
	UserID     uint       `json:"userID"`
	User       User       `json:"user"`
	VoteID     uint       `json:"voteID"`
	Vote       Vote       `json:"vote"`
	VoteItemID uint       `json:"voteItemID"`
}

const (
	// VoteUnderway 进行中
	VoteUnderway = 1

	// VoteOver 已结束
	VoteOver = 2
)
