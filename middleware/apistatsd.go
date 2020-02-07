package middleware

import (
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/shen100/golang123/config"
	"github.com/shen100/golang123/model"
)

func getReqPath(c *gin.Context) string {
	pathArr := strings.Split(c.Request.URL.Path, "/")
	for i := len(pathArr) - 1; i >= 0; i-- {
		if pathArr[i] == "" {
			pathArr = append(pathArr[:i], pathArr[i+1:]...)
		}
	}
	for i, path := range pathArr {
		if matched, err := regexp.MatchString("^[0-9]+$", path); matched && err == nil {
			pathArr[i] = "id"
		}
	}
	pathArr = append([]string{strings.ToLower(c.Request.Method)}, pathArr...)
	return strings.Join(pathArr, "_")
}

// APIStatsD 统计api请求
func APIStatsD() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()
		c.Next()

		if config.StatsDConfig.URL == "" {
			return
		}

		duration := time.Since(t)
		durationMS := int64(duration / 1e6) // 转成毫秒

		reqPath := getReqPath(c)
		if err := (*model.StatsdClient).Timing(reqPath, durationMS, 1); err != nil {
			fmt.Println(err)
		}

		status := c.Writer.Status()
		if status != http.StatusGatewayTimeout && durationMS > 5000 {
			timeoutReqPath := strings.Join([]string{"timeout", reqPath}, ":")
			if err := (*model.StatsdClient).Inc(timeoutReqPath, 1, 1); err != nil {
				fmt.Println(err)
			}
		}
	}
}
