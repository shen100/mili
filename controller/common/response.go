package common

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/shen100/golang123/model"
)

// SendErrJSON 有错误发生时，发送错误JSON
func SendErrJSON(msg string, args ...interface{}) {
	if len(args) == 0 {
		panic("缺少 iris.Context")
	}
	var c *gin.Context
	var errNo = model.ErrorCode.ERROR
	if len(args) == 1 {
		theCtx, ok := args[0].(*gin.Context)
		if !ok {
			fmt.Println(msg, "需要msg和ctx")
			return
		}
		c = theCtx
	} else if len(args) == 2 {
		theErrNo, ok := args[0].(int)
		if !ok {
			fmt.Println(msg, "需要msg, errNo和ctx")
			return
		}
		errNo = theErrNo
		theCtx, ok := args[1].(*gin.Context)
		if !ok {
			fmt.Println(msg, "需要msg, errNo和ctx")
			return
		}
		c = theCtx
	}
	c.JSON(200, gin.H{
		"errNo": errNo,
		"msg":   msg,
		"data":  gin.H{},
	})
}
