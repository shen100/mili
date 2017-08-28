package common

import (
	"github.com/kataras/iris"
	"golang123/sessmanager"
	"golang123/model"
)

// Heartbeat 心跳
func Heartbeat(ctx iris.Context) {
	sessmanager.Sess.ShiftExpiration(ctx)
	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"data": "ok",
		},
	})
}