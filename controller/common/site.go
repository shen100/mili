package common

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shen100/golang123/model"
)

// SiteInfo 返回网站信息
func SiteInfo(c *gin.Context) {
	var userCount int
	var topicCount int
	var replyCount int
	if err := model.DB.Model(&model.User{}).Count(&userCount).Error; err != nil {
		SendErrJSON("error", c)
		return
	}
	if err := model.DB.Model(&model.Article{}).Count(&topicCount).Error; err != nil {
		SendErrJSON("error", c)
		return
	}
	if err := model.DB.Model(&model.Comment{}).Count(&replyCount).Error; err != nil {
		SendErrJSON("error", c)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"siteConfig": gin.H{
				"title":       "Golang中文社区 - 和地鼠们分享你的知识、经验和见解",
				"description": "golang123 - 一个专业的Go语言技术社区，帮助你寻找答案，分享知识。",
				"keywords":    "golang,go,go语言,golang社区,go社区,golang中国,go中国,golang中文社区,go中文社区,go语言中文网,golang123,社区",
			},
			"userCount":  userCount,
			"topicCount": topicCount,
			"replyCount": replyCount,
		},
	})
}
