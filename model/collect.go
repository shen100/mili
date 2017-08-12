package model

import "time"

// Collect 收藏
type Collect struct {
    ID        uint          `gorm:"primary_key" json:"id"`
    CreatedAt time.Time     `json:"createdAt"`
    UpdatedAt time.Time     `json:"updatedAt"`
	DeletedAt *time.Time    `sql:"index" json:"deletedAt"`
	UserID    uint          `json:"userID"`
	ArticleID uint          `json:"articleID"`
	Article   Article       `json:"article"`
}
