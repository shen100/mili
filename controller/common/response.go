package common

import (
	"gopkg.in/kataras/iris.v6"
	"golang123/model"
)

// SendErrJSON 有错误发生时，发送错误JSON
func SendErrJSON(msg string, ctx *iris.Context) {
	ctx.JSON(iris.StatusOK, iris.Map{
		"errNo" : model.ErrorCode.ERROR,
		"msg"   : msg,
		"data"  : iris.Map{},
	})
}