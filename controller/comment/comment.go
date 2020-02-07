package comment

import (
	"fmt"
	"math"
	"net/http"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/garyburd/redigo/redis"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/shen100/golang123/controller/common"
	"github.com/shen100/golang123/model"
	"github.com/shen100/golang123/utils"
)

// Save 保存评论（创建或更新）
func Save(c *gin.Context, isEdit bool) {
	SendErrJSON := common.SendErrJSON
	var comment model.Comment
	var parentComment model.Comment

	iuser, _ := c.Get("user")
	user := iuser.(model.User)

	if user.Role == model.UserRoleCrawler {
		SendErrJSON("爬虫管理员不能回复", c)
		return
	}

	// 编辑评论时，只传id, content
	// 创建评论时传
	// {
	//   "sourceID": 1, (文章ID或投票ID)
	//   "sourceName": "article",
	//   "content": "这是一条评论",
	//	 "parentID": 0
	// }
	if err := c.ShouldBindJSON(&comment); err != nil {
		SendErrJSON("参数无效", c)
		return
	}

	var article model.Article
	var vote model.Vote

	if !isEdit {
		if comment.SourceName != model.CommentSourceArticle && comment.SourceName != model.CommentSourceVote {
			SendErrJSON("无效的sourceName", c)
			return
		}

		if comment.SourceName == model.CommentSourceArticle {
			if err := model.DB.First(&article, comment.SourceID).Error; err != nil {
				SendErrJSON("无效的sourceID", c)
				return
			}
		}

		if comment.SourceName == model.CommentSourceVote {
			if err := model.DB.First(&vote, comment.SourceID).Error; err != nil {
				SendErrJSON("无效的sourceID", c)
				return
			}
		}

		if comment.ParentID != model.NoParent {
			if err := model.DB.First(&parentComment, comment.ParentID).Error; err != nil {
				SendErrJSON("无效的parentID", c)
				return
			}
			if parentComment.SourceID != comment.SourceID {
				SendErrJSON("无效的parentID", c)
				return
			}
		}
	}

	comment.Content = strings.TrimSpace(comment.Content)

	if comment.Content == "" {
		SendErrJSON("回复不能为空", c)
		return
	}

	if utf8.RuneCountInString(comment.Content) > model.MaxCommentLen {
		msg := "回复不能超过" + strconv.Itoa(model.MaxCommentLen) + "个字符"
		SendErrJSON(msg, c)
		return
	}

	comment.Status = model.CommentVerifying
	comment.UserID = user.ID

	var updatedComment model.Comment

	if !isEdit {
		comment.ContentType = model.ContentTypeMarkdown
		tx := model.DB.Begin()
		if err := tx.Create(&comment).Error; err != nil {
			fmt.Println(err)
			tx.Rollback()
			SendErrJSON("error", c)
			return
		}

		updateUserMap := map[string]interface{}{
			"comment_count": user.CommentCount + 1,
			"score":         user.Score + model.CommentScore,
		}

		if err := tx.Model(&user).Updates(updateUserMap).Error; err != nil {
			tx.Rollback()
			fmt.Println(err)
			SendErrJSON("error", c)
			return
		}

		if err := model.UserToRedis(user); err != nil {
			fmt.Println(err)
			SendErrJSON("error", c)
			return
		}

		var author model.User
		if comment.SourceName == model.CommentSourceArticle {
			author.ID = article.UserID
			articleMap := map[string]interface{}{
				"comment_count":   article.CommentCount + 1,
				"last_user_id":    user.ID,
				"last_comment_at": time.Now(),
			}
			if err := tx.Model(&article).Updates(articleMap).Error; err != nil {
				tx.Rollback()
				fmt.Println(err)
				SendErrJSON("error", c)
				return
			}
		} else if comment.SourceName == model.CommentSourceVote {
			author.ID = vote.UserID
			voteMap := map[string]interface{}{
				"comment_count":   vote.CommentCount + 1,
				"last_user_id":    user.ID,
				"last_comment_at": time.Now(),
			}
			if err := tx.Model(&vote).Updates(voteMap).Error; err != nil {
				tx.Rollback()
				fmt.Println(err)
				SendErrJSON("error", c)
				return
			}
		}

		// 自己回复自己的话题（或投票）作者积分不增加，因为作者就是自己
		if user.ID != author.ID {
			if err := tx.First(&author, author.ID).Error; err != nil {
				tx.Rollback()
				fmt.Println(err)
				SendErrJSON("error", c)
				return
			}
			authorScore := author.Score + model.ByCommentScore
			if err := tx.Model(&author).Update("score", authorScore).Error; err != nil {
				tx.Rollback()
				fmt.Println(err)
				SendErrJSON("error", c)
				return
			}
		}

		// 回复别人的话题或投票时，给消息提醒
		// 进回复进行回复，即使回复属于的话题或投票是自己创建的，也给父回复的用户发消息
		if user.ID != author.ID || comment.ParentID != model.NoParent {
			var message model.Message
			message.FromUserID = user.ID
			message.SourceID = comment.SourceID
			message.SourceName = comment.SourceName
			message.CommentID = comment.ID
			message.Readed = false
			if comment.ParentID != model.NoParent {
				message.Type = model.MessageTypeCommentComment
				message.ToUserID = parentComment.UserID
			} else if comment.SourceName == model.CommentSourceArticle {
				message.Type = model.MessageTypeCommentArticle
				message.ToUserID = author.ID
			} else if comment.SourceName == model.CommentSourceVote {
				message.Type = model.MessageTypeCommentVote
				message.ToUserID = author.ID
			}
			if err := model.DB.Create(&message).Error; err != nil {
				tx.Rollback()
				fmt.Println(err)
				SendErrJSON("error", c)
				return
			}
		}

		tx.Commit()
	} else {
		if err := model.DB.First(&updatedComment, comment.ID).Error; err != nil {
			SendErrJSON("无效的id", c)
			return
		}
		if user.ID != updatedComment.UserID {
			SendErrJSON("您无权执行此操作", c)
			return
		}
		updateMap := map[string]interface{}{
			"content": comment.Content,
			"status":  model.CommentVerifying,
		}
		if err := model.DB.Model(&updatedComment).Updates(updateMap).Error; err != nil {
			fmt.Println(err)
			SendErrJSON("error", c)
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

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"comment": commentJSON,
		},
	})
}

