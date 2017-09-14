package common

import (
	"fmt"
	"github.com/kataras/iris"
	"github.com/shen100/golang123/model"
)

// SendErrJSON 有错误发生时，发送错误JSON
func SendErrJSON(msg string, args ...interface{}) {
	if len(args) == 0 {
		panic("缺少 iris.Context")
	}
	var ctx iris.Context
	var errNo = model.ErrorCode.ERROR
	if len(args) == 1 {
		theCtx, ok := args[0].(iris.Context)
		if !ok {
			fmt.Println(msg, "需要msg和ctx")
			return
		}
		ctx = theCtx
	} else if len(args) == 2 {
		theErrNo, ok := args[0].(int)	
		if !ok {
			fmt.Println(msg, "需要msg, errNo和ctx")
			return
		}
		errNo = theErrNo
		theCtx, ok := args[1].(iris.Context)
		if !ok {
			fmt.Println(msg, "需要msg, errNo和ctx")
			return
		}
		ctx = theCtx
	}
	ctx.JSON(iris.Map{
		"errNo" : errNo,
		"msg"   : msg,
		"data"  : iris.Map{},
	})
}