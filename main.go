package main

import (
	"fmt"
	"os"
	"time"
	"strconv"
    _ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/asaskevich/govalidator"
	"github.com/garyburd/redigo/redis"
	"github.com/jinzhu/gorm"
	"github.com/kataras/iris"
	"github.com/kataras/iris/sessions"
	"github.com/kataras/iris/middleware/logger"
	"github.com/shen100/golang123/config"
	"github.com/shen100/golang123/model"
	"github.com/shen100/golang123/route"
	"github.com/shen100/golang123/manager"
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
	db.DB().SetMaxIdleConns(config.DBConfig.MaxIdleConns);
	db.DB().SetMaxOpenConns(config.DBConfig.MaxOpenConns)
	model.DB = db;

	c, err := redis.Dial("tcp", config.RedisConfig.URL)
    if err != nil {
		fmt.Println("Connect to redis error", err)
		os.Exit(-1)
	}
	manager.C = c

	sess := sessions.New(sessions.Config{
		Cookie: config.ServerConfig.SessionID,
		Expires: time.Minute * time.Duration(config.ServerConfig.SessionTimeout),
	})
	manager.Sess = sess

	govalidator.SetFieldsRequiredByDefault(true)
}

func main() {
	app := iris.New()

	app.Configure(iris.WithConfiguration(iris.Configuration{
		Charset: "UTF-8",	
	}))

	app.Use(logger.New())

	route.Route(app)

	app.OnErrorCode(iris.StatusNotFound, func(ctx iris.Context) {
		ctx.JSON(iris.Map{
			"errNo" : model.ErrorCode.NotFound,
			"msg"   : "Not Found",
			"data"  : iris.Map{},
		})
	})

	app.OnErrorCode(iris.StatusInternalServerError, func(ctx iris.Context) {
		ctx.JSON(iris.Map{
			"errNo" : model.ErrorCode.ERROR,
			"msg"   : "error",
			"data"  : iris.Map{},
		})
	})

	addr := iris.Addr(":" + strconv.Itoa(config.ServerConfig.Port))
	if config.ServerConfig.Env == model.DevelopmentMode {
		app.Run(addr)
	} else {
		app.Run(addr, iris.WithoutVersionChecker)
	}
}

