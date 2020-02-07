package article

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

func queryList(c *gin.Context, isBackend bool) {
	SendErrJSON := common.SendErrJSON
	var articles []model.Article
	var categoryID int
	var pageNo int
	var err error
	var startTime string
	var endTime string

	if pageNo, err = strconv.Atoi(c.Query("pageNo")); err != nil {
		pageNo = 1
		err = nil
	}

	if pageNo < 1 {
		pageNo = 1
	}

	pageSize := 40
	offset := (pageNo - 1) * pageSize

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

	//默认按创建时间，降序来排序
	var orderField = "created_at"
	var orderASC = "DESC"
	if c.Query("asc") == "1" {
		orderASC = "ASC"
	} else {
		orderASC = "DESC"
	}

	cateIDStr := c.Query("cateId")
	if cateIDStr == "" {
		categoryID = 0
	} else if categoryID, err = strconv.Atoi(cateIDStr); err != nil {
		fmt.Println(err.Error())
		SendErrJSON("分类ID不正确", c)
		return
	}

	var topArticles []model.TopArticle
	if err := model.DB.Find(&topArticles).Error; err != nil {
		SendErrJSON("error", c)
		return
	}
	var topArr []string
	for i := 0; i < len(topArticles); i++ {
		topArr = append(topArr, strconv.Itoa(int(topArticles[i].ArticleID)))
	}
	topIDs := strconv.Itoa(model.NoParent)
	if len(topArr) > 0 {
		topIDs = strings.Join(topArr, ",")
	}

	type TotalCountResult struct {
		TotalCount int
	}

	var totalCountResult TotalCountResult

	if categoryID != 0 {
		var category model.Category
		if model.DB.First(&category, categoryID).Error != nil {
			SendErrJSON("分类ID不正确", c)
			return
		}
		var sql = `SELECT distinct(articles.id), articles.name, articles.browse_count, articles.comment_count, articles.collect_count,  
					articles.status, articles.created_at, articles.updated_at, articles.user_id, articles.last_user_id  
				FROM articles, article_category  
				WHERE articles.id = article_category.article_id   
				{statusSQL}       
				AND article_category.category_id = {categoryID} 
				AND articles.deleted_at IS NULL 
				AND articles.id NOT IN ({topIDs})   
				{timeSQL} 
				ORDER BY {orderField} {orderASC}
				LIMIT {offset}, {pageSize}`
		sql = strings.Replace(sql, "{categoryID}", strconv.Itoa(categoryID), -1)
		sql = strings.Replace(sql, "{orderField}", orderField, -1)
		sql = strings.Replace(sql, "{topIDs}", topIDs, -1)
		sql = strings.Replace(sql, "{timeSQL}", " AND created_at >= '"+startTime+"' AND created_at < '"+endTime+"'", -1)
		sql = strings.Replace(sql, "{orderASC}", orderASC, -1)
		sql = strings.Replace(sql, "{offset}", strconv.Itoa(offset), -1)
		sql = strings.Replace(sql, "{pageSize}", strconv.Itoa(pageSize), -1)
		if isBackend {
			sql = strings.Replace(sql, "{statusSQL}", " ", -1)
		} else {
			sql = strings.Replace(sql, "{statusSQL}", " AND (status = 1 OR status = 2)", -1)
		}
		if err := model.DB.Raw(sql).Scan(&articles).Error; err != nil {
			SendErrJSON("error", c)
			return
		}
		for i := 0; i < len(articles); i++ {
			articles[i].Categories = []model.Category{category}
		}

		countSQL := `SELECT COUNT(distinct(articles.id)) AS total_count 
				FROM articles, article_category  
				WHERE articles.id = article_category.article_id   
				{statusSQL}       
				AND article_category.category_id = {categoryID}  
				AND articles.id NOT IN ({topIDs}) 
				{timeSQL}  
				AND articles.deleted_at IS NULL`

		countSQL = strings.Replace(countSQL, "{categoryID}", strconv.Itoa(categoryID), -1)
		countSQL = strings.Replace(countSQL, "{topIDs}", topIDs, -1)
		countSQL = strings.Replace(countSQL, "{timeSQL}", " AND created_at >= '"+startTime+"' AND created_at < '"+endTime+"'", -1)

		if isBackend {
			//管理员查询话题列表时，会返回审核未通过的话题
			countSQL = strings.Replace(countSQL, "{statusSQL}", " ", -1)
			if err := model.DB.Raw(countSQL).Scan(&totalCountResult).Error; err != nil {
				SendErrJSON("error", c)
				return
			}
		} else {
			countSQL = strings.Replace(countSQL, "{statusSQL}", " AND (status = 1 OR status = 2)", -1)
			if err := model.DB.Raw(countSQL).Scan(&totalCountResult).Error; err != nil {
				SendErrJSON("error", c)
				return
			}
		}
	} else {
		orderStr := orderField + " " + orderASC
		excludeIDs := "id NOT IN ({topIDs})"
		excludeIDs = strings.Replace(excludeIDs, "{topIDs}", topIDs, -1)

		if isBackend {
			//管理员查询话题列表时，会返回审核未通过的话题
			err = model.DB.Where(excludeIDs).
				Where("created_at >= ? AND created_at < ? ", startTime, endTime).
				Offset(offset).Limit(pageSize).
				Order(orderStr).Find(&articles).Error
		} else {
			err = model.DB.Where(excludeIDs).Where("status = 1 OR status = 2").
				Where("created_at >= ? AND created_at < ? ", startTime, endTime).
				Offset(offset).Limit(pageSize).Order(orderStr).Find(&articles).Error
		}

		if err != nil {
			SendErrJSON("error", c)
			return
		}
		for i := 0; i < len(articles); i++ {
			if err = model.DB.Model(&articles[i]).Related(&articles[i].Categories, "categories").Error; err != nil {
				fmt.Println(err.Error())
				SendErrJSON("error", c)
				return
			}
		}

		if isBackend {
			if err := model.DB.Model(&model.Article{}).Where(excludeIDs).
				Where("created_at >= ? AND created_at < ? ", startTime, endTime).
				Count(&totalCountResult.TotalCount).Error; err != nil {
				SendErrJSON("error", c)
				return
			}
		} else {
			if err := model.DB.Model(&model.Article{}).Where(excludeIDs).Where("status = 1 OR status = 2").
				Where("created_at >= ? AND created_at < ? ", startTime, endTime).
				Count(&totalCountResult.TotalCount).Error; err != nil {
				SendErrJSON("error", c)
				return
			}
		}
	}

	for i := 0; i < len(articles); i++ {
		if err := model.DB.Model(&articles[i]).Related(&articles[i].User, "users").Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", c)
			return
		}
		if articles[i].LastUserID != 0 {
			if err := model.DB.Model(&articles[i]).Related(&articles[i].LastUser, "users", "last_user_id").Error; err != nil {
				fmt.Println(err.Error())
				SendErrJSON("error", c)
				return
			}
		}
		if c.Query("noContent") == "true" {
			articles[i].Content = ""
			articles[i].HTMLContent = ""
		}
	}
	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"articles":   articles,
			"pageNo":     pageNo,
			"pageSize":   pageSize,
			"totalPage":  math.Ceil(float64(totalCountResult.TotalCount) / float64(pageSize)),
			"totalCount": totalCountResult.TotalCount,
		},
	})
}

