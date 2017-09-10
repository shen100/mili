package model

import "time"

// Category 话题的分类
type Category struct {
    ID        uint       `gorm:"primary_key" json:"id"`
    CreatedAt time.Time  `json:"createdAt"`
    UpdatedAt time.Time  `json:"updatedAt"`
    DeletedAt *time.Time `sql:"index" json:"deletedAt"`
    Name      string     `json:"name"`
    Sequence  int        `json:"sequence"` //同级别的分类可根据sequence的值来排序
    ParentID  int        `json:"parentId"` //直接父分类的ID
}