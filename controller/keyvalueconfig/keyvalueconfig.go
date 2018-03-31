package keyvalueconfig

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/shen100/golang123/controller/common"
	"github.com/shen100/golang123/model"
)

// SetKeyValue 设置key, value
func SetKeyValue(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	type ReqData struct {
		KeyName string `json:"key" binding:"required,min=1"`
		Value   string `json:"value" binding:"required,min=1"`
	}
	var reqData ReqData
	if err := c.ShouldBindJSON(&reqData); err != nil {
		SendErrJSON("参数无效", c)
		return
	}
	var keyVauleConfig model.KeyValueConfig
	if err := model.DB.Where("key_name = ?", reqData.KeyName).Find(&keyVauleConfig).Error; err != nil {
		if err != gorm.ErrRecordNotFound {
			fmt.Println(err.Error())
			SendErrJSON("error", c)
			return
		}
		var theKeyVauleConfig model.KeyValueConfig
		theKeyVauleConfig.KeyName = reqData.KeyName
		theKeyVauleConfig.Value = reqData.Value
		if err := model.DB.Create(&theKeyVauleConfig).Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", c)
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"errNo": model.ErrorCode.SUCCESS,
			"msg":   "success",
			"data": gin.H{
				"id": theKeyVauleConfig.ID,
			},
		})
		return
	}
	keyVauleConfig.Value = reqData.Value
	if err := model.DB.Save(&keyVauleConfig).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", c)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"id": keyVauleConfig.ID,
		},
	})
}