// Create 创建评论
func Create(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	iuser, _ := c.Get("user")
	user := iuser.(model.User)

	RedisConn := model.RedisPool.Get()
	defer RedisConn.Close()

	minuteKey := model.CommentMinuteLimit + fmt.Sprintf("%d", user.ID)
	minuteCount, minuteErr := redis.Int64(RedisConn.Do("GET", minuteKey))
	if minuteErr == nil && minuteCount >= model.CommentMinuteLimitCount {
		SendErrJSON("您的操作过于频繁，请先休息一会儿。", c)
		return
	}

	minuteRemainingTime, _ := redis.Int64(RedisConn.Do("TTL", minuteKey))
	if minuteRemainingTime < 0 || minuteRemainingTime > 60 {
		minuteRemainingTime = 60
	}

	fmt.Println("minuteRemainingTime", minuteRemainingTime)

	if _, err := RedisConn.Do("SET", minuteKey, minuteCount+1, "EX", minuteRemainingTime); err != nil {
		fmt.Println("redis set failed:", err)
		SendErrJSON("内部错误", c)
		return
	}

	dayKey := model.CommentDayLimit + fmt.Sprintf("%d", user.ID)
	dayCount, dayErr := redis.Int64(RedisConn.Do("GET", dayKey))
	if dayErr == nil && dayCount >= model.CommentDayLimitCount {
		SendErrJSON("您今天的操作过于频繁，请先休息一会儿。", c)
		return
	}

	dayRemainingTime, _ := redis.Int64(RedisConn.Do("TTL", dayKey))
	secondsOfDay := int64(24 * 60 * 60)
	if dayRemainingTime < 0 || dayRemainingTime > secondsOfDay {
		dayRemainingTime = secondsOfDay
	}

	if _, err := RedisConn.Do("SET", dayKey, dayCount+1, "EX", dayRemainingTime); err != nil {
		fmt.Println("redis set failed:", err)
		SendErrJSON("内部错误.", c)
		return
	}

	Save(c, false)
}

