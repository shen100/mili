package message

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/shen100/golang123/controller/common"
	"github.com/shen100/golang123/model"
	"github.com/shen100/golang123/utils"
)

// Unread 未读消息
func Unread(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var messages []model.Message

	pageNo, err := strconv.Atoi(c.Query("pageNo"))

	if err != nil || pageNo < 1 {
		pageNo = 1
	}

	pageSize, sizeErr := strconv.Atoi(c.Query("pageSize"))

	if sizeErr != nil || pageSize < 1 {
		pageSize = 10
	}

	if pageSize > model.MaxPageSize {
		pageSize = model.MaxPageSize
	}

	iuser, _ := c.Get("user")
	user := iuser.(model.User)

	if model.DB.Where("readed = ? AND to_user_id = ?", 0, user.ID).Order("created_at ASC").
		Offset((pageNo-1)*pageSize).Limit(pageSize).Find(&messages).Error != nil {
		SendErrJSON("error", c)
		return
	}
	var count int
	if err := model.DB.Model(&model.Message{}).Where("readed = ? AND to_user_id = ?", 0, user.ID).Count(&count).Error; err != nil {
		SendErrJSON("error", c)
		return
	}
	for i := 0; i < len(messages); i++ {
		if err := model.DB.Model(&messages[i]).Related(&messages[i].FromUser, "users", "from_user_id").Error; err != nil {
			SendErrJSON("error", c)
			return
		}
		if messages[i].Type == model.MessageTypeCommentArticle {
			var article model.Article
			if err := model.DB.Select("name").Where("id = ?", messages[i].SourceID).First(&article).Error; err != nil {
				SendErrJSON("error", c)
				return
			}
			messages[i].Data.Title = article.Name
		} else if messages[i].Type == model.MessageTypeCommentVote {
			var vote model.Vote
			if err := model.DB.Select("name").Where("id = ?", messages[i].SourceID).First(&vote).Error; err != nil {
				SendErrJSON("error", c)
				return
			}
			messages[i].Data.Title = vote.Name
		} else if messages[i].Type == model.MessageTypeCommentComment {
			var comment model.Comment
			if err := model.DB.Select("content_type, content, html_content").Where("id = ?", messages[i].CommentID).
				First(&comment).Error; err != nil {
				SendErrJSON("error", c)
				return
			}
			var commentContent string
			if comment.ContentType == model.ContentTypeMarkdown {
				commentContent = utils.MarkdownToHTML(comment.Content)
			} else {
				commentContent = utils.AvoidXSS(comment.HTMLContent)
			}
			messages[i].Data.CommentContent = commentContent
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"messages": messages,
			"pageNo":   pageNo,
			"pageSize": pageSize,
			"count":    count,
		},
	})
}

// UnreadCount 未读消息数量
func UnreadCount(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var count int
	if err := model.DB.Model(&model.Message{}).Where("readed = ?", 0).Count(&count).Error; err != nil {
		SendErrJSON("error", c)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"count": count,
		},
	})
}
