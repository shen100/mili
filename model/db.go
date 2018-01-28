package model

import (
	"fmt"
	"os"
	"time"

	"github.com/garyburd/redigo/redis"
	"github.com/jinzhu/gorm"
	"github.com/shen100/golang123/config"
)

// DB 数据库连接
var DB *gorm.DB

// RedisPool Redis连接池
var RedisPool *redis.Pool

func initDB() {
	db, err := gorm.Open(config.DBConfig.Dialect, config.DBConfig.URL)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(-1)
	}
	if config.ServerConfig.Env == DevelopmentMode {
		db.LogMode(true)
	}
	db.DB().SetMaxIdleConns(config.DBConfig.MaxIdleConns)
	db.DB().SetMaxOpenConns(config.DBConfig.MaxOpenConns)
	DB = db
}

func initRedis() {
	RedisPool = &redis.Pool{
		MaxIdle:     config.RedisConfig.MaxIdle,
		MaxActive:   config.RedisConfig.MaxActive,
		IdleTimeout: 240 * time.Second,
		Wait:        true,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", config.RedisConfig.URL)
			if err != nil {
				return nil, err
			}
			return c, nil
		},
	}
}

func init() {
	initDB()
	initRedis()
}
