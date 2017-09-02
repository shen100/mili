package user

import (
	"crypto/md5"
	"encoding/base64"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"math/rand"
	"time"
	"unicode/utf8"
	"github.com/kataras/iris"
	"github.com/asaskevich/govalidator"
	"github.com/microcosm-cc/bluemonday"
	"golang123/model"
	"golang123/config"
	"golang123/sessmanager"
	"golang123/controller/common"
	"golang123/controller/mail"
)

const (
	activeDuration = 24 * 60 * 60
	resetDuration  = 24 * 60 * 60
)

func sendMail(action string, title string, curTime int64, user model.User, ctx iris.Context) {
	siteName  := config.ServerConfig.SiteName
	siteURL   := "https://" + config.ServerConfig.Host
	secretStr := fmt.Sprintf("%d%s%s", curTime, user.Email, user.Pass)
	secretStr  = fmt.Sprintf("%x", md5.Sum([]byte(secretStr)))
	actionURL := siteURL + action + "/%d/%s"

	actionURL  = fmt.Sprintf(actionURL, user.ID, secretStr)

	fmt.Println(actionURL)

	content := "<p><b>亲爱的" + user.Name + ":</b></p>" +
        "<p>我们收到您在 " + siteName + " 的注册信息, 请点击下面的链接, 或粘贴到浏览器地址栏来激活帐号.</p>" +
        "<a href=\"" + actionURL + "\">" + actionURL + "</a>" +
        "<p>如果您没有在 " + siteName + " 填写过注册信息, 说明有人滥用了您的邮箱, 请删除此邮件, 我们对给您造成的打扰感到抱歉.</p>" +
		"<p>" + siteName + " 谨上.</p>";
		
	if action == "/reset" {
		content = "<p><b>亲爱的" + user.Name + ":</b></p>" +
        "<p>你的密码重设要求已经得到验证。请点击以下链接, 或粘贴到浏览器地址栏来设置新的密码: </p>" +
        "<a href=\"" + actionURL + "\">" + actionURL + "</a>" +
		"<p>感谢你对" + siteName + "的支持，希望你在" + siteName + "的体验有益且愉快。</p>" +
		"<p>(这是一封自动产生的email，请勿回复。)</p>"
	}
	content += "<p><img src=\"http://ab.testin.cn/images/go.jpg\" style=\"width: 120px;\"/></p>"
	//fmt.Println(content)
	
	mail.SendMail(user.Email, title, content)
}

func verifyLink(cacheKey string, duration int64, ctx iris.Context) (model.User, error) {
	var user model.User
	userID, err := ctx.Params().GetInt("id")
	if err != nil || userID <= 0 {
		return user, errors.New("无效的链接")
	}
	secret := ctx.Params().Get("secret")
	if secret == "" {
		return user, errors.New("无效的链接")
	}
	
	session       := sessmanager.Sess.Start(ctx)
	emailTime, ok := session.Get(cacheKey + fmt.Sprintf("%d", userID)).(int64)
	if !ok {
		return user, errors.New("链接已失效")	
	}
	curTime := time.Now().Unix()
	if curTime - emailTime > duration {
		return user, errors.New("链接已失效")	
	}

	if err := model.DB.First(&user, userID).Error; err != nil {
		return user, errors.New("无效的链接")		
	}

	secretStr := fmt.Sprintf("%d%s%s", emailTime, user.Email, user.Pass)
	secretStr  = fmt.Sprintf("%x", md5.Sum([]byte(secretStr)))

	if secret != secretStr {
		return user, errors.New("无效的链接")
	}
	return user, nil	
}

// ActiveSendMail 发送激活账号的邮件
func ActiveSendMail(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var user model.User
	if err := ctx.ReadJSON(&user); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}
	
	var decodeBytes []byte
	var decodedErr error
	if decodeBytes, decodedErr = base64.StdEncoding.DecodeString(user.Email); decodedErr != nil {
		SendErrJSON("参数无效", ctx)
		return	
	}
	user.Email = string(decodeBytes)

	if err := model.DB.Where("email = ?", user.Email).First(&user).Error; err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}
	curTime   := time.Now().Unix()
	go func() {
		sendMail("/active", "账号激活", curTime, user, ctx)
	}()

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"email": user.Email,
		},
	})
}

// VerifyActiveLink 验证激活账号的链接是否失效
func VerifyActiveLink(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	if _, err := verifyLink("activeTime", activeDuration, ctx); err != nil {
		fmt.Println(err.Error())
		SendErrJSON("激活链接已失效", ctx)
		return	
	}
	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{},
	})
}

