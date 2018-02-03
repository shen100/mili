package common

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shen100/golang123/model"
)

// SiteConfig 返回网站配置
func SiteConfig(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"title":       "Golang中文社区 - 和地鼠们分享你的知识、经验和见解",
			"description": "golang123 - 一个专业的Go语言技术社区，帮助你寻找答案，分享知识。",
			"keywords":    "golang,go,go语言,golang社区,go社区,golang中国,go中国,golang中文社区,go中文社区,go语言中文网,golang123,社区",
		},
	})
}
