package vote

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"
	"github.com/jinzhu/gorm"
	"gopkg.in/kataras/iris.v6"
	"golang123/config"
	"golang123/model"
	"golang123/controller/common"
)

func save(isEdit bool, vote model.Vote, tx *gorm.DB, ctx *iris.Context) (model.Vote, error) {
	var queryVote model.Vote
	if isEdit {
		if err := tx.First(&queryVote, vote.ID).Error; err != nil {
			return vote, errors.New("无效的ID")
		}
	} else {
		session        := ctx.Session();
		user           := session.Get("user").(model.User)
		vote.UserID     = user.ID	
	}
   
	if isEdit {
		if queryVote.Status == model.VoteOver {
			return vote, errors.New("投票已结束，不能再进行编辑")	
		}
		vote.BrowseCount  = queryVote.BrowseCount
		vote.CommentCount = queryVote.CommentCount
		vote.Status       = queryVote.Status
		vote.CreatedAt    = queryVote.CreatedAt
		vote.UpdatedAt    = model.JSONTime(time.Now())
		vote.UserID       = queryVote.UserID
	} else {
		vote.BrowseCount  = 0
		vote.CommentCount = 0
		vote.Status       = model.VoteUnderway
		vote.CreatedAt    = model.JSONTime(time.Now())
	}

	vote.Name    = strings.TrimSpace(vote.Name)
	vote.Content = strings.TrimSpace(vote.Content)

	if (vote.Name == "") {
		return vote, errors.New("名称不能为空")	
	}
	
	if utf8.RuneCountInString(vote.Name) > config.ServerConfig.MaxNameLen {
		msg := "名称不能超过" + strconv.Itoa(config.ServerConfig.MaxNameLen) + "个字符"
		return vote, errors.New(msg)	
	}
	
	if vote.Content == "" || utf8.RuneCountInString(vote.Content) <= 0 {
		return vote, errors.New("内容不能为空")
	}
	
	if utf8.RuneCountInString(vote.Content) > config.ServerConfig.MaxContentLen {	
		msg := "内容不能超过" + strconv.Itoa(config.ServerConfig.MaxContentLen) + "个字符"	
		return vote, errors.New(msg)
	}

	if time.Time(vote.CreatedAt).Unix() >= time.Time(vote.EndAt).Unix() {
		return vote, errors.New("结束时间要大于创建时间")	
	}

	if isEdit {
		if err := tx.Save(&vote).Error; err != nil {
			fmt.Println(err.Error())
			return vote, errors.New("error")		
		}
	} else {
		if err := tx.Create(&vote).Error; err != nil {
			fmt.Println(err.Error())
			return vote, errors.New("error")
		}
	}
	return vote, nil
}

// Create 创建投票
func Create(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	var voteErr error
	var vote model.Vote
	type ReqData struct {
		Vote      model.Vote        `json:"vote"`
		VoteItems []model.VoteItem  `json:"voteItems"`
	}
	var reqData ReqData
	if err := ctx.ReadJSON(&reqData); err != nil {
		fmt.Println(err.Error())
		SendErrJSON("参数无效", ctx)
		return
	}
	if len(reqData.VoteItems) < 2 {
		SendErrJSON("至少要添加两个投票项", ctx)
		return	
	}

	tx := model.DB.Begin()
	if vote, voteErr = save(false, reqData.Vote, tx, ctx); voteErr != nil {
		tx.Rollback()
		SendErrJSON(voteErr.Error(), ctx)
		return
	}
	for i := 0; i < len(reqData.VoteItems); i++ {
		var voteItem model.VoteItem
		var err error
		reqData.VoteItems[i].Count  = 0
		reqData.VoteItems[i].VoteID = vote.ID
		if voteItem, err = saveVoteItem(reqData.VoteItems[i], tx); err != nil {
			tx.Rollback()
			SendErrJSON(err.Error(), ctx)
			return
		}
		vote.VoteItems = append(vote.VoteItems, voteItem);
	}
	tx.Commit()
	ctx.JSON(iris.StatusOK, iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : vote,
	})
}

// Update 更新投票
func Update(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	var vote model.Vote
	if err := ctx.ReadJSON(&vote); err != nil {
		fmt.Println(err.Error())
		SendErrJSON("参数无效", ctx)
		return
	}
	var voteErr error
	tx := model.DB.Begin()
	if vote, voteErr = save(true, vote, tx, ctx); voteErr != nil {
		tx.Rollback()
		SendErrJSON(voteErr.Error(), ctx)
		return
	}
	tx.Commit()
	ctx.JSON(iris.StatusOK, iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : vote,
	})
}

// Info 查询投票
func Info(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	voteID, idErr := ctx.ParamInt("id")
	if idErr != nil {
		fmt.Println(idErr.Error())
		SendErrJSON("无效的ID", ctx)
		return
	}
	var vote model.Vote
	if err := model.DB.First(&vote, voteID).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("无效的ID", ctx)
		return
	}

	if err := model.DB.Model(&vote).Related(&vote.VoteItems, "vote_items").Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}
	ctx.JSON(iris.StatusOK, iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : vote,
	})
}

