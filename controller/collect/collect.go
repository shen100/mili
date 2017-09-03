package collect

import (
	"fmt"
	"strings"
	"unicode/utf8"
	"github.com/kataras/iris"
	"github.com/microcosm-cc/bluemonday"
	"golang123/model"
	"golang123/sessmanager"
	"golang123/controller/common"
)

// Collect 收藏文章或收藏投票
func Collect(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var collect model.Collect
	var article model.Article
	var vote model.Vote

	if err := ctx.ReadJSON(&collect); err != nil {
		fmt.Println(err.Error())
		SendErrJSON("参数无效", ctx)
		return
	}

	if collect.SourceName != model.CollectSourceArticle && collect.SourceName != model.CollectSourceVote {
		SendErrJSON("sourceName无效", ctx)
		return
	}

	if collect.SourceName == model.CollectSourceArticle {
		if err := model.DB.First(&article, collect.SourceID).Error; err != nil {
			SendErrJSON("无效的sourceID", ctx)
			return	
		}
	}

	if collect.SourceName == model.CollectSourceVote {
		if err := model.DB.First(&vote, collect.SourceID).Error; err != nil {
			SendErrJSON("无效的sourceID", ctx)
			return	
		}
	}

	if err := model.DB.First(&collect.Folder, collect.FolderID).Error; err != nil {
		SendErrJSON("无效的收藏夹id", ctx)
		return
	}

	var collects []model.Collect
	if err := model.DB.Where("source_id = ? AND source_name =?", collect.SourceID, collect.SourceName).Find(&collects).Error; err == nil {
		for i := 0; i < len(collects); i++ {
			if err := model.DB.Model(&collects[i]).Related(&collects[i].Folder, "folders").Error; err != nil {
				SendErrJSON("error", ctx)
				return	
			}
			if collects[i].FolderID == collect.FolderID {
				// 在相同的收藏夹下，之前已经收藏过
				ctx.JSON(iris.Map{
					"errNo" : model.ErrorCode.SUCCESS,
					"msg"   : "success",
					"data"  : iris.Map{
						"id": collects[i].ID,
					},
				})
				return
			}
		}
	}

	user, _ := sessmanager.Sess.Start(ctx).Get("user").(model.User)
	collect.UserID = user.ID

	if err := model.DB.Save(&collect).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}

	if err := model.DB.Model(&user).Update("collect_count", user.CollectCount + 1).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return	
	}
	sessmanager.Sess.Start(ctx).Set("user", user)

	if collect.SourceName == model.CollectSourceArticle {
		if err := model.DB.Model(&article).Update("collect_count", article.CollectCount + 1).Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", ctx)
			return	
		}
		if err := model.DB.Model(&article).Related(&article.User).Error; err != nil {
			SendErrJSON("error", ctx)
			return
		}
		// 自己收藏自己的话题，积分不增加
		if article.User.ID != user.ID {
			if err := model.DB.Model(&article.User).Update("score", article.User.Score + model.ByCollectScore).Error; err != nil {
				fmt.Println(err.Error())
				SendErrJSON("error", ctx)
				return	
			}
		}
	}

	if collect.SourceName == model.CollectSourceVote {
		if err := model.DB.Model(&vote).Update("collect_count", vote.CollectCount + 1).Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", ctx)
			return	
		}
		if err := model.DB.Model(&vote).Related(&vote.User).Error; err != nil {
			SendErrJSON("error", ctx)
			return
		}
		// 自己收藏自己的投票，积分不增加
		if vote.User.ID != user.ID {
			if err := model.DB.Model(&vote.User).Update("score", vote.User.Score + model.ByCollectScore).Error; err != nil {
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
			"id": collect.ID,
		},
	})
}

