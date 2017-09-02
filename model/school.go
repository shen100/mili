package model

import "time"

// School 学校(教育经历)
type School struct {
    ID             uint               `gorm:"primary_key" json:"id"`
    CreatedAt      time.Time          `json:"createdAt"`
    UpdatedAt      time.Time          `json:"updatedAt"`
    DeletedAt      *time.Time         `sql:"index" json:"deletedAt"`
    Name           string             `json:"name"`
	Speciality     string             `json:"speciality"`
	UserID         uint               `json:"userID"`
}

// SchoolMaxNameLen 学校或教育机构名的最大长度
const SchoolMaxNameLen = 200

// SchoolMaxSpecialityLen 专业的最大长度
const SchoolMaxSpecialityLen = 200