// ActiveAccount 激活账号
func ActiveAccount(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var err error
	var user model.User
	if user, err = verifyLink("activeTime", activeDuration, ctx); err != nil {
		SendErrJSON("激活链接已失效", ctx)
		return
	}

	user.Status = model.UserStatusActived

	if err := model.DB.Save(&user).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : user,
	})
}

// ResetPasswordMail 发送重置密码的邮件
func ResetPasswordMail(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	type userReqData struct {
		Email     string  `json:"email"`
	}
	var userData userReqData
	if err := ctx.ReadJSON(&userData); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	var user model.User
	if err := model.DB.Where("email = ?", userData.Email).Find(&user).Error; err != nil {
		SendErrJSON("没有邮箱为" + userData.Email + "的用户", ctx)
		return
	}

	session := sessmanager.Sess.Start(ctx)
	curTime   := time.Now().Unix()
	session.Set(fmt.Sprintf("resetTime%d", user.ID), curTime)
	go func() {
		sendMail("/reset", "修改密码", curTime, user, ctx)
	}()

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{},
	})
}

// VerifyResetPasswordLink 验证重置密码的链接是否失效
func VerifyResetPasswordLink(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	if _, err := verifyLink("resetTime", resetDuration, ctx); err != nil {
		fmt.Println(err.Error())
		SendErrJSON("重置链接已失效", ctx)
		return	
	}
	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{},
	})
}

// ResetPassword 重置密码
func ResetPassword(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	type userReqData struct {
		Password  string  `json:"password" valid:"runelength(6|20)"`
	}
	var userData userReqData

	if err := ctx.ReadJSON(&userData); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	if _, err := govalidator.ValidateStruct(userData); err != nil {
		SendErrJSON("参数无效.", ctx)
		return
	}

	var err error
	var user model.User 
	if user, err = verifyLink("resetTime", resetDuration, ctx); err != nil {
		SendErrJSON("重置链接已失效", ctx)
		return	
	}

	user.Pass = user.EncryptPassword(userData.Password, user.Salt())

	if err := model.DB.Save(&user).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{},
	})
}

// Signin 用户登录
func Signin(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	type UserData struct {
		SigninInput string  `json:"signinInput" valid:"-"`
    	Password    string  `json:"password" valid:"runelength(6|20)"`
	}
	var userData UserData

	if err := ctx.ReadJSON(&userData); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	if _, err := govalidator.ValidateStruct(userData); err != nil {
		SendErrJSON("参数无效.", ctx)
		return
	}

	if userData.SigninInput == "" {
		SendErrJSON("用户名或邮箱不能为空", ctx)
		return	
	}

	if userData.Password == "" {
		SendErrJSON("密码不能为空", ctx)
		return	
	}

	var sql, msg string
	var queryUser model.User
	if strings.Index(userData.SigninInput, "@") != -1 {
		if !govalidator.IsEmail(userData.SigninInput) || len(userData.SigninInput) < 5 ||
				len(userData.SigninInput) > 50 {
			SendErrJSON("不是有效的邮箱", ctx)
			return	
		}
		sql = "email = ?"
		msg = "邮箱或密码错误"
	} else {
		if len(userData.SigninInput) < 4 || len(userData.SigninInput) > 20 {
			SendErrJSON("用户名或密码错误", ctx)
			return	
		}
		sql = "name = ?"
		msg = "用户名或密码错误"
	}

	if err := model.DB.Where(sql, userData.SigninInput).Find(&queryUser).Error; err != nil {
		SendErrJSON(msg, ctx)
		return
	}

	if queryUser.CheckPassword(userData.Password) {
		if queryUser.Status == model.UserStatusInActive {
			encodedEmail := base64.StdEncoding.EncodeToString([]byte(queryUser.Email))
			ctx.JSON(iris.Map{
				"errNo" : model.ErrorCode.InActive,
				"msg"   : "账号未激活",
				"data"  : iris.Map{
					"email": encodedEmail,
				},
			})
			return	
		}
		sessmanager.Sess.Start(ctx).Set("user", queryUser)
		sessmanager.Sess.ShiftExpiration(ctx)
		ctx.JSON(iris.Map{
			"errNo" : model.ErrorCode.SUCCESS,
			"msg"   : "success",
			"data"  : queryUser,
		})
	} else {
		SendErrJSON(msg, ctx)
		return	
	}
}

