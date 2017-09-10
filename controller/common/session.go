package common

import (
	"github.com/kataras/iris"
	"golang123/manager"
)

// SessShiftExpiration 延时session过期
func SessShiftExpiration(ctx iris.Context) {
	manager.Sess.ShiftExpiration(ctx)
	ctx.Next()
}