// Update 更新评论
func Update(c *gin.Context) {
	Save(c, true)
}

// Delete 删除评论
func Delete(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	id, idErr := strconv.Atoi(c.Param("id"))
	if idErr != nil {
		fmt.Println(idErr.Error())
		SendErrJSON("无效的ID", c)
		return
	}
	var comment model.Comment
	if err := model.DB.First(&comment, id).Error; err != nil {
		SendErrJSON("无效的ID", c)
		return
	}

	iuser, _ := c.Get("user")
	user := iuser.(model.User)

	if comment.UserID != user.ID {
		SendErrJSON("您无权执行此操作", c)
		return
	}

	tx := model.DB.Begin()

	if err := tx.Delete(&comment).Error; err != nil {
		tx.Rollback()
		SendErrJSON("error", c)
		return
	}

	if comment.SourceName == model.CommentSourceArticle {
		var article model.Article
		if err := tx.First(&article, comment.SourceID).Error; err != nil {
			tx.Rollback()
			SendErrJSON("error", c)
			return
		}

		articleData := map[string]interface{}{
			"comment_count": article.CommentCount - 1,
		}
		if article.LastUserID == user.ID {
			articleData["last_user_id"] = 0
		}

		if err := tx.Model(&article).Updates(articleData).Error; err != nil {
			tx.Rollback()
			SendErrJSON("error", c)
			return
		}
	} else if comment.SourceName == model.CommentSourceVote {
		var vote model.Vote
		if err := tx.First(&vote, comment.SourceID).Error; err != nil {
			tx.Rollback()
			SendErrJSON("error", c)
			return
		}

		voteData := map[string]interface{}{
			"comment_count": vote.CommentCount - 1,
		}
		if vote.LastUserID == user.ID {
			voteData["last_user_id"] = 0
		}

		if err := tx.Model(&vote).Updates(voteData).Error; err != nil {
			tx.Rollback()
			SendErrJSON("error", c)
			return
		}
	}

	// 删除评论时，用户积分减少，作者积分不变
	userMap := map[string]interface{}{
		"comment_count": user.CommentCount - 1,
		"score":         user.Score - model.CommentScore,
	}
	if err := tx.Model(&user).Updates(userMap).Error; err != nil {
		tx.Rollback()
		SendErrJSON("error", c)
		return
	}

	if model.UserToRedis(user) != nil {
		SendErrJSON("error", c)
		return
	}

	tx.Commit()
	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"id": comment.ID,
		},
	})
}