// Signup 用户注册
func Signup(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	reqStartTime := time.Now()
	type userReqData struct {
		Name      string  `json:"name" valid:"runelength(4|20)"`
		Email     string  `json:"email" valid:"email,runelength(5|50)"`
		Password  string  `json:"password" valid:"runelength(6|20)"`
	}
	var userData userReqData
	if err := ctx.ReadJSON(&userData); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	if _, err := govalidator.ValidateStruct(userData); err != nil {
		SendErrJSON("参数无效.", ctx)
		return
	}

	userData.Name      = strings.TrimSpace(userData.Name)
	userData.Email     = strings.TrimSpace(userData.Email)

	checkSignupData := func(userData userReqData, ctx iris.Context) bool {
		if strings.Index(userData.Name, "@") != -1 {
			SendErrJSON("用户名中不能含有@字符", ctx)
			return false	
		}
		return true
	}

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
	newUser.Name      = userData.Name
	newUser.Email     = userData.Email
	newUser.Pass      = newUser.EncryptPassword(userData.Password, newUser.Salt())
	newUser.Role      = model.UserRoleNormal
	newUser.Status    = model.UserStatusInActive
	newUser.Sex       = model.UserSexMale
	newUser.AvatarURL = "/images/avatar/" + strconv.Itoa(rand.Intn(2)) + ".png"

	if err := model.DB.Create(&newUser).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	curTime   := time.Now().Unix()
	session   := sessmanager.Sess.Start(ctx)
	session.Set(fmt.Sprintf("activeTime%d", newUser.ID), curTime)
	go func() {
		sendMail("/active", "账号激活", curTime, newUser, ctx)
	}()

	fmt.Println("signup duration: ", time.Now().Sub(reqStartTime).Seconds())

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : newUser,
	})
}

// Signout 退出登录
func Signout(ctx iris.Context) {
	session := sessmanager.Sess.Start(ctx)
	session.Set("user", nil)
	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{},
	})
}

// UpdateInfo 更新用户信息
func UpdateInfo(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	field := ctx.Params().Get("field")
	switch field {
		
	}
		

	var userReqData model.User
	if err := ctx.ReadJSON(&userReqData); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}
	userReqData.Signature = strings.TrimSpace(userReqData.Signature)
	userReqData.Signature = bluemonday.UGCPolicy().Sanitize(userReqData.Signature)

	// 个性签名可以为空
	if utf8.RuneCountInString(userReqData.Signature) > model.UserSignatureMaxLen {
		SendErrJSON("个性签名不能超过" + fmt.Sprintf("%d", model.UserSignatureMaxLen) + "个字符", ctx)
		return
	}
	user, _ := sessmanager.Sess.Start(ctx).Get("user").(model.User)
	if err := model.DB.Model(&user).Update("signature", userReqData.Signature).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}
	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"id" : user.ID,
			"signature": user.Signature,
		},
	})
}

// UpdatePassword 更新用户密码
func UpdatePassword(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	type userReqData struct {
		Password  string  `json:"password" valid:"runelength(6|20)"`
		NewPwd    string  `json:"newPwd" valid:"runelength(6|20)"`
	}
	var userData userReqData
	if err := ctx.ReadJSON(&userData); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	_, err := govalidator.ValidateStruct(userData)
	if err != nil {
		SendErrJSON("参数无效.", ctx)
		return
	}

	user, _ := sessmanager.Sess.Start(ctx).Get("user").(model.User)

	if err := model.DB.First(&user, user.ID).Error; err != nil {
		SendErrJSON("error", ctx)
		return	
	}

	if user.CheckPassword(userData.Password) {
		user.Pass = user.EncryptPassword(userData.NewPwd, user.Salt())	
		if err := model.DB.Save(&user).Error; err != nil {
			SendErrJSON("原密码不正确", ctx)
			return
		}
		ctx.JSON(iris.Map{
			"errNo" : model.ErrorCode.SUCCESS,
			"msg"   : "success",
			"data"  : iris.Map{},
		})
	} else {
		SendErrJSON("原密码错误", ctx)
		return	
	}
}

// PublicInfo 用户公开的信息
func PublicInfo(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var userID int
	var idErr error

	if userID, idErr = ctx.Params().GetInt("id"); idErr != nil {
		fmt.Println(idErr.Error())
		SendErrJSON("无效的ID", ctx)
		return
	}
	var user model.User
	if err := model.DB.First(&user, userID).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("无效的ID", ctx)
		return
	}
	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"user": user.PublicInfo(),
		},
	})
}

// Info 返回用户信息
func Info(ctx iris.Context) {
	user, _ := sessmanager.Sess.Start(ctx).Get("user").(model.User)

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"user": user,
		},
	})
}

