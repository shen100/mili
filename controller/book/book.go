package book

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"unicode/utf8"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/shen100/golang123/controller/common"
	"github.com/shen100/golang123/model"
	"github.com/shen100/golang123/utils"
)

// Save 保存图书（创建或更新）
func Save(c *gin.Context, isEdit bool) {
	SendErrJSON := common.SendErrJSON
	var bookData model.Book
	if err := c.ShouldBindJSON(&bookData); err != nil {
		SendErrJSON("参数无效", c)
		return
	}
	bookData.Name = utils.AvoidXSS(bookData.Name)
	bookData.Name = strings.TrimSpace(bookData.Name)

	bookData.Content = strings.TrimSpace(bookData.Content)
	bookData.HTMLContent = strings.TrimSpace(bookData.HTMLContent)

	if bookData.HTMLContent != "" {
		bookData.HTMLContent = utils.AvoidXSS(bookData.HTMLContent)
	}

	if bookData.Name == "" {
		SendErrJSON("图书名称不能为空", c)
		return
	}

	if utf8.RuneCountInString(bookData.Name) > model.MaxNameLen {
		msg := "图书名称不能超过" + strconv.Itoa(model.MaxNameLen) + "个字符"
		SendErrJSON(msg, c)
		return
	}

	var theContent string
	if bookData.ContentType == model.ContentTypeHTML {
		theContent = bookData.HTMLContent
	} else {
		theContent = bookData.Content
	}

	contentCount := utf8.RuneCountInString(theContent)
	if theContent == "" || contentCount <= 0 {
		SendErrJSON("图书简介不能为空", c)
		return
	}

	if contentCount > model.MaxContentLen {
		msg := "图书简介不能超过" + strconv.Itoa(model.MaxContentLen) + "个字符"
		SendErrJSON(msg, c)
		return
	}

	userInter, _ := c.Get("user")
	user := userInter.(model.User)

	var updatedBook model.Book
	if !isEdit {
		//创建图书
		bookData.Status = model.BookVerifying
		bookData.UserID = user.ID
		bookData.ContentType = model.ContentTypeMarkdown
		if err := model.DB.Create(&bookData).Error; err != nil {
			SendErrJSON("error", c)
			return
		}
	} else {
		//更新图书
		if err := model.DB.First(&updatedBook, bookData.ID).Error; err == nil {
			updatedBook.Name = bookData.Name
			updatedBook.CoverURL = bookData.CoverURL
			updatedBook.Content = bookData.Content
			updatedBook.HTMLContent = bookData.HTMLContent
			if err := model.DB.Save(&updatedBook).Error; err != nil {
				fmt.Println(err.Error())
				SendErrJSON("error", c)
				return
			}
		} else {
			SendErrJSON("无效的图书id", c)
			return
		}
	}

	var bookJSON model.Book
	if isEdit {
		bookJSON = updatedBook
	} else {
		bookJSON = bookData
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"book": bookJSON,
		},
	})
}

// Create 创建图书
func Create(c *gin.Context) {
	Save(c, false)
}

// Update 更新图书
func Update(c *gin.Context) {
	Save(c, true)
}

// Info 获取图书信息
func Info(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		SendErrJSON("错误的图书id", c)
		return
	}

	var book model.Book
	if err := model.DB.First(&book, id).Error; err != nil {
		SendErrJSON("错误的图书id", c)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"book": book,
		},
	})
}

// Chapters 获取图书的章节
func Chapters(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	id, err := strconv.Atoi(c.Param("bookID"))
	if err != nil {
		SendErrJSON("错误的图书id", c)
		return
	}
	var chapters []model.BookChapter
	if err := model.DB.Model(&model.BookChapter{}).Where("book_id = ?", id).Order("created_at desc").Find(&chapters).Error; err != nil {
		fmt.Println(err)
		SendErrJSON("error", c)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"chapters": chapters,
		},
	})
}

// CreateChapter 创建图书的章节
func CreateChapter(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	type ReqData struct {
		Name     string `json:"name" binding:"required,min=1,max=100"`
		ParentID uint   `json:"parentID"`
		BookID   uint   `json:"bookID"`
	}
	var reqData ReqData
	if err := c.ShouldBindWith(&reqData, binding.JSON); err != nil {
		fmt.Println(err)
		SendErrJSON("参数无效", c)
		return
	}

	reqData.Name = strings.TrimSpace(reqData.Name)
	if reqData.Name == "" {
		SendErrJSON("章节名称不能为空", c)
		return
	}

	var chapter model.BookChapter
	chapter.Name = reqData.Name
	chapter.ParentID = reqData.ParentID
	chapter.BookID = reqData.BookID
	if chapter.ParentID != model.NoParent {
		var parentChapter model.BookChapter
		if err := model.DB.First(&parentChapter, chapter.ParentID).Error; err != nil {
			SendErrJSON("无效的parentID", c)
			return
		}
	}

	var book model.Book
	if err := model.DB.First(&book, chapter.BookID).Error; err != nil {
		SendErrJSON("无效的bookID", c)
		return
	}

	if err := model.DB.Create(&chapter).Error; err != nil {
		SendErrJSON("error", c)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"chapter": chapter,
		},
	})
}

// DeleteChapter 删除图书的章节
func DeleteChapter(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	id, err := strconv.Atoi(c.Param("chapterID"))
	if err != nil {
		SendErrJSON("错误的章节id", c)
		return
	}
	var sql = "DELETE FROM book_chapters WHERE id = ? OR parent_id = ?"
	if err := model.DB.Exec(sql, id, id).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", c)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"id": id,
		},
	})
}
