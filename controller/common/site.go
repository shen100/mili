package common

import (
	"encoding/json"
	"fmt"
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
	siteConfig := make(map[string]interface{})
	var keyvalueconfig model.KeyValueConfig
	if err := model.DB.Where("key_name = \"site_config\"").Find(&keyvalueconfig).Error; err != nil {
		fmt.Println(err.Error())
		siteConfig["name"] = ""
		siteConfig["icp"] = ""
		siteConfig["title"] = ""
		siteConfig["description"] = ""
		siteConfig["keywords"] = ""
		siteConfig["logoURL"] = "/images/logo.png"
	}
	if err := json.Unmarshal([]byte(keyvalueconfig.Value), &siteConfig); err != nil {
		fmt.Println(err.Error())
		siteConfig["name"] = ""
		siteConfig["icp"] = ""
		siteConfig["title"] = ""
		siteConfig["description"] = ""
		siteConfig["keywords"] = ""
		siteConfig["logoURL"] = "/images/logo.png"
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"siteConfig": siteConfig,
			"userCount":  userCount,
			"topicCount": topicCount,
			"replyCount": replyCount,
		},
	})
}
