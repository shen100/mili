package category

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"unicode/utf8"

	"github.com/gin-gonic/gin"
	"github.com/microcosm-cc/bluemonday"
	"github.com/shen100/golang123/controller/common"
	"github.com/shen100/golang123/model"
)

// SaveBookCategory 保存图书分类（创建或更新）
func SaveBookCategory(c *gin.Context, isEdit bool) {
	SendErrJSON := common.SendErrJSON

	minOrder := model.MinOrder
	maxOrder := model.MaxOrder

	var category model.BookCategory
	if err := c.ShouldBindJSON(&category); err != nil {
		SendErrJSON("参数无效", c)
		return
	}

	category.Name = bluemonday.UGCPolicy().Sanitize(category.Name)
	category.Name = strings.TrimSpace(category.Name)

	if category.Name == "" {
		SendErrJSON("分类名称不能为空", c)
		return
	}

	if utf8.RuneCountInString(category.Name) > model.MaxNameLen {
		msg := "分类名称不能超过" + strconv.Itoa(model.MaxNameLen) + "个字符"
		SendErrJSON(msg, c)
		return
	}

	if category.Sequence < minOrder || category.Sequence > maxOrder {
		msg := "分类的排序要在" + strconv.Itoa(minOrder) + "到" + strconv.Itoa(maxOrder) + "之间"
		SendErrJSON(msg, c)
		return
	}

	if category.ParentID != 0 {
		var parentCate model.BookCategory
		if err := model.DB.First(&parentCate, category.ParentID).Error; err != nil {
			SendErrJSON("无效的父分类", c)
			return
		}
	}

	var updatedCategory model.BookCategory
	if !isEdit {
		//创建分类
		if err := model.DB.Create(&category).Error; err != nil {
			SendErrJSON("error", c)
			return
		}
	} else {
		//更新分类
		if err := model.DB.First(&updatedCategory, category.ID).Error; err == nil {
			updateMap := make(map[string]interface{})
			updateMap["name"] = category.Name
			updateMap["sequence"] = category.Sequence
			updateMap["parent_id"] = category.ParentID
			if err := model.DB.Model(&updatedCategory).Updates(updateMap).Error; err != nil {
				fmt.Println(err.Error())
				SendErrJSON("error", c)
				return
			}
		} else {
			SendErrJSON("无效的分类id", c)
			return
		}
	}

	var categoryJSON model.BookCategory
	if isEdit {
		categoryJSON = updatedCategory
	} else {
		categoryJSON = category
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"category": categoryJSON,
		},
	})
}

// CreateBookCategory 创建图书分类
func CreateBookCategory(c *gin.Context) {
	SaveBookCategory(c, false)
}

// UpdateBookCategory 更新图书分类
func UpdateBookCategory(c *gin.Context) {
	SaveBookCategory(c, true)
}

// BookCategoryList 图书分类列表
func BookCategoryList(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var categories []model.BookCategory

	if model.DB.Order("sequence asc").Find(&categories).Error != nil {
		SendErrJSON("error", c)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"categories": categories,
		},
	})
}