// Delete 删除投票
func Delete(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	voteID, idErr := ctx.ParamInt("id")
	if idErr != nil {
		fmt.Println(idErr.Error())
		SendErrJSON("无效的ID", ctx)
		return
	}
	var vote model.Vote
	if err := model.DB.First(&vote, voteID).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("无效的ID", ctx)
		return
	}

	tx := model.DB.Begin()
	if err := tx.Delete(&vote).Error; err != nil {
		tx.Rollback()
		SendErrJSON("error", ctx)
		return
	}
	if err := tx.Exec("DELETE FROM vote_items WHERE vote_id = ?", vote.ID).Error; err != nil {
		tx.Rollback()
		SendErrJSON("error", ctx)
		return	
	}
	if err := tx.Exec("DELETE FROM user_votes WHERE vote_id = ?", vote.ID).Error; err != nil {
		tx.Rollback()
		SendErrJSON("error", ctx)
		return	
	}
	tx.Commit()
	ctx.JSON(iris.StatusOK, iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"voteID": vote.ID,
		},
	})
}

func saveVoteItem(voteItem model.VoteItem, tx *gorm.DB) (model.VoteItem, error) {
	voteItem.Name = strings.TrimSpace(voteItem.Name)

	if (voteItem.Name == "") {
		return voteItem, errors.New("名称不能为空")
	}
	
	if utf8.RuneCountInString(voteItem.Name) > config.ServerConfig.MaxNameLen {
		msg := "名称不能超过" + strconv.Itoa(config.ServerConfig.MaxNameLen) + "个字符"
		return voteItem, errors.New(msg)
	}
	var vote model.Vote
	if err := tx.First(&vote, voteItem.VoteID).Error; err != nil {
		fmt.Println(err.Error())
		return voteItem, errors.New("无效的voteID")
	}
	if vote.Status == model.VoteOver {
		return voteItem, errors.New("投票已结束, 不能添加投票项")	
	}
	if err := tx.Save(&voteItem).Error; err != nil {
		fmt.Println(err.Error())
		return voteItem, errors.New("error")		
	}
	return voteItem, nil
}

// CreateVoteItem 创建投票项
func CreateVoteItem(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	var voteItem model.VoteItem
	if err := ctx.ReadJSON(&voteItem); err != nil {
		fmt.Println(err.Error())
		SendErrJSON("参数无效", ctx)
		return
	}
	var itemErr error
	tx := model.DB.Begin()
	if voteItem, itemErr = saveVoteItem(voteItem, tx); itemErr != nil {
		tx.Rollback()
		SendErrJSON(itemErr.Error(), ctx)
		return	
	}
	tx.Commit()
	ctx.JSON(iris.StatusOK, iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : voteItem,
	})
}

// DeleteVoteItem 删除投票项
func DeleteVoteItem(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	voteItemID, idErr := ctx.ParamInt("id")
	if idErr != nil {
		fmt.Println(idErr.Error())
		SendErrJSON("无效的ID", ctx)
		return
	}
	var voteItem model.VoteItem
	if err := model.DB.First(&voteItem, voteItemID).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("无效的ID", ctx)
		return
	}

	var vote model.Vote
	if err := model.DB.Model(&voteItem).Related(&vote).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}
	if vote.Status == model.VoteUnderway {
		SendErrJSON("投票进行中，不能删除投票项", ctx)
		return	
	}
	if vote.Status == model.VoteOver {
		SendErrJSON("投票已结束，不能删除投票项", ctx)
		return	
	}

	if err := model.DB.Delete(&voteItem).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}
	ctx.JSON(iris.StatusOK, iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"voteItemID": voteItem.ID,
		},
	})
}

// UserVoteVoteItem 用户投了一票
func UserVoteVoteItem(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	voteItemID, idErr := ctx.ParamInt("id")
	if idErr != nil {
		fmt.Println(idErr.Error())
		SendErrJSON("无效的ID", ctx)
		return
	}
	var voteItem model.VoteItem
	if err := model.DB.First(&voteItem, voteItemID).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("无效的ID", ctx)
		return
	}
	var vote model.Vote
	if err := model.DB.Model(&voteItem).Related(&vote).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}
	if vote.Status == model.VoteOver {
		SendErrJSON("投票已结束", ctx)
		return	
	}
	voteItem.Count++
	if err := model.DB.Save(&voteItem).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return	
	}
	session  := ctx.Session();
	user     := session.Get("user").(model.User)
	userVote := model.UserVote{
		UserID     : user.ID,
		VoteID     : voteItem.VoteID,
		VoteItemID : voteItem.ID,
	}
	if err := model.DB.Save(&userVote).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return	
	}
	ctx.JSON(iris.StatusOK, iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{},
	})
}

