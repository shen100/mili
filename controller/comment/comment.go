package comment

import (
	"strconv"
	"strings"
	"unicode/utf8"
	"gopkg.in/kataras/iris.v6"
	"golang123/controller/common"
	"golang123/model"
	"golang123/config"
)

// Save 保存评论（创建或更新）
func Save(isEdit bool, ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	var comment model.Comment

	if err := ctx.ReadJSON(&comment); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	if comment.ArticleID != 0 {
		var article model.Article
		if err := model.DB.First(&article, comment.ArticleID).Error; err != nil {
			SendErrJSON("无效的articleID", ctx)
			return	
		}
	}

	if comment.ParentID != 0 {
		var parentComment model.Comment
		if err := model.DB.First(&parentComment, comment.ParentID).Error; err != nil {
			SendErrJSON("无效的parentID", ctx)
			return	
		}	
	}

	comment.Content = strings.TrimSpace(comment.Content)

	if (comment.Content == "") {
		SendErrJSON("评论不能为空", ctx)
		return
	} 
	
	if utf8.RuneCountInString(comment.Content) > config.ServerConfig.MaxCommentLen {
		msg := "评论不能超过" + strconv.Itoa(config.ServerConfig.MaxCommentLen) + "个字符"
		SendErrJSON(msg, ctx)
		return
	}

	session   := ctx.Session();
	user      := session.Get("user").(model.User)

	comment.Status = model.CommentVerifying
	comment.UserID = user.ID

	var updatedComment model.Comment

	if (!isEdit) {
		if err := model.DB.Create(&comment).Error; err != nil {
			SendErrJSON("error", ctx)
			return	
		}
	} else {
		if err := model.DB.First(&updatedComment, comment.ID).Error; err == nil {
			updatedComment.Content = comment.Content
			updatedComment.Status  = model.CommentVerifying
			if err := model.DB.Save(&updatedComment).Error; err != nil {
				SendErrJSON("error", ctx)
				return
			}
		} else {
			SendErrJSON("无效的评论id", ctx)
			return
		}
	}

	var commentJSON model.Comment
	if isEdit {
		commentJSON = updatedComment
	} else {
		commentJSON = comment	
	}
	commentJSON.User = user.ToUser()

	ctx.JSON(iris.StatusOK, iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"comment": commentJSON,
		},
	})
	return
}

// Create 创建评论
func Create(ctx *iris.Context) {
	Save(false, ctx)
}

// Update 更新评论
func Update(ctx *iris.Context) {
	Save(true, ctx)	
}