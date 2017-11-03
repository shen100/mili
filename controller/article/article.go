package article

import (
	"fmt"
	"math"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"
	"github.com/kataras/iris"
	"github.com/microcosm-cc/bluemonday"
	"github.com/shen100/golang123/model"
	"github.com/shen100/golang123/manager"
	"github.com/shen100/golang123/utils"
	"github.com/shen100/golang123/controller/common"
)

func queryList(isBackend bool, ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var articles []model.Article
	var categoryID int
	var pageNo int
	var err error

	if pageNo, err = strconv.Atoi(ctx.FormValue("pageNo")); err != nil {
		pageNo = 1
		err    = nil
	}
 
	if pageNo < 1 {
		pageNo = 1
	}

	pageSize := 40
	offset   := (pageNo - 1) * pageSize

	//默认按创建时间，降序来排序
	var orderField = "created_at"
	var orderASC   = "DESC"
	if ctx.FormValue("asc") == "1" {
		orderASC = "ASC"
	} else {
		orderASC = "DESC"	
	}

	cateIDStr := ctx.FormValue("cateId")
	if cateIDStr == "" {
		categoryID = 0	
	} else if categoryID, err = strconv.Atoi(cateIDStr); err != nil {
		fmt.Println(err.Error())
		SendErrJSON("分类ID不正确", ctx)
		return
	}

	var topArticles []model.TopArticle
	if err := model.DB.Find(&topArticles).Error; err != nil {
		SendErrJSON("error", ctx)
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
			SendErrJSON("分类ID不正确", ctx)
			return
		}
		var sql = `SELECT distinct(articles.id), articles.name, articles.browse_count, articles.status,  
					articles.created_at, articles.updated_at, articles.user_id, articles.last_user_id  
				FROM articles, article_category  
				WHERE articles.id = article_category.article_id   
				{statusSQL}       
				AND article_category.category_id = {categoryID} 
				AND articles.deleted_at IS NULL 
				AND articles.id NOT IN ({topIDs})
				ORDER BY {orderField} {orderASC}
				LIMIT {offset}, {pageSize}`
		sql = strings.Replace(sql, "{categoryID}", strconv.Itoa(categoryID), -1)
		sql = strings.Replace(sql, "{orderField}", orderField, -1)
		sql = strings.Replace(sql, "{topIDs}",     topIDs, -1)
		sql = strings.Replace(sql, "{orderASC}",   orderASC, -1)
		sql = strings.Replace(sql, "{offset}",     strconv.Itoa(offset), -1)
		sql = strings.Replace(sql, "{pageSize}",   strconv.Itoa(pageSize), -1)
		if isBackend {
			sql = strings.Replace(sql, "{statusSQL}", " ", -1)	
		} else {
			sql = strings.Replace(sql, "{statusSQL}", " AND (status = 1 OR status = 2)", -1)
		}
		if err := model.DB.Raw(sql).Scan(&articles).Error; err != nil {
			SendErrJSON("error", ctx)
			return
		}
		for i := 0; i < len(articles); i++ {
			articles[i].Categories = []model.Category{ category }
		}

		countSQL := `SELECT COUNT(distinct(articles.id)) AS total_count 
				FROM articles, article_category  
				WHERE articles.id = article_category.article_id   
				{statusSQL}       
				AND article_category.category_id = {categoryID}  
				AND articles.id NOT IN ({topIDs})
				AND articles.deleted_at IS NULL`

		countSQL = strings.Replace(countSQL, "{categoryID}", strconv.Itoa(categoryID), -1)
		countSQL = strings.Replace(countSQL, "{topIDs}",     topIDs, -1)
		if isBackend {
			//管理员查询话题列表时，会返回审核未通过的话题
			countSQL = strings.Replace(countSQL, "{statusSQL}", " ", -1)
			if err := model.DB.Raw(countSQL).Scan(&totalCountResult).Error; err != nil {
				SendErrJSON("error", ctx)
				return
			}
		} else {
			countSQL = strings.Replace(countSQL, "{statusSQL}", " AND (status = 1 OR status = 2)", -1)
			if err := model.DB.Raw(countSQL).Scan(&totalCountResult).Error; err != nil {
				SendErrJSON("error", ctx)
				return
			}
		}
	} else {
		orderStr := orderField + " " + orderASC
		excludeIDs := "id NOT IN ({topIDs})"
		excludeIDs = strings.Replace(excludeIDs, "{topIDs}", topIDs, -1)

		if isBackend {
			//管理员查询话题列表时，会返回审核未通过的话题
			err = model.DB.Where(excludeIDs).Offset(offset).Limit(pageSize).
				Order(orderStr).Find(&articles).Error
		} else {
			err = model.DB.Where(excludeIDs).Where("status = 1 OR status = 2").
				Offset(offset).Limit(pageSize).Order(orderStr).Find(&articles).Error
		}
		
		if err != nil {
			SendErrJSON("error", ctx)
			return
		}
		for i := 0; i < len(articles); i++ {
			if err = model.DB.Model(&articles[i]).Related(&articles[i].Categories, "categories").Error; err != nil {
				fmt.Println(err.Error())
				SendErrJSON("error", ctx)
				return
			}
		}

		if isBackend {
			if err := model.DB.Model(&model.Article{}).Where(excludeIDs).Count(&totalCountResult.TotalCount).Error; err != nil {
				SendErrJSON("error", ctx)
				return
			}
		} else {
			if err := model.DB.Model(&model.Article{}).Where(excludeIDs).Where("status = 1 OR status = 2").
				Count(&totalCountResult.TotalCount).Error; err != nil {
				SendErrJSON("error", ctx)
				return
			}	
		}
	}

	for i := 0; i < len(articles); i++ {
		if err := model.DB.Model(&articles[i]).Related(&articles[i].User, "users").Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", ctx)
			return
		}
		if articles[i].LastUserID != 0 {
			if err := model.DB.Model(&articles[i]).Related(&articles[i].LastUser, "users").Error; err != nil {
				fmt.Println(err.Error())
				SendErrJSON("error", ctx)
				return
			}
		}
	}
	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"articles": articles,
			"pageNo": pageNo,
			"pageSize": pageSize,
			"totalPage": math.Ceil(float64(totalCountResult.TotalCount) / float64(pageSize)),
			"totalCount": totalCountResult.TotalCount,
		},
	})
}

