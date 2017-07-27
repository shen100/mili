package model

import "time"

// TimelineItem 时间轴
type TimelineItem struct {
    ID             uint               `gorm:"primary_key" json:"id"`
    CreatedAt      time.Time          `json:"createdAt"`
    UpdatedAt      time.Time          `json:"updatedAt"`
    DeletedAt      *time.Time         `sql:"index" json:"deletedAt"`
	Name           string             `json:"name"`   
	Content        string             `json:"content"`   
}