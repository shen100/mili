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
		SendErrJSON("未登录", model.ErrorCode.LoginTimeout, ctx)
		return	
	}
	session.Set("user", user)
	ctx.Next()
}

// ActiveRequired 用户必须是激活状态
func ActiveRequired(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	session     := ctx.Session();
	user, ok    := session.Get("user").(model.User)

	if !ok {
		SendErrJSON("未登录", model.ErrorCode.LoginTimeout, ctx)
		return
	}

	if user.Status == model.UserStatusActived {
		ctx.Next()
	} else {
		var msg = ""
		switch user.Role {
			case model.UserStatusInActive: {
				msg = "账号未激活"
			}
			case model.UserStatusFrozen: {
				msg = "账号已被冻结"
			}
		}
		SendErrJSON(msg, ctx)
	}
}

// EditorRequired 必须是网站编辑
func EditorRequired(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	session     := ctx.Session();
	user, ok    := session.Get("user").(model.User)

	if !ok {
		SendErrJSON("未登录", model.ErrorCode.LoginTimeout, ctx)
		return
	}
	session.Set("user", user)
	if user.Role == model.UserRoleEditor || user.Role == model.UserRoleAdmin || user.Role == model.UserRoleSuperAdmin {
		ctx.Next()
	} else {
		SendErrJSON("没有权限", ctx)
		return	
	}
}

// AdminRequired 必须是管理员
func AdminRequired(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	session     := ctx.Session();
	user, ok    := session.Get("user").(model.User)

	if !ok {
		SendErrJSON("未登录", model.ErrorCode.LoginTimeout, ctx)
		return
	}
	session.Set("user", user)
	if user.Role == model.UserRoleAdmin || user.Role == model.UserRoleSuperAdmin {
		ctx.Next()
	} else {
		SendErrJSON("没有权限", ctx)
		return	
	}
}