// List 文章列表
func List(c *gin.Context) {
	queryList(c, false)
}

// AllList 文章列表，后台管理提供的接口
func AllList(c *gin.Context) {
	queryList(c, true)
}

// UserArticleList 查询用户的文章
func UserArticleList(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var userID int
	var userIDErr error
	var orderType int
	var orderTypeErr error
	var orderStr string
	var isDESC int
	var descErr error
	var pageNo int
	var pageSize int
	var pageSizeErr error
	var f string

	f = c.Query("f")

	if pn, err := strconv.Atoi(c.Query("pageNo")); err != nil {
		pageNo = 1
	} else {
		pageNo = pn
	}

	if pageNo < 1 {
		pageNo = 1
	}

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

	// 1: 按日期排序 2: 按点赞数排序 3: 按评论数排序
	if orderType != 1 && orderType != 2 && orderType != 3 {
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

	if pageSize, pageSizeErr = strconv.Atoi(c.Query("pageSize")); pageSizeErr != nil {
		SendErrJSON("无效的pageSize", c)
		return
	}

	if pageSize < 1 || pageSize > model.MaxPageSize {
		SendErrJSON("无效的pageSize", c)
		return
	}

	if orderType == 1 {
		orderStr = "created_at"
	} else if orderType == 2 {
		orderStr = "up_count" // 按点赞数排序
	} else if orderType == 3 {
		orderStr = "comment_count"
	}

	if isDESC == 1 {
		orderStr += " DESC"
	} else {
		orderStr += " ASC"
	}

	var articles []model.Article
	if err := model.DB.Where("user_id = ? AND (status = 1 OR status = 2)", user.ID).
		Order(orderStr).Offset((pageNo - 1) * pageSize).Limit(pageSize).Find(&articles).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", c)
		return
	}

	totalCount := 0
	if err := model.DB.Model(&model.Article{}).Where("user_id = ? AND (status = 1 OR status = 2)", user.ID).Count(&totalCount).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", c)
		return
	}

	if f != "md" {
		for i := 0; i < len(articles); i++ {
			if err := model.DB.Model(&articles[i]).Related(&articles[i].User, "users").Error; err != nil {
				fmt.Println(err.Error())
				SendErrJSON("error", c)
				return
			}
			if articles[i].ContentType == model.ContentTypeMarkdown {
				articles[i].HTMLContent = utils.MarkdownToHTML(articles[i].Content)
			} else {
				articles[i].HTMLContent = utils.AvoidXSS(articles[i].HTMLContent)
			}
			articles[i].Content = ""
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"articles":   articles,
			"pageNo":     pageNo,
			"pageSize":   pageSize,
			"totalPage":  math.Ceil(float64(totalCount) / float64(pageSize)),
			"totalCount": totalCount,
		},
	})
}

