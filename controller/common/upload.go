package common

import (
	"fmt"
	"io"
	"os"
	"strings"
	"time"
	"mime"
	"strconv"
	"github.com/kataras/iris"
	"github.com/satori/go.uuid"
	"golang123/model"
	"golang123/utils"
	"golang123/config"
)

// Upload 文件上传
func Upload(ctx iris.Context) {
	file, info, err := ctx.FormFile("upFile")
	if err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	var filename = info.Filename
	var index    = strings.LastIndex(filename, ".")

	if index < 0 {
		SendErrJSON("无效的文件名", ctx)
		return
	}

	var ext      = filename[index:]
	var mimeType = mime.TypeByExtension(ext)

	if mimeType == "" {
		SendErrJSON("无效的图片类型", ctx)
		return
	}
	
	defer file.Close()

	now          := time.Now()
	year         := now.Year()
	month        := utils.StrToIntMonth(now.Month().String())
	date         := now.Day()

	var monthStr string
	var dateStr string
	if month < 9 {
		monthStr = "0" + strconv.Itoa(month + 1)
	} else {
		monthStr = strconv.Itoa(month + 1)
	}

	if date < 10 {
		dateStr = "0" + strconv.Itoa(date)
	} else {
		dateStr = strconv.Itoa(date)
	}

	sep := string(os.PathSeparator)

	timeDir := strconv.Itoa(year) + sep + monthStr + sep + dateStr

	title := uuid.NewV4().String() + ext

	uploadDir := config.ServerConfig.UploadImgDir + sep + timeDir
	mkErr := os.MkdirAll(uploadDir, 0777)
	
	if mkErr != nil {
		fmt.Println(mkErr.Error());
		SendErrJSON("error", ctx)
		return	
	}

	uploadFilePath := uploadDir + sep + title

	fmt.Println(uploadFilePath);

	out, err := os.OpenFile(uploadFilePath, os.O_WRONLY|os.O_CREATE, 0666)

	if err != nil {
		SendErrJSON("error.", ctx)
		return
	}

	defer out.Close()

	io.Copy(out, file)

	imgURL := config.ServerConfig.ImgPath + sep + timeDir + sep + title

	image := &model.Image{
		Title        : title,
		OrignalTitle : info.Filename,
		URL          : imgURL,
		Width        : 0,
		Height       : 0,
		Mime         : mimeType,
	}

	if model.DB.Create(&image).Error != nil {
		SendErrJSON("image error", ctx)
		return	
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{
			"id"       : image.ID,
			"url"      : imgURL,
			"title"    : title,         //新文件名
			"original" : info.Filename, //原始文件名
			"type"     : mimeType,      //文件类型
		},
	})
	return
}