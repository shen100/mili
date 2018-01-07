package main

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/garyburd/redigo/redis"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/shen100/golang123/config"
	"github.com/shen100/golang123/manager"
	"github.com/shen100/golang123/model"
	"github.com/shen100/golang123/route"
)

func init() {
	db, err := gorm.Open(config.DBConfig.Dialect, config.DBConfig.URL)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(-1)
	}
	if config.ServerConfig.Env == model.DevelopmentMode {
		db.LogMode(true)
	}
	db.DB().SetMaxIdleConns(config.DBConfig.MaxIdleConns)
	db.DB().SetMaxOpenConns(config.DBConfig.MaxOpenConns)
	model.DB = db

	c, err := redis.Dial("tcp", config.RedisConfig.URL)
	if err != nil {
		fmt.Println("Connect to redis error", err)
		os.Exit(-1)
	}
	manager.C = c

	sess := sessions.New(sessions.Config{
		Cookie:  config.ServerConfig.SessionID,
		Expires: time.Minute * time.Duration(config.ServerConfig.SessionTimeout),
	})
	manager.Sess = sess

	govalidator.SetFieldsRequiredByDefault(true)
}

func main() {
	if config.ServerConfig.Env != model.DevelopmentMode {
		// Disable Console Color, you don't need console color when writing the logs to file.
	    gin.DisableConsoleColor()
	   	// Logging to a file.
	    f, _ := os.Create("gin.log")
	    gin.DefaultWriter = io.MultiWriter(f)
	}

	// Creates a router without any middleware by default
	router := gin.New()

	// Global middleware
	// Logger middleware will write the logs to gin.DefaultWriter even if you set with GIN_MODE=release.
	// By default gin.DefaultWriter = os.Stdout
	router.Use(gin.Logger())

	// Recovery middleware recovers from any panics and writes a 500 if there was one.
	router.Use(gin.Recovery())

	route.Route(router)

	// app.OnErrorCode(iris.StatusNotFound, func(ctx iris.Context) {
	// 	ctx.JSON(iris.Map{
	// 		"errNo": model.ErrorCode.NotFound,
	// 		"msg":   "Not Found",
	// 		"data":  iris.Map{},
	// 	})
	// })

	router.Run(":" + fmt.Sprintf("%d", config.ServerConfig.Port))
}
