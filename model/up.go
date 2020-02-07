package model

import "time"

// Up 点赞
type Up struct {
    ID             uint               `gorm:"primary_key" json:"id"`
    CreatedAt      time.Time          `json:"createdAt"`
    UpdatedAt      time.Time          `json:"updatedAt"`
    DeletedAt      *time.Time         `sql:"index" json:"deletedAt"`
	TargetID       uint               `json:"targetID"`   
	Type           int                `json:"type"`   
	UserID         uint               `json:"userID"`
	User           User               `json:"user"`
}

const (
	// UpTypeArticle 为文章点赞
	UpTypeArticle = 1	

	// UpTypeComment 为评论点赞
	UpTypeComment = 2	
)