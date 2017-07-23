package model

import (
    "fmt"
    "crypto/md5"
    "strconv"
    "time"
    "golang123/config"
)

// User 用户
type User struct {
    ID             uint               `gorm:"primary_key" json:"id"`
    CreatedAt      time.Time          `json:"createdAt"`
    UpdatedAt      time.Time          `json:"updatedAt"`
    DeletedAt      *time.Time         `sql:"index" json:"deletedAt"`
    Name           string             `json:"name"`
    Pass           string             `json:"pass"`
    Email          string             `json:"email"`
    Phone          string             `json:"phone"`
    Role           int                `json:"role"`
}

// CheckPassword 验证密码是否正确
func (user User) CheckPassword(password string) bool {
    if password == "" || user.Pass == "" {
        return false
    }
    return user.EncryptPassword(password) == user.Pass
}

// EncryptPassword 给密码加密
func (user User) EncryptPassword(password string) (hash string) {
    var userSalt string
    if user.Pass == "" {
        userSalt = strconv.Itoa(int(time.Now().Unix()))
    } else {
        userSalt = user.Pass[0:10]   
    }
    hash = userSalt + password + config.ServerConfig.PassSalt
    hash = userSalt + fmt.Sprintf("%x", md5.Sum([]byte(hash)))
    return
}

// ToJSON 转成map
func (user User) ToJSON() map[string]interface{} {
    return map[string]interface{}{
        "id"        : user.ID,
        "createdAt" : user.CreatedAt,
        "updatedAt" : user.UpdatedAt,
        "deletedAt" : user.DeletedAt,
        "name"      : user.Name,
        "email"     : user.Email,
        "phone"     : user.Phone,
        "role"      : user.Role,
    }
}

const (
    // UserRoleNormal 普通用户
    UserRoleNormal      = 1

    // UserRoleEditor 网站编辑
    UserRoleEditor      = 2

    // UserRoleAdmin 管理员
    UserRoleAdmin       = 3

    // UserRoleSuperAdmin 超级管理员
    UserRoleSuperAdmin  = 4
)
