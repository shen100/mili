package auth

import (
	"github.com/kataras/iris"
	"golang123/model"
	"golang123/manager"
	"golang123/controller/common"
)

// SigninRequired 必须是登录用户
func SigninRequired(ctx iris.Context) {
	manager.Sess.ShiftExpiration(ctx)
	SendErrJSON := common.SendErrJSON
	_, ok := manager.Sess.Start(ctx).Get("user").(model.User)
	if !ok {
		SendErrJSON("未登录", model.ErrorCode.LoginTimeout, ctx)
		return	
	}
	ctx.Next()
}

// ActiveRequired 用户必须是激活状态
func ActiveRequired(ctx iris.Context) {
	manager.Sess.ShiftExpiration(ctx)
	SendErrJSON := common.SendErrJSON
	user, ok := manager.Sess.Start(ctx).Get("user").(model.User)

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
		SendErrJSON(msg, model.ErrorCode.InActive, ctx)
	}
}

// EditorRequired 必须是网站编辑
func EditorRequired(ctx iris.Context) {
	manager.Sess.ShiftExpiration(ctx)
	SendErrJSON := common.SendErrJSON
	user, ok := manager.Sess.Start(ctx).Get("user").(model.User)

	if !ok {
		SendErrJSON("未登录", model.ErrorCode.LoginTimeout, ctx)
		return
	}
	if user.Role == model.UserRoleEditor || user.Role == model.UserRoleAdmin || user.Role == model.UserRoleSuperAdmin {
		ctx.Next()
	} else {
		SendErrJSON("没有权限", ctx)
		return	
	}
}

// AdminRequired 必须是管理员
func AdminRequired(ctx iris.Context) {
	manager.Sess.ShiftExpiration(ctx)
	SendErrJSON := common.SendErrJSON
	user, ok := manager.Sess.Start(ctx).Get("user").(model.User)

	if !ok {
		SendErrJSON("未登录", model.ErrorCode.LoginTimeout, ctx)
		return
	}
	if user.Role == model.UserRoleAdmin || user.Role == model.UserRoleSuperAdmin {
		ctx.Next()
	} else {
		SendErrJSON("没有权限", ctx)
		return	
	}
}

