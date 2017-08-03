package message

import (
	"strconv"
	"gopkg.in/kataras/iris.v6"
	"golang123/config"
	"golang123/model"
	"golang123/controller/common"
)

// Unread 未读消息
func Unread(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	var messages []model.Message

	pageNo, err := strconv.Atoi(ctx.FormValue("pageNo"))
 
	if err != nil || pageNo < 1 {
		pageNo = 1
	}

	pageSize, sizeErr := strconv.Atoi(ctx.FormValue("pageSize"))

	if sizeErr != nil || pageSize < 1 {
		pageSize = 1
	}

	if pageSize > config.ServerConfig.MaxPageSize {
		pageSize = config.ServerConfig.MaxPageSize
	}

	if model.DB.Where("has_read = ?", 0).Order("created_at DESC").
			Offset((pageNo - 1) * pageSize).Limit(pageSize).Find(&messages).Error != nil {
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.StatusOK, iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"messages": messages,
		},
	})
}

// UnreadCount 未读消息数量
func UnreadCount(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	var count int 
	if err := model.DB.Model(&model.Message{}).Where("has_read = ?", 0).Count(&count).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.StatusOK, iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"count": count,
		},
	})
}