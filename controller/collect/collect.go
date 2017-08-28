package collect

import (
	"fmt"
	"strconv"
	"github.com/kataras/iris"
	"golang123/config"
	"golang123/model"
	"golang123/sessmanager"
	"golang123/controller/common"
)

// Collect 收藏文章
func Collect(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var collect model.Collect
	if err := ctx.ReadJSON(&collect); err != nil {
		fmt.Println(err.Error())
		SendErrJSON("参数无效", ctx)
		return
	}
	var article model.Article
	if err := model.DB.First(&article, collect.ArticleID).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("错误的文章id", ctx)
		return
	}

	user, _ := sessmanager.Sess.Start(ctx).Get("user").(model.User)

	if err := model.DB.First(&user, user.ID).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}

	collect.UserID = user.ID
	if err := model.DB.Save(&collect).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}

	user.CollectCount++
	if err := model.DB.Save(&user).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{},
	})
}

// DeleteCollect 删除收藏
func DeleteCollect(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var collect model.Collect
	if err := ctx.ReadJSON(&collect); err != nil {
		fmt.Println(err.Error())
		SendErrJSON("参数无效", ctx)
		return
	}
	if (collect.ID <= 0) {
		SendErrJSON("无效的id", ctx)
		return
	}
	if err := model.DB.First(&collect, collect.ID).Error; err != nil {
		SendErrJSON("无效的id", ctx)
		return
	}
	if err := model.DB.Delete(&collect).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return	
	}

	user, _ := sessmanager.Sess.Start(ctx).Get("user").(model.User)

	if err := model.DB.First(&user, user.ID).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}
	user.CollectCount--
	if err := model.DB.Save(&user).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{},
	})
}

// List 查询用户已收藏的文章
func List(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var collects []model.Collect
	var pageNo int
	var err error

	if pageNo, err = strconv.Atoi(ctx.FormValue("pageNo")); err != nil {
		pageNo = 1
		err    = nil
	}
 
	if pageNo < 1 {
		pageNo = 1
	}

	offset   := (pageNo - 1) * config.ServerConfig.PageSize
	pageSize := config.ServerConfig.PageSize

	//默认按收藏时间，降序来排序
	var orderField = "created_at"
	var orderASC   = "DESC"
	if ctx.FormValue("asc") == "1" {
		orderASC = "ASC"
	} else {
		orderASC = "DESC"	
	}

	orderStr := orderField + " " + orderASC

	err = model.DB.Offset(offset).Limit(pageSize).Order(orderStr).Find(&collects).Error

	if err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}
	for i := 0; i < len(collects); i++ {
		if err = model.DB.Model(&collects[i]).Related(&collects[i].Article, "articles").Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", ctx)
			return
		}
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"collects": collects,
		},
	})
}

