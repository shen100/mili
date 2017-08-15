package vote

import (
	"fmt"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"
	"gopkg.in/kataras/iris.v6"
	"golang123/config"
	"golang123/model"
	"golang123/controller/common"
)

func save(isEdit bool, ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	type ReqData struct {
		StartAt        uint    `json:"startAt"`
		EndAt          uint    `json:"endAt"`
		Name           string  `json:"name"`
		Content        string  `json:"content"`
	}
	var reqData ReqData
	if err := ctx.ReadJSON(&reqData); err != nil {
		fmt.Println(err.Error())
		SendErrJSON("参数无效", ctx)
		return
	}
	var vote model.Vote
	vote.Name    = reqData.Name
	vote.Content = reqData.Content
	vote.StartAt = time.Unix(int64(reqData.StartAt), 0)
	vote.EndAt   = time.Unix(int64(reqData.EndAt), 0)

	var queryVote model.Vote
	if isEdit {
		if err := model.DB.First(&queryVote, vote.ID).Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("无效的ID", ctx)
			return
		}
	}

	session        := ctx.Session();
	user           := session.Get("user").(model.User)
	vote.UserID     = user.ID

	if isEdit {
		vote.BrowseCount  = queryVote.BrowseCount
		vote.CommentCount = queryVote.CommentCount
		vote.Status       = queryVote.Status
		vote.CreatedAt    = queryVote.CreatedAt
		vote.UpdatedAt    = time.Now()
	} else {
		vote.BrowseCount  = 0
		vote.CommentCount = 0
		vote.Status       = model.VoteNotStarted
	}

	vote.Name    = strings.TrimSpace(vote.Name)
	vote.Content = strings.TrimSpace(vote.Content)

	if (vote.Name == "") {
		SendErrJSON("名称不能为空", ctx)
		return
	}
	
	if utf8.RuneCountInString(vote.Name) > config.ServerConfig.MaxNameLen {
		msg := "名称不能超过" + strconv.Itoa(config.ServerConfig.MaxNameLen) + "个字符"
		SendErrJSON(msg, ctx)
		return
	}
	
	if vote.Content == "" || utf8.RuneCountInString(vote.Content) <= 0 {
		SendErrJSON("内容不能为空", ctx)
		return
	}
	
	if utf8.RuneCountInString(vote.Content) > config.ServerConfig.MaxContentLen {	
		msg := "内容不能超过" + strconv.Itoa(config.ServerConfig.MaxContentLen) + "个字符"	
		SendErrJSON(msg, ctx)
		return
	}

	if vote.StartAt.Unix() <= time.Now().Unix() {
		SendErrJSON("开始时间要大于当前时间", ctx)
		return	
	}

	if vote.StartAt.Unix() >= vote.EndAt.Unix() {
		SendErrJSON("结束时间要大于开始时间", ctx)
		return
	}

	if isEdit {
		if err := model.DB.Save(&vote).Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", ctx)
			return	
		}
		ctx.JSON(iris.StatusOK, iris.Map{
			"errNo" : model.ErrorCode.SUCCESS,
			"msg"   : "success",
			"data"  : vote,
		})
	} else {
		if err := model.DB.Create(&vote).Error; err != nil {
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
}

// Create 创建投票
func Create(ctx *iris.Context) {
	save(false, ctx);
	// todo 保存 VoteItem
}

// Update 更新投票
func Update(ctx *iris.Context) {
	save(true, ctx);	
}