// List 文章列表
func List(ctx iris.Context) {
	queryList(false, ctx)
}

// AllList 文章列表，后台管理提供的接口
func AllList(ctx iris.Context) {
	queryList(true, ctx)
}

// UserArticleList 查询用户的文章
func UserArticleList(ctx iris.Context) {
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

	f = ctx.FormValue("f")

	if pn, err := strconv.Atoi(ctx.FormValue("pageNo")); err != nil {
		pageNo = 1
	} else {
		pageNo = pn
	}
 
	if pageNo < 1 {
		pageNo = 1
	}

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

	// 1: 按日期排序 2: 按点赞数排序 3: 按评论数排序
	if orderType != 1 && orderType != 2 && orderType != 3 {
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

	if pageSize < 1 || pageSize > model.MaxPageSize {
		SendErrJSON("无效的pageSize", ctx)
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
		SendErrJSON("error", ctx)
		return
	}

	totalCount := 0
	if err := model.DB.Model(&model.Article{}).Where("user_id = ? AND (status = 1 OR status = 2)", user.ID).Count(&totalCount).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return	
	}

	if f != "md" {
		for i := 0; i < len(articles); i++ {
			articles[i].Content = utils.MarkdownToHTML(articles[i].Content)
		}
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"articles": articles,
			"pageNo": pageNo,
			"pageSize": pageSize,
			"totalPage": math.Ceil(float64(totalCount) / float64(pageSize)),
			"totalCount": totalCount,
		},
	})	
}

// ListMaxComment 评论最多的文章，返回5条
func ListMaxComment(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var articles []model.Article
	if err := model.DB.Where("status = 1 OR status = 2").Order("comment_count DESC").Limit(5).Find(&articles).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}
	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"articles": articles,
		},
	})
}

// ListMaxBrowse 访问量最多的文章，返回5条
func ListMaxBrowse(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var articles []model.Article
	if err := model.DB.Where("status = 1 OR status = 2").Order("browse_count DESC").Limit(5).Find(&articles).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}
	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"articles": articles,
		},
	})
}

