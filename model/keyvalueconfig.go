package model

import "time"

// KeyValueConfig key, value配置
type KeyValueConfig struct {
	ID        uint       `gorm:"primary_key" json:"id"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `sql:"index" json:"deletedAt"`
	KeyName   string     `json:"key"`
	Value     string     `json:"value"`
}