// InfoDetail 返回用户详情信息
func InfoDetail(ctx iris.Context) {
	user, _ := sessmanager.Sess.Start(ctx).Get("user").(model.User)

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"user": user,
		},
	})
}

func topN(n int, ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var users []model.User
	if err := model.DB.Order("score DESC").Limit(n).Find(&users).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
	} else {	
		ctx.JSON(iris.Map{
			"errNo" : model.ErrorCode.SUCCESS,
			"msg"   : "success",
			"data"  : iris.Map{
				"users": users,
			},
		})
	}
}

// Top10 返回积分排名前10的用户
func Top10(ctx iris.Context) {
	topN(10, ctx)
}

// Top100 返回积分排名前100的用户
func Top100(ctx iris.Context) {
	topN(100, ctx)
}

// AddCareer 添加职业经历
func AddCareer(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var career model.Career
	if err := ctx.ReadJSON(&career); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	career.Company = strings.TrimSpace(career.Company)
	career.Company = bluemonday.UGCPolicy().Sanitize(career.Company)
	career.Title   = strings.TrimSpace(career.Title)
	career.Title   = bluemonday.UGCPolicy().Sanitize(career.Title)

	if career.Company == "" {
		SendErrJSON("公司或组织名称不能为空", ctx)
		return
	}

	if utf8.RuneCountInString(career.Company) > model.CareerMaxCompanyLen {
		SendErrJSON("公司或组织名称不能超过" + fmt.Sprintf("%d", model.CareerMaxCompanyLen) + "个字符", ctx)
		return	
	}

	if career.Title == "" {
		SendErrJSON("职位不能为空", ctx)
		return
	}

	if utf8.RuneCountInString(career.Title) > model.CareerMaxTitleLen {
		SendErrJSON("职位不能超过" + fmt.Sprintf("%d", model.CareerMaxTitleLen) + "个字符", ctx)
		return	
	}

	session := sessmanager.Sess.Start(ctx)
	user    := session.Get("user").(model.User)
	career.UserID = user.ID

	if err := model.DB.Create(&career).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : career,
	})
}

// AddSchool 添加教育经历
func AddSchool(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var school model.School
	if err := ctx.ReadJSON(&school); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	school.Name       = strings.TrimSpace(school.Name)
	school.Name       = bluemonday.UGCPolicy().Sanitize(school.Name)
	school.Speciality = strings.TrimSpace(school.Speciality)
	school.Speciality = bluemonday.UGCPolicy().Sanitize(school.Speciality)

	if school.Name == "" {
		SendErrJSON("学校或教育机构名不能为空", ctx)
		return
	}

	if utf8.RuneCountInString(school.Name) > model.SchoolMaxNameLen {
		SendErrJSON("学校或教育机构名不能超过" + fmt.Sprintf("%d", model.SchoolMaxNameLen) + "个字符", ctx)
		return	
	}

	if school.Speciality == "" {
		SendErrJSON("专业方向不能为空", ctx)
		return
	}

	if utf8.RuneCountInString(school.Speciality) > model.SchoolMaxSpecialityLen {
		SendErrJSON("专业方向不能超过" + fmt.Sprintf("%d", model.SchoolMaxSpecialityLen) + "个字符", ctx)
		return	
	}

	session := sessmanager.Sess.Start(ctx)
	user    := session.Get("user").(model.User)
	school.UserID = user.ID

	if err := model.DB.Create(&school).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : school,
	})
}

// DeleteCareer 删除职业经历
func DeleteCareer(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var id int
	var idErr error
	if id, idErr = ctx.Params().GetInt("id"); idErr != nil {
		SendErrJSON("无效的id", ctx)
		return	
	}
	var career model.Career
	if err := model.DB.First(&career, id).Error; err != nil {
		SendErrJSON("无效的id.", ctx)
		return
	}

	if err := model.DB.Delete(&career).Error; err != nil {
		SendErrJSON("error", ctx)
		return	
	}
	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"id": career.ID,
		},
	})
}

// DeleteSchool 删除教育经历
func DeleteSchool(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var id int
	var idErr error
	if id, idErr = ctx.Params().GetInt("id"); idErr != nil {
		SendErrJSON("无效的id", ctx)
		return	
	}
	var school model.School
	if err := model.DB.First(&school, id).Error; err != nil {
		SendErrJSON("无效的id.", ctx)
		return
	}

	if err := model.DB.Delete(&school).Error; err != nil {
		SendErrJSON("error", ctx)
		return	
	}
	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"id": school.ID,
		},
	})
}