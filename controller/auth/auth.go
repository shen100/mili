package auth

import (
	"gopkg.in/kataras/iris.v6"
	"golang123/model"
	"golang123/controller/common"
)

// SigninRequired 必须是登录用户
func SigninRequired(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	session     := ctx.Session();
	user        := session.Get("user")
	if user == nil {
		SendErrJSON("未登录", ctx)
		return	
	}
	ctx.Next()
}

// AdminRequired 授权
func AdminRequired(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	session     := ctx.Session();
	userData    := session.Get("user")

	if userData == nil {
		SendErrJSON("未登录", ctx)
		return
	}
	user := userData.(model.User)
	if user.Role == model.UserRoleAdmin || user.Role == model.UserRoleSuperAdmin {
		ctx.Next()
	} else {
		SendErrJSON("没有权限", ctx)
		return	
	}
}

