package user

import (
	"encoding/base64"
	"strings"

	"github.com/asaskevich/govalidator"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/shen100/golang123/config"
	"github.com/shen100/golang123/controller/common"
	"github.com/shen100/golang123/model"
	"github.com/shen100/golang123/utils"
)

const (
	activeDuration = 24 * 60 * 60
	resetDuration  = 24 * 60 * 60
)

/*
func sendMail(action string, title string, curTime int64, user model.User, ctx iris.Context) {
	siteName := config.ServerConfig.SiteName
	siteURL := "https://" + config.ServerConfig.Host
	secretStr := fmt.Sprintf("%d%s%s", curTime, user.Email, user.Pass)
	secretStr = fmt.Sprintf("%x", md5.Sum([]byte(secretStr)))
	actionURL := siteURL + action + "/%d/%s"

	actionURL = fmt.Sprintf(actionURL, user.ID, secretStr)

	fmt.Println(actionURL)

	content := "<p><b>亲爱的" + user.Name + ":</b></p>" +
		"<p>我们收到您在 " + siteName + " 的注册信息, 请点击下面的链接, 或粘贴到浏览器地址栏来激活帐号.</p>" +
		"<a href=\"" + actionURL + "\">" + actionURL + "</a>" +
		"<p>如果您没有在 " + siteName + " 填写过注册信息, 说明有人滥用了您的邮箱, 请删除此邮件, 我们对给您造成的打扰感到抱歉.</p>" +
		"<p>" + siteName + " 谨上.</p>"

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


func verifyLink(cacheKey string, ctx iris.Context) (model.User, error) {
	var user model.User
	userID, err := ctx.Params().GetInt("id")
	if err != nil || userID <= 0 {
		return user, errors.New("无效的链接")
	}
	secret := ctx.Params().Get("secret")
	if secret == "" {
		return user, errors.New("无效的链接")
	}

	emailTime, redisErr := redis.Int64(manager.C.Do("GET", cacheKey+fmt.Sprintf("%d", userID)))
	if redisErr != nil {
		return user, errors.New("无效的链接")
	}

	if err := model.DB.First(&user, userID).Error; err != nil {
		return user, errors.New("无效的链接")
	}

	secretStr := fmt.Sprintf("%d%s%s", emailTime, user.Email, user.Pass)
	secretStr = fmt.Sprintf("%x", md5.Sum([]byte(secretStr)))

	if secret != secretStr {
		fmt.Println(secret, secretStr)
		return user, errors.New("无效的链接")
	}
	return user, nil
}

// ActiveSendMail 发送激活账号的邮件
func ActiveSendMail(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	type ReqData struct {
		Email string `json:"email"`
	}
	var reqData ReqData
	// 只接收一个email参数
	if err := ctx.ReadJSON(&reqData); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	var user model.User
	user.Email = reqData.Email

	var decodeBytes []byte
	var decodedErr error
	if decodeBytes, decodedErr = base64.StdEncoding.DecodeString(user.Email); decodedErr != nil {
		SendErrJSON("参数无效", ctx)
		return
	}
	user.Email = string(decodeBytes)

	if err := model.DB.Where("email = ?", user.Email).First(&user).Error; err != nil {
		SendErrJSON("无效的邮箱", ctx)
		return
	}

	curTime := time.Now().Unix()
	activeUser := fmt.Sprintf("%s%d", model.ActiveTime, user.ID)
	if _, err := manager.C.Do("SET", activeUser, curTime, "EX", activeDuration); err != nil {
		fmt.Println("redis set failed:", err)
	}
	go func() {
		sendMail("/active", "账号激活", curTime, user, ctx)
	}()

	ctx.JSON(iris.Map{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": iris.Map{
			"email": user.Email,
		},
	})
}

// ActiveAccount 激活账号
func ActiveAccount(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var err error
	var user model.User
	if user, err = verifyLink(model.ActiveTime, ctx); err != nil {
		SendErrJSON("激活链接已失效", ctx)
		return
	}

	if user.ID <= 0 {
		SendErrJSON("激活链接已失效", ctx)
		return
	}

	if err := model.DB.Model(&user).Update("status", model.UserStatusActived).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	if _, err := manager.C.Do("DEL", fmt.Sprintf("%s%d", model.ActiveTime, user.ID)); err != nil {
		fmt.Println("redis delelte failed:", err)
	}

	ctx.JSON(iris.Map{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": iris.Map{
			"email": user.Email,
		},
	})
}

// ResetPasswordMail 发送重置密码的邮件
func ResetPasswordMail(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	type UserReqData struct {
		Email       string `json:"email" valid:"email,runelength(5|50)"`
		LuosimaoRes string `json:"luosimaoRes" valid:"-"`
	}
	var userData UserReqData
	if err := ctx.ReadJSON(&userData); err != nil {
		SendErrJSON("无效的邮箱", ctx)
		return
	}

	if _, err := govalidator.ValidateStruct(userData); err != nil {
		SendErrJSON("无效的邮箱.", ctx)
		return
	}

	verifyErr := utils.LuosimaoVerify(config.ServerConfig.LuosimaoVerifyURL, config.ServerConfig.LuosimaoAPIKey, userData.LuosimaoRes)

	if verifyErr != nil {
		SendErrJSON(verifyErr.Error(), ctx)
		return
	}

	var user model.User
	if err := model.DB.Where("email = ?", userData.Email).Find(&user).Error; err != nil {
		SendErrJSON("没有邮箱为 "+userData.Email+" 的用户", ctx)
		return
	}

	curTime := time.Now().Unix()
	resetUser := fmt.Sprintf("%s%d", model.ResetTime, user.ID)
	if _, err := manager.C.Do("SET", resetUser, curTime, "EX", resetDuration); err != nil {
		fmt.Println("redis set failed:", err)
	}
	go func() {
		sendMail("/ac", "修改密码", curTime, user, ctx)
	}()

	ctx.JSON(iris.Map{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data":  iris.Map{},
	})
}

// VerifyResetPasswordLink 验证重置密码的链接是否失效
func VerifyResetPasswordLink(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	if _, err := verifyLink(model.ResetTime, ctx); err != nil {
		fmt.Println(err.Error())
		SendErrJSON("重置链接已失效", ctx)
		return
	}
	ctx.JSON(iris.Map{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data":  iris.Map{},
	})
}

// ResetPassword 重置密码
func ResetPassword(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	type UserReqData struct {
		Password string `json:"password" valid:"runelength(6|20)"`
	}
	var userData UserReqData

	if err := ctx.ReadJSON(&userData); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	if _, err := govalidator.ValidateStruct(userData); err != nil {
		SendErrJSON("参数无效.", ctx)
		return
	}

	var verifErr error
	var user model.User
	if user, verifErr = verifyLink(model.ResetTime, ctx); verifErr != nil {
		SendErrJSON("重置链接已失效", ctx)
		return
	}

	user.Pass = user.EncryptPassword(userData.Password, user.Salt())

	if user.ID <= 0 {
		SendErrJSON("重置链接已失效", ctx)
		return
	}
	if err := model.DB.Model(&user).Update("pass", user.Pass).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	if _, err := manager.C.Do("DEL", fmt.Sprintf("%s%d", model.ResetTime, user.ID)); err != nil {
		fmt.Println("redis delelte failed:", err)
	}

	ctx.JSON(iris.Map{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data":  iris.Map{},
	})
}
*/
// Signin 用户登录
func Signin(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	type Login struct {
		SigninInput string `json:"signinInput" binding:"required"`
		Password    string `json:"password" binding:"required,max=6,min=20"`
		LuosimaoRes string `json:"luosimaoRes" valid:"-"`
	}
	var login Login
	if err := c.BindJSON(&login); err != nil {
		SendErrJSON("用户名或密码错误", c)
		return
	}

	if login.SigninInput == "" {
		SendErrJSON("用户名或邮箱不能为空", c)
		return
	}

	var sql, msg string
	var queryUser model.User
	if strings.Index(login.SigninInput, "@") != -1 {
		if !govalidator.IsEmail(login.SigninInput) || len(login.SigninInput) < 5 ||
			len(login.SigninInput) > 50 {
			SendErrJSON("不是有效的邮箱", c)
			return
		}
		sql = "email = ?"
		msg = "邮箱或密码错误"
	} else {
		if len(login.SigninInput) < 4 || len(login.SigninInput) > 20 {
			SendErrJSON("用户名或密码错误", c)
			return
		}
		sql = "name = ?"
		msg = "用户名或密码错误"
	}

	verifyErr := utils.LuosimaoVerify(config.ServerConfig.LuosimaoVerifyURL, config.ServerConfig.LuosimaoAPIKey, login.LuosimaoRes)

	if verifyErr != nil {
		SendErrJSON(verifyErr.Error(), c)
		return
	}

	if err := model.DB.Where(sql, login.SigninInput).First(&queryUser).Error; err != nil {
		SendErrJSON(msg, c)
		return
	}

	if queryUser.CheckPassword(login.Password) {
		if queryUser.Status == model.UserStatusInActive {
			encodedEmail := base64.StdEncoding.EncodeToString([]byte(queryUser.Email))
			c.JSON(200, gin.H{
				"errNo": model.ErrorCode.InActive,
				"msg":   "账号未激活",
				"data": gin.H{
					"email": encodedEmail,
				},
			})
			return
		}
		//manager.Sess.Start(ctx).Set("user", queryUser)

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"id": queryUser.ID,
		})
		tokenString, err := token.SignedString([]byte(config.ServerConfig.TokenSecret))
		if err != nil {
			SendErrJSON("error", c)
			return
		}
		c.JSON(200, gin.H{
			"errNo": model.ErrorCode.SUCCESS,
			"msg":   "success",
			"token": tokenString,
			"data":  queryUser,
		})
	} else {
		SendErrJSON(msg, c)
		return
	}
}

