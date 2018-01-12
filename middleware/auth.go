package middleware

import (
	"errors"
	"fmt"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/shen100/golang123/config"
	"github.com/shen100/golang123/controller/common"
	"github.com/shen100/golang123/model"
)

func getUser(c *gin.Context) (model.User, error) {
	var user model.User
	tokenString, cookieErr := c.Cookie("token")

	if cookieErr != nil {
		return user, errors.New("未登录")
	}

	token, tokenErr := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.ServerConfig.TokenSecret), nil
	})

	if tokenErr != nil {
		return user, errors.New("未登录")
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID := int(claims["id"].(float64))
		var err error
		user, err = model.UserFromRedis(userID)
		if err != nil {
			return user, errors.New("未登录")
		}
		return user, nil
	}
	return user, errors.New("未登录")
}

// SigninRequired 必须是登录用户
func SigninRequired(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var user model.User
	var err error
	if user, err = getUser(c); err != nil {
		SendErrJSON("未登录", model.ErrorCode.LoginTimeout, c)
		return
	}
	c.Set("user", user)
	c.Next()
}

// ActiveRequired 用户必须是激活状态
func ActiveRequired(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var user model.User
	var err error
	if user, err = getUser(c); err != nil {
		SendErrJSON("未登录", model.ErrorCode.LoginTimeout, c)
		return
	}

	if user.Status == model.UserStatusActived {
		c.Set("user", user)
		c.Next()
	} else {
		var msg = ""
		switch user.Status {
		case model.UserStatusInActive:
			{
				msg = "账号未激活"
			}
		case model.UserStatusFrozen:
			{
				msg = "账号已被冻结"
			}
		}
		SendErrJSON(msg, model.ErrorCode.InActive, c)
	}
}

// EditorRequired 必须是网站编辑
func EditorRequired(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var user model.User
	var err error
	if user, err = getUser(c); err != nil {
		SendErrJSON("未登录", model.ErrorCode.LoginTimeout, c)
		return
	}
	if user.Role == model.UserRoleEditor || user.Role == model.UserRoleAdmin || user.Role == model.UserRoleSuperAdmin {
		c.Next()
	} else {
		SendErrJSON("没有权限", c)
		return
	}
}

// AdminRequired 必须是管理员
func AdminRequired(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var user model.User
	var err error
	if user, err = getUser(c); err != nil {
		SendErrJSON("未登录", model.ErrorCode.LoginTimeout, c)
		return
	}
	if user.Role == model.UserRoleAdmin || user.Role == model.UserRoleCrawler || user.Role == model.UserRoleSuperAdmin {
		c.Next()
	} else {
		SendErrJSON("没有权限", c)
		return
	}
}