// ListMaxComment 评论最多的文章，返回5条
func ListMaxComment(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var articles []model.Article
	if err := model.DB.Select("id, name").Where("status = 1 OR status = 2").Order("comment_count DESC").Limit(5).Find(&articles).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", c)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"articles": articles,
		},
	})
}

// ListMaxBrowse 访问量最多的文章，返回5条
func ListMaxBrowse(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var articles []model.Article
	if err := model.DB.Select("id, name").Where("status = 1 OR status = 2").Order("browse_count DESC").Limit(5).Find(&articles).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", c)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"articles": articles,
		},
	})
}

func save(c *gin.Context, isEdit bool) {
	SendErrJSON := common.SendErrJSON
	var article model.Article

	if err := c.ShouldBindJSON(&article); err != nil {
		fmt.Println(err.Error())
		SendErrJSON("参数无效", c)
		return
	}

	userInter, _ := c.Get("user")
	user := userInter.(model.User)

	var queryArticle model.Article
	if isEdit {
		if model.DB.First(&queryArticle, article.ID).Error != nil {
			SendErrJSON("无效的文章ID", c)
			return
		}
	} else {
		article.UserID = user.ID
	}

	if isEdit {
		tempArticle := article
		article = queryArticle
		article.Name = tempArticle.Name
		if article.ContentType == model.ContentTypeHTML {
			article.HTMLContent = tempArticle.Content
		} else {
			article.Content = tempArticle.Content
		}
		article.Categories = tempArticle.Categories
	} else {
		article.BrowseCount = 0
		article.Status = model.ArticleVerifying
		article.ContentType = model.ContentTypeMarkdown
		user.Score = user.Score + model.ArticleScore
		user.ArticleCount = user.ArticleCount + 1
		if model.UserToRedis(user) != nil {
			SendErrJSON("error", c)
			return
		}
	}

	article.Name = utils.AvoidXSS(article.Name)
	article.Name = strings.TrimSpace(article.Name)

	article.Content = strings.TrimSpace(article.Content)
	article.HTMLContent = strings.TrimSpace(article.HTMLContent)

	if article.HTMLContent != "" {
		article.HTMLContent = utils.AvoidXSS(article.HTMLContent)
	}

	if article.Name == "" {
		SendErrJSON("文章名称不能为空", c)
		return
	}

	if utf8.RuneCountInString(article.Name) > model.MaxNameLen {
		msg := "文章名称不能超过" + strconv.Itoa(model.MaxNameLen) + "个字符"
		SendErrJSON(msg, c)
		return
	}

	var theContent string
	if article.ContentType == model.ContentTypeHTML {
		theContent = article.HTMLContent
	} else {
		theContent = article.Content
	}

	if theContent == "" || utf8.RuneCountInString(theContent) <= 0 {
		SendErrJSON("文章内容不能为空", c)
		return
	}

	if utf8.RuneCountInString(theContent) > model.MaxContentLen {
		msg := "文章内容不能超过" + strconv.Itoa(model.MaxContentLen) + "个字符"
		SendErrJSON(msg, c)
		return
	}

	if article.Categories == nil || len(article.Categories) <= 0 {
		SendErrJSON("请选择版块", c)
		return
	}

	if len(article.Categories) > model.MaxCategoryCount {
		msg := "文章最多属于" + strconv.Itoa(model.MaxCategoryCount) + "个版块"
		SendErrJSON(msg, c)
		return
	}

	for i := 0; i < len(article.Categories); i++ {
		var category model.Category
		if err := model.DB.First(&category, article.Categories[i].ID).Error; err != nil {
			SendErrJSON("无效的版块id", c)
			return
		}
		article.Categories[i] = category
	}

	var saveErr error

	if isEdit {
		var sql = "DELETE FROM article_category WHERE article_id = ?"
		saveErr = model.DB.Exec(sql, article.ID).Error
		if saveErr == nil {
			saveErr = model.DB.Save(&article).Error
		}
	} else {
		saveErr = model.DB.Create(&article).Error
		if saveErr == nil {
			// 发表文章后，用户的积分、文章数会增加，如果保存失败了，不作处理
			if userErr := model.DB.Model(&user).Update(map[string]interface{}{
				"article_count": user.ArticleCount,
				"score":         user.Score,
			}).Error; userErr != nil {
				fmt.Println(userErr.Error())
			}
		}
	}

	if saveErr != nil {
		fmt.Println(saveErr.Error())
		SendErrJSON("error", c)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data":  article,
	})
}

