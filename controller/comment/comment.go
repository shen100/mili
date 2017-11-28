package comment

import (
	"time"
	"fmt"
	"math"
	"strconv"
	"strings"
	"unicode/utf8"
	"github.com/kataras/iris"
	"github.com/shen100/golang123/controller/common"
	"github.com/shen100/golang123/model"
	"github.com/shen100/golang123/utils"
	"github.com/shen100/golang123/manager"
)

// Save 保存评论（创建或更新）
func Save(ctx iris.Context, isEdit bool) {
	SendErrJSON := common.SendErrJSON
	var comment model.Comment

	// 编辑评论时，只传id, content
	// 创建评论时传
	// {
	//   "sourceID": 1,
	//   "sourceName": "article",
	//   "content": "这是一条评论",
	//	 "parentID": 0
	// }
	if err := ctx.ReadJSON(&comment); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	var article model.Article
	var vote model.Vote

	if !isEdit {
		if comment.SourceName != model.CommentSourceArticle && comment.SourceName != model.CommentSourceVote {
			SendErrJSON("无效的sourceName", ctx)
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

		if comment.ParentID != model.NoParent {
			var parentComment model.Comment
			if err := model.DB.First(&parentComment, comment.ParentID).Error; err != nil {
				SendErrJSON("无效的parentID", ctx)
				return	
			}	
			if parentComment.SourceID != comment.SourceID {
				SendErrJSON("无效的parentID", ctx)
				return	
			}
		}
	}

	comment.Content = strings.TrimSpace(comment.Content)

	if (comment.Content == "") {
		SendErrJSON("回复不能为空", ctx)
		return
	} 
	
	if utf8.RuneCountInString(comment.Content) > model.MaxCommentLen {
		msg := "回复不能超过" + strconv.Itoa(model.MaxCommentLen) + "个字符"
		SendErrJSON(msg, ctx)
		return
	}

	user, _ := manager.Sess.Start(ctx).Get("user").(model.User)

	comment.Status = model.CommentVerifying
	comment.UserID = user.ID

	var updatedComment model.Comment

	if (!isEdit) {
		tx := model.DB.Begin()
		if err := tx.Create(&comment).Error; err != nil {
			tx.Rollback()
			SendErrJSON("error", ctx)
			return	
		}
		
		updateUserMap := map[string]interface{} {
			"comment_count": user.CommentCount + 1,
			"score": user.Score + model.CommentScore,
		}

		if err := tx.Model(&user).Updates(updateUserMap).Error; err != nil {
			tx.Rollback()
			SendErrJSON("error", ctx)
			return
		}
		manager.Sess.Start(ctx).Set("user", user)

		var author model.User
		if comment.SourceName == model.CommentSourceArticle {
			author.ID = article.UserID
			articleMap := map[string]interface{} {
				"comment_count" : article.CommentCount + 1,
				"last_user_id"  : user.ID,
			}
			if err := tx.Model(&article).Updates(articleMap).Error; err != nil {
				tx.Rollback()
				SendErrJSON("error", ctx)
				return
			}
		} else if comment.SourceName == model.CommentSourceVote {
			author.ID = vote.UserID
			voteMap := map[string]interface{} {
				"comment_count" : vote.CommentCount + 1,
				"last_user_id"  : user.ID,
			}
			if err := tx.Model(&vote).Updates(voteMap).Error; err != nil {
				tx.Rollback()
				SendErrJSON("error", ctx)
				return
			}
		}

		// 自己回复自己的话题（或投票）作者积分不增加，因为作者就是自己
		if user.ID != author.ID {
			if err := tx.First(&author, author.ID).Error; err != nil {
				tx.Rollback()
				SendErrJSON("error", ctx)
				return	
			}
			authorScore := author.Score + model.ByCommentScore
			if err := tx.Model(&author).Update("score", authorScore).Error; err != nil {
				tx.Rollback()
				SendErrJSON("error", ctx)
				return
			}
		}
		tx.Commit()
	} else {
		if err := model.DB.First(&updatedComment, comment.ID).Error; err != nil {
			SendErrJSON("无效的id", ctx)
			return
		}
		if user.ID != updatedComment.UserID {
			SendErrJSON("您无权执行此操作", ctx)
			return	
		}
		updateMap := map[string]interface{} {
			"content" : comment.Content,
			"status"  : model.CommentVerifying,
		}
		if err := model.DB.Model(&updatedComment).Updates(updateMap).Error; err != nil {
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
}

// Create 创建评论
func Create(ctx iris.Context) {
	Save(ctx, false)
}

// Update 更新评论
func Update(ctx iris.Context) {
	Save(ctx, true)	
}

// Delete 删除评论
func Delete(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	id, idErr := ctx.Params().GetInt("id")
	if idErr != nil {
		fmt.Println(idErr.Error())
		SendErrJSON("无效的ID", ctx)
		return
	}
	var comment model.Comment
	if err := model.DB.First(&comment, id).Error; err != nil {
		SendErrJSON("无效的ID", ctx)
		return	
	}

	user, _ := manager.Sess.Start(ctx).Get("user").(model.User)

	if comment.UserID != user.ID {
		SendErrJSON("您无权执行此操作", ctx)
		return	
	}

	tx := model.DB.Begin()

	if err := tx.Delete(&comment).Error; err != nil {
		tx.Rollback()
		SendErrJSON("error", ctx)
		return
	}

	if comment.SourceName == model.CommentSourceArticle {
		var article model.Article
		if err := tx.First(&article, comment.SourceID).Error; err != nil {
			tx.Rollback()	
			SendErrJSON("error", ctx)
			return
		}

		if err := tx.Model(&article).Update("comment_count", article.CommentCount - 1).Error; err != nil {
			tx.Rollback()	
			SendErrJSON("error", ctx)
			return
		}
	} else if comment.SourceName == model.CommentSourceVote {
		var vote model.Vote
		if err := tx.First(&vote, comment.SourceID).Error; err != nil {
			tx.Rollback()	
			SendErrJSON("error", ctx)
			return
		}

		if err := tx.Model(&vote).Update("comment_count", vote.CommentCount - 1).Error; err != nil {
			tx.Rollback()	
			SendErrJSON("error", ctx)
			return
		}
	}

	// 删除评论时，用户积分减少，作者积分不变
	userMap := map[string]interface{} {
		"comment_count" : user.CommentCount - 1,
		"score"         : user.Score - model.CommentScore,
	}
	if err := tx.Model(&user).Updates(userMap).Error; err != nil {
		tx.Rollback()	
		SendErrJSON("error", ctx)
		return
	}

	manager.Sess.Start(ctx).Set("user", user)

	tx.Commit()
	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"id": comment.ID,
		},
	})
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
	var pageNo int
	var pageNoErr error
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

	if pageNo, pageNoErr = strconv.Atoi(ctx.FormValue("pageNo")); pageNoErr != nil {
		pageNo    = 1
		pageNoErr = nil
	}
	if pageNo < 1 {
		pageNo = 1
	}

	if pageSize, pageSizeErr = strconv.Atoi(ctx.FormValue("pageSize")); pageSizeErr != nil {
		SendErrJSON("无效的pageSize", ctx)
		return	
	}

	if pageSize < 1 || pageSize > model.MaxPageSize {
		SendErrJSON("无效的pageSize", ctx)
		return	
	}

	offset   := (pageNo - 1) * pageSize

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
	if err := model.DB.Where("user_id = ?", user.ID).Order(orderStr).Offset(offset).Limit(pageSize).Find(&comments).Error; err != nil {
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
		data["content"] = utils.MarkdownToHTML(comments[i].Content)
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

// SourceComments 查询话题或投票的评论
func SourceComments(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	sourceName  := ctx.Params().Get("sourceName")
	if sourceName != model.CommentSourceArticle && sourceName != model.CommentSourceVote {
		SendErrJSON("无效的sourceName", ctx)
		return	
	}

	sourceID, sourceIDErr := ctx.Params().GetInt("sourceID")

	if sourceIDErr != nil {
		SendErrJSON("无效的sourceID", ctx)
		return	
	}
	
	var article model.Article
	var vote model.Vote

	if sourceName == model.CommentSourceArticle {
		if err := model.DB.First(&article, sourceID).Error; err != nil {
			SendErrJSON("无效的sourceID", ctx)
			return	
		}
	}

	if sourceName == model.CommentSourceVote {
		if err := model.DB.First(&vote, sourceID).Error; err != nil {
			SendErrJSON("无效的sourceID", ctx)
			return	
		}
	}

	var comments []model.Comment
	if err := model.DB.Where("source_id = ?", sourceID).Preload("User").Find(&comments).Error; err != nil {
		SendErrJSON("error", ctx)
		return	
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"comments": comments,
		},
	})
}

