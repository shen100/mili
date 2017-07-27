package timeline

import (
	"gopkg.in/kataras/iris.v6"
	"golang123/controller/common"
	"golang123/model"
)

// List 时间轴
func List(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	var timeline []model.TimelineItem

	if model.DB.Order("created_at DESC").Find(&timeline).Error != nil {
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.StatusOK, iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"timeline": timeline,
		},
	})
}