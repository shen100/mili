package model

import "time"

// School 学校(教育经历)
type School struct {
    ID             uint               `gorm:"primary_key" json:"id"`
    CreatedAt      time.Time          `json:"createdAt"`
    UpdatedAt      time.Time          `json:"updatedAt"`
    DeletedAt      *time.Time         `sql:"index" json:"deletedAt"`
    Name           string             `json:"name"`
	Speciality     string             `json:"speciality"` //专业
	UserID         uint               `json:"userID"`
}

// MaxSchoolNameLen 学校或教育机构名的最大长度
const MaxSchoolNameLen = 200

// MaxSchoolSpecialityLen 专业的最大长度
const MaxSchoolSpecialityLen = 200