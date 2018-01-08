package middleware

import (
	"encoding/json"
	"fmt"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/garyburd/redigo/redis"
	"github.com/gin-gonic/gin"
	"github.com/shen100/golang123/config"
	"github.com/shen100/golang123/controller/common"
	"github.com/shen100/golang123/model"
	"github.com/shen100/golang123/utils"
)

// SigninRequired 必须是登录用户
func SigninRequired(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	tokenString, cookieErr := c.Cookie("token")

	if cookieErr != nil {
		SendErrJSON("未登录", model.ErrorCode.LoginTimeout, c)
		return
	}

	token, tokenErr := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.ServerConfig.TokenSecret), nil
	})

	if tokenErr != nil {
		SendErrJSON("未登录", model.ErrorCode.LoginTimeout, c)
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID := int(claims["id"].(float64))
		loginUser := fmt.Sprintf("%s%d", model.LoginUser, userID)
		fmt.Println(loginUser)
		userBytes, err := redis.Bytes(utils.RedisConn.Do("GET", loginUser))
		if err != nil {
			SendErrJSON("未登录", model.ErrorCode.LoginTimeout, c)
			return
		}
		var user model.User
		bytesErr := json.Unmarshal(userBytes, &user)
		if bytesErr != nil {
			fmt.Println(bytesErr)
			SendErrJSON("未登录", model.ErrorCode.LoginTimeout, c)
		} else {
			c.Set("user", user)
			c.Next()
		}
	}
}

// ActiveRequired 用户必须是激活状态
// func ActiveRequired(ctx iris.Context) {
// 	SendErrJSON := common.SendErrJSON
// 	user, ok := manager.Sess.Start(ctx).Get("user").(model.User)

// 	if !ok {
// 		SendErrJSON("未登录", model.ErrorCode.LoginTimeout, ctx)
// 		return
// 	}

// 	if user.Status == model.UserStatusActived {
// 		ctx.Next()
// 	} else {
// 		var msg = ""
// 		switch user.Role {
// 		case model.UserStatusInActive:
// 			{
// 				msg = "账号未激活"
// 			}
// 		case model.UserStatusFrozen:
// 			{
// 				msg = "账号已被冻结"
// 			}
// 		}
// 		SendErrJSON(msg, model.ErrorCode.InActive, ctx)
// 	}
// }

// // EditorRequired 必须是网站编辑
// func EditorRequired(ctx iris.Context) {
// 	SendErrJSON := common.SendErrJSON
// 	user, ok := manager.Sess.Start(ctx).Get("user").(model.User)

// 	if !ok {
// 		SendErrJSON("未登录", model.ErrorCode.LoginTimeout, ctx)
// 		return
// 	}
// 	if user.Role == model.UserRoleEditor || user.Role == model.UserRoleAdmin || user.Role == model.UserRoleSuperAdmin {
// 		ctx.Next()
// 	} else {
// 		SendErrJSON("没有权限", ctx)
// 		return
// 	}
// }

// // AdminRequired 必须是管理员
// func AdminRequired(ctx iris.Context) {
// 	SendErrJSON := common.SendErrJSON
// 	user, ok := manager.Sess.Start(ctx).Get("user").(model.User)

// 	if !ok {
// 		SendErrJSON("未登录", model.ErrorCode.LoginTimeout, ctx)
// 		return
// 	}
// 	if user.Role == model.UserRoleAdmin || user.Role == model.UserRoleCrawler || user.Role == model.UserRoleSuperAdmin {
// 		ctx.Next()
// 	} else {
// 		SendErrJSON("没有权限", ctx)
// 		return
// 	}
// }