func save(isEdit bool, ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var article model.Article

	if err := ctx.ReadJSON(&article); err != nil {
		fmt.Println(err.Error())
		SendErrJSON("参数无效", ctx)
		return
	}

	user, _ := manager.Sess.Start(ctx).Get("user").(model.User)
	var queryArticle model.Article
	if isEdit {
		if model.DB.First(&queryArticle, article.ID).Error != nil {
			SendErrJSON("无效的文章ID", ctx)
			return
		}
	} else {
		article.UserID  = user.ID
	}

	if isEdit {
		tempArticle       := article
		article            = queryArticle
		article.Name       = tempArticle.Name
		article.Content    = tempArticle.Content
		article.Categories = tempArticle.Categories
	} else {
		article.BrowseCount  = 0
		article.Status       = model.ArticleVerifying
		user.Score           = user.Score + model.ArticleScore
		user.ArticleCount    = user.ArticleCount + 1
		manager.Sess.Start(ctx).Set("user", user)
	}

	article.Name = bluemonday.UGCPolicy().Sanitize(article.Name)
	article.Name = strings.TrimSpace(article.Name)

	article.Content = strings.TrimSpace(article.Content)

	if (article.Name == "") {
		SendErrJSON("文章名称不能为空", ctx)
		return
	}
	
	if utf8.RuneCountInString(article.Name) > model.MaxNameLen {
		msg := "文章名称不能超过" + strconv.Itoa(model.MaxNameLen) + "个字符"
		SendErrJSON(msg, ctx)
		return
	}
	
	if article.Content == "" || utf8.RuneCountInString(article.Content) <= 0 {
		SendErrJSON("文章内容不能为空", ctx)
		return
	}
	
	if utf8.RuneCountInString(article.Content) > model.MaxContentLen {	
		msg := "文章内容不能超过" + strconv.Itoa(model.MaxContentLen) + "个字符"	
		SendErrJSON(msg, ctx)
		return
	}
	
	if article.Categories == nil || len(article.Categories) <= 0  {
		SendErrJSON("请选择版块", ctx)
		return
	}
	
	if len(article.Categories) > model.MaxArticleCateCount {
		msg := "文章最多属于" + strconv.Itoa(model.MaxArticleCateCount) + "个版块"
		SendErrJSON(msg, ctx)
		return
	}

	for i := 0; i < len(article.Categories); i++ {
		var category model.Category
		if err := model.DB.First(&category, article.Categories[i].ID).Error; err != nil {
			SendErrJSON("无效的版块id", ctx)
			return	
		}
		article.Categories[i] = category
	}

	var saveErr error;

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
			if userErr := model.DB.Model(&user).Update("score", user.Score).Error; userErr != nil {
				fmt.Println(userErr.Error())
			}
		}
	}

	if saveErr != nil {
		fmt.Println(saveErr.Error())
		SendErrJSON("error", ctx)
		return	
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : article,
	})
}

// Create 创建文章
func Create(ctx iris.Context) {
	save(false, ctx);	
}

// Update 更新文章
func Update(ctx iris.Context) {
	save(true, ctx);	
}

// Info 获取文章信息
func Info(ctx iris.Context) {
	SendErrJSON  := common.SendErrJSON
	reqStartTime := time.Now()
	var articleID int
	var paramsErr error

	if articleID, paramsErr = ctx.Params().GetInt("id"); paramsErr != nil {
		SendErrJSON("错误的文章id", ctx)
		return
	}

	var article model.Article

	if err := model.DB.First(&article, articleID).Error; err != nil {
		fmt.Printf(err.Error())
		SendErrJSON("错误的文章id", ctx)
		return
	}

	article.BrowseCount++
	if err := model.DB.Save(&article).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	if err := model.DB.Model(&article).Related(&article.User, "users").Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}

	if err := model.DB.Model(&article).Related(&article.Categories, "categories").Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}

	if err := model.DB.Model(&article).Related(&article.Comments, "comments").Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}

	for i := 0; i < len(article.Comments); i++ {
		if err := model.DB.Model(&article.Comments[i]).Related(&article.Comments[i].User, "users").Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", ctx)
			return
		}
		article.Comments[i].Content = utils.MarkdownToHTML(article.Comments[i].Content)
		parentID := article.Comments[i].ParentID
		var parents []model.Comment
		for parentID != 0 {
			var parent model.Comment
			if err := model.DB.Where("parent_id = ?", parentID).Find(&parent).Error; err != nil {
				SendErrJSON("error", ctx)
				return
			}
			if err := model.DB.Model(&parent).Related(&parent.User, "users").Error; err != nil {
				fmt.Println(err.Error())
				SendErrJSON("error", ctx)
				return
			}
			parents = append(parents, parent)
			parentID = parent.ParentID
		}
		article.Comments[i].Parents = parents
	}

	if ctx.FormValue("f") != "md" {
		article.Content = utils.MarkdownToHTML(article.Content)
	}

	totalDur := fmt.Sprintf("%f", time.Now().Sub(reqStartTime).Seconds())
	ctx.Application().Logger().Infof("duration: " + totalDur)

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"article": article,
		},
	})
}