// UserCommentList 查询用户的评论
func UserCommentList(c *gin.Context) {
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

	if userID, userIDErr = strconv.Atoi(c.Param("userID")); userIDErr != nil {
		SendErrJSON("无效的userID", c)
		return
	}
	var user model.User
	if err := model.DB.First(&user, userID).Error; err != nil {
		SendErrJSON("无效的userID", c)
		return
	}

	if orderType, orderTypeErr = strconv.Atoi(c.Query("orderType")); orderTypeErr != nil {
		SendErrJSON("无效的orderType", c)
		return
	}

	// 1: 按日期排序 2: 按赞同数排序(即评论被点赞)
	if orderType != 1 && orderType != 2 {
		SendErrJSON("无效的orderType", c)
		return
	}

	if isDESC, descErr = strconv.Atoi(c.Query("desc")); descErr != nil {
		SendErrJSON("无效的desc", c)
		return
	}

	if isDESC != 0 && isDESC != 1 {
		SendErrJSON("无效的desc", c)
		return
	}

	if pageNo, pageNoErr = strconv.Atoi(c.Query("pageNo")); pageNoErr != nil {
		pageNo = 1
		pageNoErr = nil
	}
	if pageNo < 1 {
		pageNo = 1
	}

	if pageSize, pageSizeErr = strconv.Atoi(c.Query("pageSize")); pageSizeErr != nil {
		SendErrJSON("无效的pageSize", c)
		return
	}

	if pageSize < 1 || pageSize > model.MaxPageSize {
		SendErrJSON("无效的pageSize", c)
		return
	}

	offset := (pageNo - 1) * pageSize

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
	var totalCount int
	if err := model.DB.Model(&model.Comment{}).Where("user_id = ? AND status != ?", user.ID, model.CommentVerifyFail).Count(&totalCount).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", c)
		return
	}

	if err := model.DB.Where("user_id = ? AND status != ?", user.ID, model.CommentVerifyFail).Order(orderStr).Offset(offset).Limit(pageSize).Find(&comments).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", c)
		return
	}

	var results []map[string]interface{}
	for i := 0; i < len(comments); i++ {
		data := make(map[string]interface{})
		var article model.Article
		var vote model.Vote
		data["id"] = comments[i].ID
		if comments[i].ContentType == model.ContentTypeMarkdown {
			data["htmlContent"] = utils.MarkdownToHTML(comments[i].Content)
		} else {
			data["htmlContent"] = utils.AvoidXSS(comments[i].HTMLContent)
		}

		if comments[i].SourceName == model.CommentSourceArticle {
			if err := model.DB.Model(&comments[i]).Related(&article, "articles", "source_id").Error; err != nil {
				// 没有找到话题，即话题被删除了
				if err != gorm.ErrRecordNotFound {
					fmt.Println(err.Error())
					SendErrJSON("error", c)
					return
				}
			}
			data["sourceName"] = model.CommentSourceArticle
			data["articleID"] = article.ID
			data["articleName"] = article.Name
		} else if comments[i].SourceName == model.CommentSourceVote {
			if err := model.DB.Model(&comments[i]).Related(&vote, "votes", "source_id").Error; err != nil {
				if err != gorm.ErrRecordNotFound {
					fmt.Println(err.Error())
					SendErrJSON("error", c)
					return
				}
			}
			data["sourceName"] = model.CommentSourceVote
			data["voteID"] = vote.ID
			data["voteName"] = vote.Name
		}

		if err := model.DB.Model(&comments[i]).Related(&comments[i].User, "users").Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", c)
			return
		}
		data["user"] = comments[i].User
		results = append(results, data)
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"comments":   results,
			"pageNo":     pageNo,
			"pageSize":   pageSize,
			"totalCount": totalCount,
		},
	})
}

