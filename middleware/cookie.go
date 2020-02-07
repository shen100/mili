package middleware

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/shen100/golang123/config"
	"github.com/shen100/golang123/model"
)

// RefreshTokenCookie 刷新过期时间
func RefreshTokenCookie(c *gin.Context) {
	tokenString, err := c.Cookie("token")
	fmt.Println(err)
	if tokenString != "" && err == nil {
		c.SetCookie("token", tokenString, config.ServerConfig.TokenMaxAge, "/", "", true, true)
		if user, err := getUser(c); err == nil {
			model.UserToRedis(user)
		}
	}
	c.Next()
}
