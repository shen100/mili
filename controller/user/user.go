package user

import (
	"crypto/md5"
	"fmt"
	"strings"
	"strconv"
	"time"
	"gopkg.in/kataras/iris.v6"
	"golang123/model"
	"golang123/config"
	"golang123/controller/common"
	"golang123/controller/mail"
)

func sendActiveMail(user model.User, ctx *iris.Context) {
	apiPrefix := config.APIConfig.Prefix
	siteName  := config.ServerConfig.SiteName
	siteURL   := "https://" + config.ServerConfig.Host
	secretStr := fmt.Sprintf("%s%s", user.Email, user.Pass)
	secretStr  = fmt.Sprintf("%x", md5.Sum([]byte(secretStr)))
	activeURL := siteURL + apiPrefix + "/active/%d/{secretStr}"
	activeURL  = fmt.Sprintf(activeURL, user.ID)
	activeURL  = strings.Replace(activeURL, "{secretStr}", secretStr, -1)

	fmt.Println(activeURL)

	content := "<p>您好, " + user.Name + "</p>" +
        "<p>我们收到您在 " + siteName + " 的注册信息, 请点击下面的链接, 或粘贴到浏览器地址栏来激活帐号.</p>" +
        "<a href  = \"" + activeURL + "\">" + activeURL + "</a>" +
        "<p>若您没有在 " + siteName + " 填写过注册信息, 说明有人滥用了您的邮箱, 请删除此邮件, 我们对给您造成的打扰感到抱歉.</p>" +
        "<p>" + siteName + " 谨上.</p>";
	
	session := ctx.Session()
	session.Set("activeRemain" + strconv.Itoa(int(user.ID)), int(time.Now().Unix()))

	mail.SendMail(user.Email, "账号激活", content)
}

// Signin 用户登录
func Signin(ctx *iris.Context) {
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

	//golang123 todo: 检验邮箱，密码的有效性

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

type userReqData struct {
	Name      string  `json:"name"`
	Email     string  `json:"email"`
	Password  string  `json:"password"`
	RepeatPwd string  `json:"repeatPwd"`
}

func checkSignupData(userData userReqData, ctx *iris.Context) bool {
	SendErrJSON := common.SendErrJSON

	// golang123 todo: 完善 名称，密码，邮箱的检验
	if userData.Name == "" {
		SendErrJSON("用户名不能为空", ctx)
		return false
	}

	if userData.Email == "" {
		SendErrJSON("邮箱不能为空", ctx)
		return false
	}

	if userData.Password == "" {
		SendErrJSON("密码不能为空", ctx)
		return false
	}

	if userData.RepeatPwd == "" {
		SendErrJSON("确认密码不能为空", ctx)
		return false
	}

	if userData.Password != userData.RepeatPwd {
		SendErrJSON("两次输入的密码不一致", ctx)
		return false
	}
	return true
}

// Signup 用户注册
func Signup(ctx *iris.Context) {
	SendErrJSON := common.SendErrJSON
	var userData userReqData
	if err := ctx.ReadJSON(&userData); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	userData.Name      = strings.TrimSpace(userData.Name)
	userData.Email     = strings.TrimSpace(userData.Email)
	userData.Password  = strings.TrimSpace(userData.Password)
	userData.RepeatPwd = strings.TrimSpace(userData.RepeatPwd)

	if !checkSignupData(userData, ctx) {
		return
	}

	var user model.User
	if err := model.DB.Where("email = ? OR name = ?", userData.Email, userData.Name).Find(&user).Error; err == nil {	
		if user.Name == userData.Name {
			SendErrJSON("用户名已存在", ctx)
			return
		} else if user.Email == userData.Email {
			SendErrJSON("邮箱已存在", ctx)
			return	
		}	
	}

	var newUser model.User
	newUser.Name   = userData.Name
	newUser.Email  = userData.Email
	newUser.Pass   = newUser.EncryptPassword(userData.Password, newUser.Salt())
	newUser.Role   = model.UserRoleNormal
	newUser.Status = model.UserStatusInActive

	if err := model.DB.Create(&newUser).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	sendActiveMail(newUser, ctx)

	ctx.JSON(iris.StatusOK, iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : newUser.ToJSON(),
	})
}