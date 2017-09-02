package model

import "time"

// Career 职业生涯
type Career struct {
    ID             uint               `gorm:"primary_key" json:"id"`
    CreatedAt      time.Time          `json:"createdAt"`
    UpdatedAt      time.Time          `json:"updatedAt"`
    DeletedAt      *time.Time         `sql:"index" json:"deletedAt"`
    Company        string             `json:"company"` //公司或组织
	Title          string             `json:"title"`   //职位
	UserID         uint               `json:"userID"`
}

// CareerMaxCompanyLen 公司或组织名称的最大长度
const CareerMaxCompanyLen = 200

// CareerMaxTitleLen 职位的最大长度
const CareerMaxTitleLen = 200