// UpdateStatus 更新文章状态
func UpdateStatus(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var reqData model.Article

	if err := ctx.ReadJSON(&reqData); err != nil {
		SendErrJSON("无效的id或status", ctx)
		return
	}

	articleID := reqData.ID
	status    := reqData.Status

	var article model.Article
	if err := model.DB.First(&article, articleID).Error; err != nil {
		SendErrJSON("无效的文章ID", ctx)
		return
	}
	
	if status != model.ArticleVerifying && status != model.ArticleVerifySuccess && status != model.ArticleVerifyFail {
		SendErrJSON("无效的文章状态", ctx)
		return
	}

	article.Status = status

	if err := model.DB.Save(&article).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"id"     : article.ID,
			"status" : article.Status,
		},
	})
}

// Top 文章置顶
func Top(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var id int
	var idErr error
	if id, idErr = ctx.Params().GetInt("id"); idErr != nil {
		SendErrJSON("error", ctx)
		return	
	}

	var theArticle model.Article

	if err := model.DB.First(&theArticle, id).Error; err != nil {
		SendErrJSON("无效的文章id", ctx)
		return
	}

	var count int

	if err := model.DB.Model(&model.TopArticle{}).Count(&count).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	if count >= model.MaxTopArticleCount {
		SendErrJSON("最多只能有" + strconv.Itoa(count) + "篇文章置顶", ctx)
		return
	}

	topArticle := model.TopArticle{
		ArticleID: theArticle.ID,
	}

	if err := model.DB.Save(&topArticle).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return	
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : topArticle,
	})
}

// DeleteTop 取消文章置顶
func DeleteTop(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var id int
	var idErr error
	if id, idErr = ctx.Params().GetInt("id"); idErr != nil {
		SendErrJSON("error", ctx)
		return	
	}

	var topArticle model.TopArticle

	if err := model.DB.Where("article_id = ?", id).Find(&topArticle).Error; err != nil {
		SendErrJSON("无效的文章id", ctx)
		return
	}

	if err := model.DB.Delete(&topArticle).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"articleID": id,
		},
	})
}

// Tops 所有置顶文章
func Tops(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var topArticles []model.TopArticle
	var articles []model.Article

	if err := model.DB.Order("created_at DESC").Find(&topArticles).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	for i := 0; i < len(topArticles); i++ {	
		var article model.Article
		if err := model.DB.Model(&topArticles[i]).Related(&article, "articles").Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", ctx)
			return
		}

		if err := model.DB.Model(&article).Related(&article.User, "users").Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", ctx)
			return
		}

		articles = append(articles, article)
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"articles": articles,
		},
	})
}

// Delete 删除文章
func Delete(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	// 删除文章，但其他用户对文章的评论保留
	// 其他用户对文章的点赞也保留
	var id int
	var idErr error
	if id, idErr = ctx.Params().GetInt("id"); idErr != nil {
		SendErrJSON("无效的id", ctx)
		return	
	}

	var article model.Article

	if err := model.DB.First(&article, id).Error; err != nil {
		SendErrJSON("无效的话题id", ctx)
		return
	}

	user, _ := manager.Sess.Start(ctx).Get("user").(model.User)

	if user.ID != article.UserID {
		SendErrJSON("您无权限执行此操作", ctx)
		return
	}

	if err := model.DB.Delete(&article).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"id": id,
		},
	})
}