// DeleteCollect 删除收藏
func DeleteCollect(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var collect model.Collect
	collectID, idErr := ctx.Params().GetInt("id")
	if idErr != nil {
		SendErrJSON("无效的ID", ctx)
		return
	}

	if err := model.DB.First(&collect, collectID).Error; err != nil {
		SendErrJSON("无效的id", ctx)
		return
	}
	if err := model.DB.Delete(&collect).Error; err != nil {
		SendErrJSON("error", ctx)
		return	
	}
	
	user, _ := sessmanager.Sess.Start(ctx).Get("user").(model.User)

	if err := model.DB.First(&user, user.ID).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}
	user.CollectCount--
	if err := model.DB.Model(&user).Update("collect_count", user.CollectCount).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}
	sessmanager.Sess.Start(ctx).Set("user", user)

	// 删除收藏后，相关积分保持不变
	if collect.SourceName == model.CollectSourceArticle {
		var article model.Article
		if err := model.DB.First(&article, collect.SourceID).Error; err != nil {
			SendErrJSON("error", ctx)
			return	
		}
		if err := model.DB.Model(&article).Update("collect_count", article.CollectCount - 1).Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", ctx)
			return	
		}
	}

	if collect.SourceName == model.CollectSourceVote {
		var vote model.Vote
		if err := model.DB.Model(&vote).Update("collect_count", vote.CollectCount - 1).Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", ctx)
			return	
		}
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{},
	})
}

// List 查询用户已收藏的文章
func List(ctx iris.Context) {
// 	SendErrJSON := common.SendErrJSON
// 	var collects []model.Collect
// 	var pageNo int
// 	var err error

// 	if pageNo, err = strconv.Atoi(ctx.FormValue("pageNo")); err != nil {
// 		pageNo = 1
// 		err    = nil
// 	}
 
// 	if pageNo < 1 {
// 		pageNo = 1
// 	}

// 	offset   := (pageNo - 1) * config.ServerConfig.PageSize
// 	pageSize := config.ServerConfig.PageSize

// 	//默认按收藏时间，降序来排序
// 	var orderField = "created_at"
// 	var orderASC   = "DESC"
// 	if ctx.FormValue("asc") == "1" {
// 		orderASC = "ASC"
// 	} else {
// 		orderASC = "DESC"	
// 	}

// 	orderStr := orderField + " " + orderASC

// 	err = model.DB.Offset(offset).Limit(pageSize).Order(orderStr).Find(&collects).Error

// 	if err != nil {
// 		fmt.Println(err.Error())
// 		SendErrJSON("error", ctx)
// 		return
// 	}
// 	for i := 0; i < len(collects); i++ {
// 		if err = model.DB.Model(&collects[i]).Related(&collects[i].Article, "articles").Error; err != nil {
// 			fmt.Println(err.Error())
// 			SendErrJSON("error", ctx)
// 			return
// 		}
// 	}

// 	ctx.JSON(iris.Map{
// 		"errNo" : model.ErrorCode.SUCCESS,
// 		"msg"   : "success",
// 		"data"  : iris.Map{
// 			"collects": collects,
// 		},
// 	})
}

// CreateFolder 创建收藏夹
func CreateFolder(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON

	var folder model.Folder
	if err := ctx.ReadJSON(&folder); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	folder.Name = strings.TrimSpace(folder.Name)
	folder.Name = bluemonday.UGCPolicy().Sanitize(folder.Name)

	if folder.Name == "" {
		SendErrJSON("收藏夹名称不能为空", ctx)
		return
	}

	if utf8.RuneCountInString(folder.Name) > model.MaxNameLen {
		SendErrJSON("收藏夹名称不能超过" + fmt.Sprintf("%d", model.MaxNameLen) + "个字符", ctx)
		return
	}

	if folder.ParentID != model.NoParent {
		var parentFolder model.Folder
		if err := model.DB.First(&parentFolder, folder.ParentID).Error; err != nil {
			SendErrJSON("无效的parentID", ctx)
			return
		}
	}

	user := sessmanager.Sess.Start(ctx).Get("user").(model.User)
	folder.UserID = user.ID

	if err := model.DB.Create(&folder).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : folder,
	})
}