/*
// Signup 用户注册
func Signup(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	type UserReqData struct {
		Name     string `json:"name" valid:"runelength(4|20)"`
		Email    string `json:"email" valid:"email,runelength(5|50)"`
		Password string `json:"password" valid:"runelength(6|20)"`
	}

	var userData UserReqData
	if err := ctx.ReadJSON(&userData); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	userData.Name = utils.AvoidXSS(userData.Name)
	userData.Name = strings.TrimSpace(userData.Name)
	userData.Email = strings.TrimSpace(userData.Email)

	if _, err := govalidator.ValidateStruct(userData); err != nil {
		SendErrJSON("参数无效.", ctx)
		return
	}

	if strings.Index(userData.Name, "@") != -1 {
		SendErrJSON("用户名中不能含有@字符", ctx)
		return
	}

	var user model.User
	if err := model.DB.Where("email = ? OR name = ?", userData.Email, userData.Name).Find(&user).Error; err == nil {
		if user.Name == userData.Name {
			SendErrJSON("用户名 "+user.Name+" 已被注册", ctx)
			return
		} else if user.Email == userData.Email {
			SendErrJSON("邮箱 "+user.Email+" 已存在", ctx)
			return
		}
	}

	var newUser model.User
	newUser.Name = userData.Name
	newUser.Email = userData.Email
	newUser.Pass = newUser.EncryptPassword(userData.Password, newUser.Salt())
	newUser.Role = model.UserRoleNormal
	newUser.Status = model.UserStatusInActive
	newUser.Sex = model.UserSexMale
	newUser.AvatarURL = "/images/avatar/" + strconv.Itoa(rand.Intn(2)) + ".png"

	if err := model.DB.Create(&newUser).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	curTime := time.Now().Unix()
	activeUser := fmt.Sprintf("%s%d", model.ActiveTime, newUser.ID)
	if _, err := manager.C.Do("SET", activeUser, curTime, "EX", activeDuration); err != nil {
		fmt.Println("redis set failed:", err)
	}

	go func() {
		sendMail("/active", "账号激活", curTime, newUser, ctx)
	}()

	ctx.JSON(iris.Map{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data":  newUser,
	})
}

// Signout 退出登录
func Signout(ctx iris.Context) {
	manager.Sess.Destroy(ctx)
	ctx.JSON(iris.Map{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data":  iris.Map{},
	})
}

// UpdateInfo 更新用户信息
func UpdateInfo(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var userReqData model.User
	if err := ctx.ReadJSON(&userReqData); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}
	user, _ := manager.Sess.Start(ctx).Get("user").(model.User)

	field := ctx.Params().Get("field")
	resData := make(map[string]interface{})
	resData["id"] = user.ID

	switch field {
	case "sex":
		if userReqData.Sex != model.UserSexMale && userReqData.Sex != model.UserSexFemale {
			SendErrJSON("无效的性别", ctx)
			return
		}
		if err := model.DB.Model(&user).Update("sex", userReqData.Sex).Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", ctx)
			return
		}
		resData[field] = userReqData.Sex
	case "signature":
		userReqData.Signature = utils.AvoidXSS(userReqData.Signature)
		userReqData.Signature = strings.TrimSpace(userReqData.Signature)
		// 个性签名可以为空
		if utf8.RuneCountInString(userReqData.Signature) > model.MaxSignatureLen {
			SendErrJSON("个性签名不能超过"+fmt.Sprintf("%d", model.MaxSignatureLen)+"个字符", ctx)
			return
		}
		if err := model.DB.Model(&user).Update("signature", userReqData.Signature).Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", ctx)
			return
		}
		resData[field] = userReqData.Signature
	case "location":
		userReqData.Location = utils.AvoidXSS(userReqData.Location)
		userReqData.Location = strings.TrimSpace(userReqData.Location)
		// 居住地可以为空
		if utf8.RuneCountInString(userReqData.Location) > model.MaxLocationLen {
			SendErrJSON("居住地不能超过"+fmt.Sprintf("%d", model.MaxLocationLen)+"个字符", ctx)
			return
		}
		if err := model.DB.Model(&user).Update("location", userReqData.Location).Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", ctx)
			return
		}
		resData[field] = userReqData.Location
	case "introduce":
		userReqData.Introduce = utils.AvoidXSS(userReqData.Introduce)
		userReqData.Introduce = strings.TrimSpace(userReqData.Introduce)
		// 个人简介可以为空
		if utf8.RuneCountInString(userReqData.Introduce) > model.MaxIntroduceLen {
			SendErrJSON("个人简介不能超过"+fmt.Sprintf("%d", model.MaxIntroduceLen)+"个字符", ctx)
			return
		}
		if err := model.DB.Model(&user).Update("introduce", userReqData.Introduce).Error; err != nil {
			fmt.Println(err.Error())
			SendErrJSON("error", ctx)
			return
		}
		resData[field] = userReqData.Introduce
	default:
		SendErrJSON("参数无效", ctx)
		return
	}
	ctx.JSON(iris.Map{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data":  resData,
	})
}

// UpdatePassword 更新用户密码
func UpdatePassword(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	type userReqData struct {
		Password string `json:"password" valid:"runelength(6|20)"`
		NewPwd   string `json:"newPwd" valid:"runelength(6|20)"`
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

	user, _ := manager.Sess.Start(ctx).Get("user").(model.User)

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
			"errNo": model.ErrorCode.SUCCESS,
			"msg":   "success",
			"data":  iris.Map{},
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
	if user.Sex == model.UserSexFemale {
		user.CoverURL = "https://www.golang123.com/upload/img/2017/09/13/d20f62c6-bd11-4739-b79b-48c9fcbce392.jpg"
	} else {
		user.CoverURL = "https://www.golang123.com/upload/img/2017/09/13/e672995e-7a39-4a05-9673-8802b1865c46.jpg"
	}
	ctx.JSON(iris.Map{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": iris.Map{
			"user": user,
		},
	})
}

// SecretInfo 返回用户信息，包含一些私密字段
func SecretInfo(ctx iris.Context) {
	user, _ := manager.Sess.Start(ctx).Get("user").(model.User)
	ctx.JSON(iris.Map{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": iris.Map{
			"user": user,
		},
	})
}

// InfoDetail 返回用户详情信息，包含一些私密字段
func InfoDetail(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	user, _ := manager.Sess.Start(ctx).Get("user").(model.User)

	if err := model.DB.First(&user, user.ID).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	if err := model.DB.Model(&user).Related(&user.Schools).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	if err := model.DB.Model(&user).Related(&user.Careers).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	if user.Sex == model.UserSexFemale {
		user.CoverURL = "https://www.golang123.com/upload/img/2017/09/13/d20f62c6-bd11-4739-b79b-48c9fcbce392.jpg"
	} else {
		user.CoverURL = "https://www.golang123.com/upload/img/2017/09/13/e672995e-7a39-4a05-9673-8802b1865c46.jpg"
	}

	ctx.JSON(iris.Map{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": iris.Map{
			"user": user,
		},
	})
}

// AllList 查询用户列表，只有管理员才能调此接口
func AllList(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	pageNo, pageNoErr := strconv.Atoi(ctx.FormValue("pageNo"))
	if pageNoErr != nil {
		pageNo = 1
	}
	if pageNo < 1 {
		pageNo = 1
	}

	offset := (pageNo - 1) * model.PageSize
	pageSize := model.PageSize

	var users []model.User
	if err := model.DB.Order("created_at DESC").Offset(offset).Limit(pageSize).Find(&users).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
	} else {
		var results []interface{}
		for i := 0; i < len(users); i++ {
			results = append(results, iris.Map{
				"id":     users[i].ID,
				"name":   users[i].Name,
				"email":  users[i].Email,
				"role":   users[i].Role,
				"status": users[i].Status,
			})
		}
		ctx.JSON(iris.Map{
			"errNo": model.ErrorCode.SUCCESS,
			"msg":   "success",
			"data": iris.Map{
				"users": results,
			},
		})
	}
}

func topN(n int, ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var users []model.User
	if err := model.DB.Order("score DESC").Limit(n).Find(&users).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
	} else {
		ctx.JSON(iris.Map{
			"errNo": model.ErrorCode.SUCCESS,
			"msg":   "success",
			"data": iris.Map{
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

// UpdateAvatar 修改用户头像
func UpdateAvatar(ctx iris.Context) {
	data, err := common.Upload(ctx)
	if err != nil {
		ctx.JSON(iris.Map{
			"errNo": model.ErrorCode.ERROR,
			"msg":   err.Error(),
			"data":  iris.Map{},
		})
		return
	}

	avatarURL := data["url"].(string)
	user, _ := manager.Sess.Start(ctx).Get("user").(model.User)
	if err := model.DB.Model(&user).Update("avatar_url", avatarURL).Error; err != nil {
		ctx.JSON(iris.Map{
			"errNo": model.ErrorCode.ERROR,
			"msg":   err.Error(),
			"data":  iris.Map{},
		})
		return
	}
	user.AvatarURL = avatarURL
	manager.Sess.Start(ctx).Set("user", user)
	ctx.JSON(iris.Map{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data":  data,
	})
}

// AddCareer 添加职业经历
func AddCareer(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	var career model.Career
	if err := ctx.ReadJSON(&career); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	career.Company = utils.AvoidXSS(career.Company)
	career.Company = strings.TrimSpace(career.Company)
	career.Title = utils.AvoidXSS(career.Title)
	career.Title = strings.TrimSpace(career.Title)

	if career.Company == "" {
		SendErrJSON("公司或组织名称不能为空", ctx)
		return
	}

	if utf8.RuneCountInString(career.Company) > model.MaxCareerCompanyLen {
		SendErrJSON("公司或组织名称不能超过"+fmt.Sprintf("%d", model.MaxCareerCompanyLen)+"个字符", ctx)
		return
	}

	if career.Title == "" {
		SendErrJSON("职位不能为空", ctx)
		return
	}

	if utf8.RuneCountInString(career.Title) > model.MaxCareerTitleLen {
		SendErrJSON("职位不能超过"+fmt.Sprintf("%d", model.MaxCareerTitleLen)+"个字符", ctx)
		return
	}

	session := manager.Sess.Start(ctx)
	user := session.Get("user").(model.User)
	career.UserID = user.ID

	if err := model.DB.Create(&career).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.Map{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data":  career,
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

	school.Name = utils.AvoidXSS(school.Name)
	school.Name = strings.TrimSpace(school.Name)
	school.Speciality = utils.AvoidXSS(school.Speciality)
	school.Speciality = strings.TrimSpace(school.Speciality)

	if school.Name == "" {
		SendErrJSON("学校或教育机构名不能为空", ctx)
		return
	}

	if utf8.RuneCountInString(school.Name) > model.MaxSchoolNameLen {
		SendErrJSON("学校或教育机构名不能超过"+fmt.Sprintf("%d", model.MaxSchoolNameLen)+"个字符", ctx)
		return
	}

	if school.Speciality == "" {
		SendErrJSON("专业方向不能为空", ctx)
		return
	}

	if utf8.RuneCountInString(school.Speciality) > model.MaxSchoolSpecialityLen {
		SendErrJSON("专业方向不能超过"+fmt.Sprintf("%d", model.MaxSchoolSpecialityLen)+"个字符", ctx)
		return
	}

	session := manager.Sess.Start(ctx)
	user := session.Get("user").(model.User)
	school.UserID = user.ID

	if err := model.DB.Create(&school).Error; err != nil {
		SendErrJSON("error", ctx)
		return
	}

	ctx.JSON(iris.Map{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data":  school,
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
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": iris.Map{
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
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": iris.Map{
			"id": school.ID,
		},
	})
}
*/