// Create 创建文章
func Create(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	iuser, _ := c.Get("user")
	user := iuser.(model.User)

	RedisConn := model.RedisPool.Get()
	defer RedisConn.Close()

	minuteKey := model.ArticleMinuteLimit + fmt.Sprintf("%d", user.ID)
	minuteCount, minuteErr := redis.Int64(RedisConn.Do("GET", minuteKey))
	if minuteErr == nil && minuteCount >= model.ArticleMinuteLimitCount {
		SendErrJSON("您的操作过于频繁，请先休息一会儿。", c)
		return
	}

	minuteRemainingTime, _ := redis.Int64(RedisConn.Do("TTL", minuteKey))
	if minuteRemainingTime < 0 || minuteRemainingTime > 60 {
		minuteRemainingTime = 60
	}

	if _, err := RedisConn.Do("SET", minuteKey, minuteCount+1, "EX", minuteRemainingTime); err != nil {
		fmt.Println("redis set failed:", err)
		SendErrJSON("内部错误", c)
		return
	}

	dayKey := model.ArticleDayLimit + fmt.Sprintf("%d", user.ID)
	dayCount, dayErr := redis.Int64(RedisConn.Do("GET", dayKey))
	if dayErr == nil && dayCount >= model.ArticleDayLimitCount {
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

	save(c, false)
}

// Update 更新文章
func Update(c *gin.Context) {
	save(c, true)
}

// Info 获取文章信息
func Info(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	articleID, paramsErr := strconv.Atoi(c.Param("id"))

	if paramsErr != nil {
		SendErrJSON("错误的文章id", c)
		return
	}

	var article model.Article

	if err := model.DB.First(&article, articleID).Error; err != nil {
		fmt.Printf(err.Error())
		SendErrJSON("错误的文章id", c)
		return
	}

	if article.Status == model.ArticleVerifyFail {
		SendErrJSON("错误的文章id.", c)
		return
	}

	article.BrowseCount++
	if err := model.DB.Save(&article).Error; err != nil {
		SendErrJSON("error", c)
		return
	}

	if err := model.DB.Model(&article).Related(&article.User, "users").Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", c)
		return
	}

	if err := model.DB.Model(&article).Related(&article.Categories, "categories").Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", c)
		return
	}

	if err := model.DB.Model(&article).Where("source_name = ?", model.CommentSourceArticle).Related(&article.Comments, "comments").Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", c)
		return
	}

	for i := 0; i < len(article.Comments); i++ {
		if err := model.DB.Model(&article.Comments[i]).Related(&article.Comments[i].User, "users").Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", c)
			return
		}
		article.Comments[i].HTMLContent = utils.MarkdownToHTML(article.Comments[i].Content)
		parentID := article.Comments[i].ParentID
		var parents []model.Comment
		// 只查回复的直接父回复
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
				article.Comments[i].Parents = parents
			}
		}
	}

	if c.Query("f") != "md" {
		if article.ContentType == model.ContentTypeMarkdown {
			article.HTMLContent = utils.MarkdownToHTML(article.Content)
		} else if article.ContentType == model.ContentTypeHTML {
			article.HTMLContent = utils.AvoidXSS(article.HTMLContent)
		} else {
			article.HTMLContent = utils.MarkdownToHTML(article.Content)
		}
		article.Content = ""
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"article": article,
		},
	})
}

