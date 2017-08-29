package comment

import (
	"fmt"
	"strconv"
	"strings"
	"unicode/utf8"
	"github.com/kataras/iris"
	"golang123/controller/common"
	"golang123/model"
	"golang123/sessmanager"
	"golang123/config"
)

// Save 保存评论（创建或更新）
func Save(isEdit bool, ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var comment model.Comment

	if err := ctx.ReadJSON(&comment); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	var article model.Article
	var vote model.Vote

	if comment.SourceName != model.CommentSourceArticle && comment.SourceName != model.CommentSourceVote {
		SendErrJSON("sourceName无效", ctx)
		return
	}

	if comment.SourceName == model.CommentSourceArticle {
		if err := model.DB.First(&article, comment.SourceID).Error; err != nil {
			SendErrJSON("无效的sourceID", ctx)
			return	
		}
	}

	if comment.SourceName == model.CommentSourceVote {
		if err := model.DB.First(&vote, comment.SourceID).Error; err != nil {
			SendErrJSON("无效的sourceID", ctx)
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

	user, _ := sessmanager.Sess.Start(ctx).Get("user").(model.User)

	comment.Status = model.CommentVerifying
	comment.UserID = user.ID

	var updatedComment model.Comment

	if (!isEdit) {
		if err := model.DB.Create(&comment).Error; err != nil {
			SendErrJSON("error", ctx)
			return	
		}

		if err := model.DB.Model(&user).Update("comment_count", user.CommentCount + 1).Error; err != nil {
			SendErrJSON("error", ctx)
			return
		}
		sessmanager.Sess.Start(ctx).Set("user", user)

		var author model.User
		if comment.SourceName == model.CommentSourceArticle {
			author.ID = article.UserID
			article.CommentCount++
			article.LastUserID = user.ID
			if err := model.DB.Save(&article).Error; err != nil {
				SendErrJSON("error", ctx)
				return
			}
		} else if comment.SourceName == model.CommentSourceVote {
			author.ID = vote.UserID
			vote.CommentCount++
			vote.LastUserID = user.ID
			if err := model.DB.Save(&vote).Error; err != nil {
				SendErrJSON("error", ctx)
				return
			}
		}

		if err := model.DB.First(&author, author.ID).Error; err != nil {
			SendErrJSON("error", ctx)
			return	
		}
		authorScore := author.Score + config.UserConfig.CreateCommentScore
		if err := model.DB.Model(&author).Update("score", authorScore).Error; err != nil {
			SendErrJSON("error", ctx)
			return
		}
	
	} else {
		if err := model.DB.First(&updatedComment, comment.ID).Error; err != nil {
			SendErrJSON("无效的评论id", ctx)
			return
		}
		updatedComment.Content = comment.Content
		updatedComment.Status  = model.CommentVerifying
		if err := model.DB.Save(&updatedComment).Error; err != nil {
			SendErrJSON("error", ctx)
			return
		}
	}

	var commentJSON model.Comment
	if isEdit {
		commentJSON = updatedComment
	} else {
		commentJSON = comment	
	}
	commentJSON.User = user

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"comment": commentJSON,
		},
	})
	return
}

// Create 创建评论
func Create(ctx iris.Context) {
	Save(false, ctx)
}

// Update 更新评论
func Update(ctx iris.Context) {
	Save(true, ctx)	
}

// UserCommentList 查询用户的评论
func UserCommentList(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var userID int
	var userIDErr error
	var orderType int
	var orderTypeErr error
	var orderStr string
	var isDESC int
	var descErr error
	var pageSize int
	var pageSizeErr error

	if userID, userIDErr = ctx.Params().GetInt("userID"); userIDErr != nil {
		SendErrJSON("无效的userID", ctx)
		return	
	}
	var user model.User
	if err := model.DB.First(&user, userID).Error; err != nil {
		SendErrJSON("无效的userID", ctx)
		return	
	}

	if orderType, orderTypeErr = strconv.Atoi(ctx.FormValue("orderType")); orderTypeErr != nil {
		SendErrJSON("无效的orderType", ctx)
		return	
	}

	// 1: 按日期排序 2: 按赞同数排序(即评论被点赞)
	if orderType != 1 && orderType != 2 {
		SendErrJSON("无效的orderType", ctx)
		return	
	}

	if isDESC, descErr = strconv.Atoi(ctx.FormValue("desc")); descErr != nil {
		SendErrJSON("无效的desc", ctx)
		return	
	}

	if isDESC != 0 && isDESC != 1 {
		SendErrJSON("无效的desc", ctx)
		return	
	}

	if pageSize, pageSizeErr = strconv.Atoi(ctx.FormValue("pageSize")); pageSizeErr != nil {
		SendErrJSON("无效的pageSize", ctx)
		return	
	}

	if pageSize < 1 || pageSize > config.ServerConfig.MaxPageSize {
		SendErrJSON("无效的pageSize", ctx)
		return	
	}

	if orderType == 1 {
		orderStr = "created_at"
	} else if orderType == 2 {
		orderStr = "up_count" // 按赞同数排序	
	}

	if isDESC == 1 {
		orderStr += " DESC"
	} else {
		orderStr += " ASC"
	}

	var comments []model.Comment
	if err := model.DB.Where("user_id = ?", user.ID).Order(orderStr).Limit(pageSize).Find(&comments).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}

	var results []map[string]interface{}
	for i := 0; i < len(comments); i++ {
		data := make(map[string]interface{})
		var article model.Article
		var vote model.Vote
		data["id"]      = comments[i].ID
		data["content"] = comments[i].Content
		if (comments[i].SourceName == model.CommentSourceArticle) {
			if err := model.DB.Model(&comments[i]).Related(&article, "articles", "source_id").Error; err != nil {
				fmt.Println(err.Error())
				SendErrJSON("error", ctx)
				return
			}
			data["articleID"]   = article.ID
			data["articleName"] = article.Name
		} else if (comments[i].SourceName == model.CommentSourceVote) {
			if err := model.DB.Model(&comments[i]).Related(&vote, "votes", "source_id").Error; err != nil {
				fmt.Println(err.Error())
				SendErrJSON("error", ctx)
				return
			}
			data["voteID"]   = vote.ID
			data["voteName"] = vote.Name
		}
		results = append(results, data)
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"comments": results,
		},
	})
}