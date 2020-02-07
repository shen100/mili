package common

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shen100/golang123/model"
)

// SendErrJSON 有错误发生时，发送错误JSON
func SendErrJSON(msg string, args ...interface{}) {
	if len(args) == 0 {
		panic("缺少 *gin.Context")
	}
	var c *gin.Context
	var errNo = model.ErrorCode.ERROR
	if len(args) == 1 {
		theCtx, ok := args[0].(*gin.Context)
		if !ok {
			panic("缺少 *gin.Context")
		}
		c = theCtx
	} else if len(args) == 2 {
		theErrNo, ok := args[0].(int)
		if !ok {
			panic("errNo不正确")
		}
		errNo = theErrNo
		theCtx, ok := args[1].(*gin.Context)
		if !ok {
			panic("缺少 *gin.Context")
		}
		c = theCtx
	}
	c.JSON(http.StatusOK, gin.H{
		"errNo": errNo,
		"msg":   msg,
		"data":  gin.H{},
	})
	// 终止请求链
	c.Abort()
}