// UpdateStatus 更新文章状态
func UpdateStatus(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var reqData model.Article

	if err := c.ShouldBindJSON(&reqData); err != nil {
		SendErrJSON("无效的id或status", c)
		return
	}

	articleID := reqData.ID
	status := reqData.Status

	var article model.Article
	if err := model.DB.First(&article, articleID).Error; err != nil {
		SendErrJSON("无效的文章ID", c)
		return
	}

	if status != model.ArticleVerifying && status != model.ArticleVerifySuccess && status != model.ArticleVerifyFail {
		SendErrJSON("无效的文章状态", c)
		return
	}

	article.Status = status

	if err := model.DB.Save(&article).Error; err != nil {
		SendErrJSON("error", c)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"id":     article.ID,
			"status": article.Status,
		},
	})
}

// Top 文章置顶
func Top(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var id int
	var idErr error
	if id, idErr = strconv.Atoi(c.Param("id")); idErr != nil {
		SendErrJSON("error", c)
		return
	}

	var theArticle model.Article

	if err := model.DB.First(&theArticle, id).Error; err != nil {
		SendErrJSON("无效的文章id", c)
		return
	}

	var count int

	if err := model.DB.Model(&model.TopArticle{}).Count(&count).Error; err != nil {
		SendErrJSON("error", c)
		return
	}

	if count >= model.MaxTopArticleCount {
		SendErrJSON("最多只能有"+strconv.Itoa(count)+"篇文章置顶", c)
		return
	}

	topArticle := model.TopArticle{
		ArticleID: theArticle.ID,
	}

	if err := model.DB.Save(&topArticle).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", c)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data":  topArticle,
	})
}

// DeleteTop 取消文章置顶
func DeleteTop(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var id int
	var idErr error
	if id, idErr = strconv.Atoi(c.Param("id")); idErr != nil {
		SendErrJSON("error", c)
		return
	}

	var topArticle model.TopArticle

	if err := model.DB.Where("article_id = ?", id).Find(&topArticle).Error; err != nil {
		SendErrJSON("无效的文章id", c)
		return
	}

	if err := model.DB.Delete(&topArticle).Error; err != nil {
		SendErrJSON("error", c)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"articleID": id,
		},
	})
}

// Tops 所有置顶文章
func Tops(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var topArticles []model.TopArticle
	var articles []model.Article

	if err := model.DB.Order("created_at DESC").Find(&topArticles).Error; err != nil {
		SendErrJSON("error", c)
		return
	}

	for i := 0; i < len(topArticles); i++ {
		var article model.Article
		if err := model.DB.Model(&topArticles[i]).Related(&article, "articles").Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", c)
			return
		}

		if err := model.DB.Model(&article).Related(&article.Categories, "categories").Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", c)
			return
		}

		if err := model.DB.Model(&article).Related(&article.User, "users").Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", c)
			return
		}

		if article.LastUserID != 0 {
			if err := model.DB.Model(&article).Related(&article.LastUser, "users", "last_user_id").Error; err != nil {
				fmt.Println(err.Error(), "articleID: ", article.ID, "lastUserID", article.LastUserID)
				SendErrJSON("error", c)
				return
			}
		}

		article.Content = ""
		article.HTMLContent = ""
		articles = append(articles, article)
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"articles": articles,
		},
	})
}

// Delete 删除文章
func Delete(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	// 删除文章，其他用户对文章的评论保留
	// 其他用户对文章的点赞也保留
	var id int
	var idErr error
	if id, idErr = strconv.Atoi(c.Param("id")); idErr != nil {
		SendErrJSON("无效的id", c)
		return
	}

	var article model.Article

	if err := model.DB.First(&article, id).Error; err != nil {
		SendErrJSON("无效的话题id", c)
		return
	}

	iuser, _ := c.Get("user")
	user := iuser.(model.User)

	if user.ID != article.UserID {
		SendErrJSON("没有权限执行此操作", c)
		return
	}

	tx := model.DB.Begin()

	if err := tx.Delete(&article).Error; err != nil {
		SendErrJSON("error", c)
		tx.Rollback()
		return
	}

	if err := tx.Model(&user).Updates(map[string]interface{}{
		"article_count": user.ArticleCount - 1,
		"score":         user.Score - model.ArticleScore,
	}).Error; err != nil {
		fmt.Println(err.Error())
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
			"id": id,
		},
	})
}
