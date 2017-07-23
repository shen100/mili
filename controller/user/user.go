package user

import (
	"gopkg.in/kataras/iris.v6"
	"golang123/model"
	"golang123/controller/common"
)

// Login 用户登录
func Login(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	type UserData struct {
		Email    string  `json:"email"`
    	Password string  `json:"password"`
	}
	var userData UserData

	if err := ctx.ReadJSON(&userData); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	//todo: 检验邮箱，密码的有效性

	if userData.Email == "" {
		SendErrJSON("邮箱不能为空", ctx)
		return	
	}

	if userData.Password == "" {
		SendErrJSON("密码不能为空", ctx)
		return	
	}

	var queryUser model.User
	if err := model.DB.Where("email = ?", userData.Email).Find(&queryUser).Error; err != nil {
		SendErrJSON("邮箱或密码错误", ctx)
		return
	}

	if queryUser.CheckPassword(userData.Password) {
		session := ctx.Session()
		session.Set("user", queryUser)
		ctx.JSON(iris.StatusOK, iris.Map{
			"errNo" : model.ErrorCode.SUCCESS,
			"msg"   : "success",
			"data"  : queryUser.ToJSON(),
		})
	} else {
		SendErrJSON("邮箱或密码错误", ctx)
		return	
	}
}