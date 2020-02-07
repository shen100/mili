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

	var keyvalueconfig model.KeyValueConfig
	siteConfig := make(map[string]interface{})
	siteConfig["name"] = ""
	siteConfig["icp"] = ""
	siteConfig["title"] = ""
	siteConfig["description"] = ""
	siteConfig["keywords"] = ""
	siteConfig["logoURL"] = "/images/logo.png"
	siteConfig["bdStatsID"] = ""
	siteConfig["luosimaoSiteKey"] = ""
	if err := model.DB.Where("key_name = \"site_config\"").Find(&keyvalueconfig).Error; err != nil {
		fmt.Println(err.Error())
	}
	if err := json.Unmarshal([]byte(keyvalueconfig.Value), &siteConfig); err != nil {
		fmt.Println(err.Error())
	}

	var baiduAdKeyValue model.KeyValueConfig
	baiduAdConfig := make(map[string]interface{})
	baiduAdConfig["banner760x90"] = ""
	baiduAdConfig["banner2_760x90"] = ""
	baiduAdConfig["banner3_760x90"] = ""
	baiduAdConfig["ad250x250"] = ""
	baiduAdConfig["ad120x90"] = ""
	baiduAdConfig["ad20_3"] = ""
	baiduAdConfig["ad20_3A"] = ""
	baiduAdConfig["allowBaiduAd"] = false

	if err := model.DB.Where("key_name = \"baidu_ad_config\"").Find(&baiduAdKeyValue).Error; err != nil {
		fmt.Println(err.Error())
	}
	if err := json.Unmarshal([]byte(baiduAdKeyValue.Value), &baiduAdConfig); err != nil {
		fmt.Println(err.Error())
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"siteConfig":    siteConfig,
			"baiduAdConfig": baiduAdConfig,
			"userCount":     userCount,
			"topicCount":    topicCount,
			"replyCount":    replyCount,
		},
	})
}