// SourceComments 查询话题或投票的评论
func SourceComments(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	sourceName := c.Param("sourceName")
	if sourceName != model.CommentSourceArticle && sourceName != model.CommentSourceVote {
		SendErrJSON("无效的sourceName", c)
		return
	}

	sourceID, sourceIDErr := strconv.Atoi(c.Param("sourceID"))

	if sourceIDErr != nil {
		SendErrJSON("无效的sourceID", c)
		return
	}

	var article model.Article
	var vote model.Vote

	if sourceName == model.CommentSourceArticle {
		if err := model.DB.First(&article, sourceID).Error; err != nil {
			SendErrJSON("无效的sourceID", c)
			return
		}
	}

	if sourceName == model.CommentSourceVote {
		if err := model.DB.First(&vote, sourceID).Error; err != nil {
			SendErrJSON("无效的sourceID", c)
			return
		}
	}

	var comments []model.Comment
	if err := model.DB.Where("source_id = ? AND source_name = ?", sourceID, sourceName).Preload("User").Find(&comments).Error; err != nil {
		SendErrJSON("error", c)
		return
	}

	for i := 0; i < len(comments); i++ {
		comments[i].HTMLContent = utils.MarkdownToHTML(comments[i].Content)
		// 只查回复的直接父回复
		var parentID = comments[i].ParentID
		var parents []model.Comment
		if parentID != 0 {
			var parent model.Comment
			var parentExist = true
			if err := model.DB.Where("id = ?", parentID).Find(&parent).Error; err != nil {
				parentExist = false
				if err != gorm.ErrRecordNotFound {
					fmt.Printf(err.Error())
					SendErrJSON("error", c)
					return
				}
			}
			if parentExist {
				if err := model.DB.Model(&parent).Related(&parent.User, "users").Error; err != nil {
					fmt.Println(err.Error())
					SendErrJSON("error", c)
					return
				}
				parents = append(parents, parent)
				comments[i].Parents = parents
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"comments": comments,
		},
	})
}

// Comments 查询评论列表
func Comments(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var startTime string
	var endTime string

	if startAt, err := strconv.Atoi(c.Query("startAt")); err != nil {
		startTime = time.Unix(0, 0).Format("2006-01-02 15:04:05")
	} else {
		startTime = time.Unix(int64(startAt/1000), 0).Format("2006-01-02 15:04:05")
	}

	if endAt, err := strconv.Atoi(c.Query("endAt")); err != nil {
		endTime = time.Now().Format("2006-01-02 15:04:05")
	} else {
		endTime = time.Unix(int64(endAt/1000), 0).Format("2006-01-02 15:04:05")
	}

	var comments []model.Comment
	var pageNo int
	var pageNoErr error
	if pageNo, pageNoErr = strconv.Atoi(c.Query("pageNo")); pageNoErr != nil {
		pageNo = 1
	}
	if pageNo < 1 {
		pageNo = 1
	}
	pageSize := 20
	offset := (pageNo - 1) * pageSize

	if err := model.DB.Where("created_at >= ? AND created_at < ?", startTime, endTime).Offset(offset).
		Limit(pageSize).Order("created_at DESC").Find(&comments).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", c)
		return
	}
	var count int
	if err := model.DB.Model(&model.Comment{}).Where("created_at >= ? AND created_at < ?", startTime, endTime).Count(&count).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error.", c)
		return
	}
	for i := 0; i < len(comments); i++ {
		if err := model.DB.Model(&comments[i]).Related(&comments[i].User, "users").Error; err != nil {
			SendErrJSON("error!", c)
			return
		}
		comments[i].HTMLContent = utils.MarkdownToHTML(comments[i].Content)
		comments[i].Content = ""
	}
	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"comments":   comments,
			"pageNo":     pageNo,
			"pageSize":   pageSize,
			"totalPage":  int(math.Ceil(float64(count) / float64(pageSize))),
			"totalCount": count,
		},
	})
}

// UpdateStatus 更新评论状态
func UpdateStatus(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var reqData model.Comment
	var commentID int
	var idErr error

	if commentID, idErr = strconv.Atoi(c.Param("id")); idErr != nil {
		SendErrJSON("无效的id", c)
		return
	}

	if err := c.ShouldBindJSON(&reqData); err != nil {
		SendErrJSON("无效的status", c)
		return
	}

	status := reqData.Status

	var comment model.Comment
	if err := model.DB.First(&comment, commentID).Error; err != nil {
		SendErrJSON("无效的id", c)
		return
	}

	if status != model.CommentVerifySuccess && status != model.CommentVerifying && status != model.CommentVerifyFail {
		SendErrJSON("无效的状态", c)
		return
	}

	comment.Status = status

	if err := model.DB.Model(&comment).Update("status", status).Error; err != nil {
		SendErrJSON("error", c)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"id":     comment.ID,
			"status": comment.Status,
		},
	})
}