// Comments 查询评论列表
func Comments(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var startTime string
	var endTime string

	if startAt, err := strconv.Atoi(ctx.FormValue("startAt")); err != nil {
		startTime = time.Unix(0, 0).Format("2006-01-02 15:04:05")
	} else {
		startTime = time.Unix(int64(startAt / 1000), 0).Format("2006-01-02 15:04:05")
	}

	if endAt, err := strconv.Atoi(ctx.FormValue("endAt")); err != nil {
		endTime = time.Now().Format("2006-01-02 15:04:05")
	} else {
		endTime = time.Unix(int64(endAt / 1000), 0).Format("2006-01-02 15:04:05")
	}

	var comments []model.Comment
	var pageNo int
	var pageNoErr error
	if pageNo, pageNoErr = strconv.Atoi(ctx.FormValue("pageNo")); pageNoErr != nil {
		pageNo = 1
	}
	if pageNo < 1 {
		pageNo = 1
	}
	pageSize := 20
	offset   := (pageNo - 1) * pageSize

	if err := model.DB.Where("created_at >= ? AND created_at < ?", startTime, endTime).Offset(offset).
			Limit(pageSize).Order("created_at DESC").Find(&comments).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return	
	}
	var count int
	if err := model.DB.Model(&model.Comment{}).Where("created_at >= ? AND created_at < ?", startTime, endTime).Count(&count).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error.", ctx)
		return	
	}
	for i := 0; i < len(comments); i++ {
		if err := model.DB.Model(&comments[i]).Related(&comments[i].User, "users").Error; err != nil {
			SendErrJSON("error!", ctx)
			return	
		}
		comments[i].Content = utils.MarkdownToHTML(comments[i].Content)
	}
	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"comments": comments,
			"pageNo": pageNo,
			"pageSize": pageSize,
			"totalPage": int(math.Ceil(float64(count) / float64(pageSize))),
			"totalCount": count,
		},
	})
}

// UpdateStatus 更新评论状态
func UpdateStatus(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var reqData model.Comment
	var commentID int
	var idErr error

	if commentID, idErr = ctx.Params().GetInt("id"); idErr != nil {
		SendErrJSON("无效的id", ctx)
		return
	}

	if err := ctx.ReadJSON(&reqData); err != nil {
		SendErrJSON("无效的status", ctx)
		return
	}
	
	status := reqData.Status

	var comment model.Comment
	if err := model.DB.First(&comment, commentID).Error; err != nil {
		SendErrJSON("无效的id", ctx)
		return
	}
	
	if status != model.CommentVerifySuccess && status != model.CommentVerifying && status != model.CommentVerifyFail {
		SendErrJSON("无效的状态", ctx)
		return
	}

	comment.Status = status

	if err := model.DB.Model(&comment).Update("status", status).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"id"     : comment.ID,
			"status" : comment.Status,
		},
	})
}
