package model

import "time"

// Category 文章分类
type Category struct {
    ID        uint       `gorm:"primary_key" json:"id"`
    CreatedAt time.Time  `json:"createdAt"`
    UpdatedAt time.Time  `json:"updatedAt"`
    DeletedAt *time.Time `sql:"index" json:"deletedAt"`
    Name      string     `json:"name"`
    Sequence  int        `json:"sequence"`
    ParentID  int        `json:"parentId"`
    Status    int        `json:"status"`
}

// CategoryStatusOpen 开启
const CategoryStatusOpen  = 1

// CategoryStatusClose 关闭
const CategoryStatusClose = 2