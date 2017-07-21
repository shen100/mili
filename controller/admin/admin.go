package admin

import (
	"gopkg.in/kataras/iris.v6"
)

// Authentication 授权
func Authentication(ctx *iris.Context) {
	if true {
		ctx.Next()
	}
}

