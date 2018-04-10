package stats

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/globalsign/mgo/bson"

	"github.com/gin-gonic/gin"
	"github.com/shen100/golang123/controller/common"
	"github.com/shen100/golang123/model"
)

// PV 增加一次页面访问
func PV(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var err error
	var userVisit model.UserVisit
	userVisit.ID = bson.NewObjectId()
	userVisit.Platform = c.Query("platform")
	userVisit.ClientID = c.Query("clientId")
	userVisit.OSName = c.Query("osName")
	userVisit.OSVersion = c.Query("osVersion")
	userVisit.Language = c.Query("language")
	userVisit.Country = c.Query("country")
	userVisit.DeviceModel = c.Query("deviceModel")
	userVisit.DeviceWidth, err = strconv.Atoi(c.Query("deviceWidth"))
	if err != nil {
		SendErrJSON("无效的deviceWidth", c)
		return
	}
	userVisit.DeviceHeight, err = strconv.Atoi(c.Query("deviceHeight"))
	if err != nil {
		SendErrJSON("无效的deviceHeight", c)
		return
	}
	userVisit.IP = c.ClientIP()
	userVisit.Date = time.Now()
	userVisit.Referrer = c.Query("referrer")
	userVisit.URL = c.Query("url")
	userVisit.BrowserName = c.Query("browserName")
	userVisit.BrowserVersion = c.Query("browserVersion")

	if userVisit.ClientID == "" {
		SendErrJSON("clientId不能为空", c)
		return
	}

	if err := model.MongoDB.C("userVisit").Insert(&userVisit); err != nil {
		fmt.Println(err)
		SendErrJSON("error.", c)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data":  gin.H{},
	})
}
