package category

import (
	"fmt"
	"unicode/utf8"
	"strings"
	"strconv"
	"github.com/kataras/iris"
	"github.com/microcosm-cc/bluemonday"
	"github.com/shen100/golang123/model"
	"github.com/shen100/golang123/controller/common"
)

// Save 保存分类（创建或更新）
func Save(isEdit bool, ctx iris.Context) {
	SendErrJSON := common.SendErrJSON

	minOrder := model.MinOrder
	maxOrder := model.MaxOrder

	var category model.Category
	if err := ctx.ReadJSON(&category); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	category.Name = bluemonday.UGCPolicy().Sanitize(category.Name)
	category.Name = strings.TrimSpace(category.Name)

	if (category.Name == "") {
		SendErrJSON("分类名称不能为空", ctx)
		return
	} 
	
	if utf8.RuneCountInString(category.Name) > model.MaxNameLen {
		msg := "分类名称不能超过" + strconv.Itoa(model.MaxNameLen) + "个字符"
		SendErrJSON(msg, ctx)
		return
	}
	
	if category.Sequence < minOrder || category.Sequence > maxOrder {
		msg := "分类的排序要在" + strconv.Itoa(minOrder) + "到" + strconv.Itoa(maxOrder) + "之间"
		SendErrJSON(msg, ctx)
		return
	}

	if category.ParentID != 0 {
		var parentCate model.Category
		if err := model.DB.First(&parentCate, category.ParentID).Error; err != nil {
			SendErrJSON("无效的父分类", ctx)
			return
		}
	}

	var updatedCategory model.Category
	if (!isEdit) {
		//创建分类
		if err := model.DB.Create(&category).Error; err != nil {
			SendErrJSON("error", ctx)
			return	
		}
	} else {
		//更新分类
		if err := model.DB.First(&updatedCategory, category.ID).Error; err == nil {
			updateMap := make(map[string]interface{})
			updateMap["name"]      = category.Name
			updateMap["sequence"]  = category.Sequence
			updateMap["parent_id"] = category.ParentID
			if err := model.DB.Model(&updatedCategory).Updates(updateMap).Error; err != nil {
				fmt.Println(err.Error())
				SendErrJSON("error", ctx)
				return
			}
		} else {
			SendErrJSON("无效的分类id", ctx)
			return
		}
	}

	var categoryJSON model.Category
	if isEdit {
		categoryJSON = updatedCategory
	} else {
		categoryJSON = category	
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"category": categoryJSON,
		},
	})
}

// Create 创建分类
func Create(ctx iris.Context) {
	Save(false, ctx)
}

// Update 更新分类
func Update(ctx iris.Context) {
	Save(true, ctx)	
}

// Info 获取分类信息
func Info(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	id, err := ctx.Params().GetInt("id")
	if err != nil {
		SendErrJSON("错误的分类id", ctx)
		return
	}

	var category model.Category
	if err := model.DB.First(&category, id).Error; err != nil {
		SendErrJSON("错误的分类id", ctx)
		return
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"category": category,
		},
	})
}

// List 分类列表
func List(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var categories []model.Category

	if model.DB.Order("sequence asc").Find(&categories).Error != nil {
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"categories": categories,
		},
	})
}
