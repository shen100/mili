package model

import (
	"crypto/md5"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/garyburd/redigo/redis"
	"github.com/shen100/golang123/config"
)

// User 用户
type User struct {
	ID           uint       `gorm:"primary_key" json:"id"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt"`
	DeletedAt    *time.Time `sql:"index" json:"deletedAt"`
	ActivatedAt  *time.Time `json:"activatedAt"`
	Name         string     `json:"name"`
	Pass         string     `json:"-"`
	Email        string     `json:"-"`
	Sex          uint       `json:"sex"`
	Location     string     `json:"location"`
	Introduce    string     `json:"introduce"`
	Phone        string     `json:"-"`
	Score        uint       `json:"score"`
	ArticleCount uint       `json:"articleCount"`
	CommentCount uint       `json:"commentCount"`
	CollectCount uint       `json:"collectCount"`
	Signature    string     `json:"signature"` //个人签名
	Role         int        `json:"role"`      //角色
	AvatarURL    string     `json:"avatarURL"` //头像
	CoverURL     string     `json:"coverURL"`  //个人主页背景图片URL
	Status       int        `json:"status"`
	Schools      []School   `json:"schools"` //教育经历
	Careers      []Career   `json:"careers"` //职业经历
}

// CheckPassword 验证密码是否正确
func (user User) CheckPassword(password string) bool {
	if password == "" || user.Pass == "" {
		return false
	}
	return user.EncryptPassword(password, user.Salt()) == user.Pass
}

// Salt 每个用户都有一个不同的盐
func (user User) Salt() string {
	var userSalt string
	if user.Pass == "" {
		userSalt = strconv.Itoa(int(time.Now().Unix()))
	} else {
		userSalt = user.Pass[0:10]
	}
	return userSalt
}

// EncryptPassword 给密码加密
func (user User) EncryptPassword(password, salt string) (hash string) {
	password = fmt.Sprintf("%x", md5.Sum([]byte(password)))
	hash = salt + password + config.ServerConfig.PassSalt
	hash = salt + fmt.Sprintf("%x", md5.Sum([]byte(hash)))
	return
}

// UserFromRedis 从redis中取出用户信息
func UserFromRedis(userID int) (User, error) {
	loginUser := fmt.Sprintf("%s%d", LoginUser, userID)

	RedisConn := RedisPool.Get()
	defer RedisConn.Close()

	userBytes, err := redis.Bytes(RedisConn.Do("GET", loginUser))
	if err != nil {
		fmt.Println(err)
		return User{}, errors.New("未登录")
	}
	var user User
	bytesErr := json.Unmarshal(userBytes, &user)
	if bytesErr != nil {
		fmt.Println(bytesErr)
		return user, errors.New("未登录")
	}
	return user, nil
}

// UserToRedis 将用户信息存到redis
func UserToRedis(user User) error {
	userBytes, err := json.Marshal(user)
	if err != nil {
		fmt.Println(err)
		return errors.New("error")
	}
	loginUserKey := fmt.Sprintf("%s%d", LoginUser, user.ID)

	RedisConn := RedisPool.Get()
	defer RedisConn.Close()

	if _, redisErr := RedisConn.Do("SET", loginUserKey, userBytes, "EX", config.ServerConfig.TokenMaxAge); redisErr != nil {
		fmt.Println("redis set failed: ", redisErr.Error())
		return errors.New("error")
	}
	return nil
}

const (
	// UserRoleNormal 普通用户
	UserRoleNormal = 1

	// UserRoleEditor 网站编辑
	UserRoleEditor = 2

	// UserRoleAdmin 管理员
	UserRoleAdmin = 3

	// UserRoleSuperAdmin 超级管理员
	UserRoleSuperAdmin = 4

	// UserRoleCrawler 爬虫，网站编辑或管理员登陆后台后，操作爬虫去抓取文章
	// 这时，生成的文章，其作者是爬虫账号。没有直接使用爬虫账号去登陆的情况.
	UserRoleCrawler = 5
)

const (
	// UserStatusInActive 未激活
	UserStatusInActive = 1

	// UserStatusActived 已激活
	UserStatusActived = 2

	// UserStatusFrozen 已冻结
	UserStatusFrozen = 3
)

const (
	// UserSexMale 男
	UserSexMale = 0

	// UserSexFemale 女
	UserSexFemale = 1

	// MaxUserNameLen 用户名的最大长度
	MaxUserNameLen = 20

	// MinUserNameLen 用户名的最小长度
	MinUserNameLen = 4

	// MaxPassLen 密码的最大长度
	MaxPassLen = 20

	// MinPassLen 密码的最小长度
	MinPassLen = 6

	// MaxSignatureLen 个性签名最大长度
	MaxSignatureLen = 200

	// MaxLocationLen 居住地的最大长度
	MaxLocationLen = 200

	// MaxIntroduceLen 个人简介的最大长度
	MaxIntroduceLen = 500
)
