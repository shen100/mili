package common

import (
	"errors"
	"fmt"
	"io"
	"os"
	"strings"
	"mime"
	"github.com/kataras/iris"
	"github.com/shen100/golang123/model"
)

// Upload 文件上传
func Upload(ctx iris.Context) (map[string]interface{}, error) {
	file, info, err := ctx.FormFile("upFile")

	if err != nil {
		return nil, errors.New("参数无效")
	}

	defer file.Close()

	var filename = info.Filename
	var index    = strings.LastIndex(filename, ".")

	if index < 0 {
		return nil, errors.New("无效的文件名")
	}

	var ext = filename[index:]
	if len(ext) == 1 {
		return nil, errors.New("无效的扩展名")
	}
	var mimeType = mime.TypeByExtension(ext)

	if mimeType == "" {
		return nil, errors.New("无效的图片类型")
	}

	imgUploadedInfo := model.GenerateImgUploadedInfo(ext)

	if err := os.MkdirAll(imgUploadedInfo.UploadDir, 0777); err != nil {
		fmt.Println(err.Error());
		return nil, errors.New("error")
	}

	out, err := os.OpenFile(imgUploadedInfo.UploadFilePath, os.O_WRONLY|os.O_CREATE, 0666)

	if err != nil {
		fmt.Println(err.Error())
		return nil,  errors.New("error1")
	}

	defer out.Close()

	if _, err := io.Copy(out, file); err != nil {
		fmt.Println(err.Error())
		return nil, errors.New("error2")
	}

	image := model.Image{
		Title        : imgUploadedInfo.Filename,
		OrignalTitle : info.Filename,
		URL          : imgUploadedInfo.ImgURL,
		Width        : 0,
		Height       : 0,
		Mime         : mimeType,
	}

	if err := model.DB.Create(&image).Error; err != nil {
		fmt.Println(err.Error())
		return nil, errors.New("image error")
	}

	return map[string]interface{}{
		"id"       : image.ID,
		"url"      : imgUploadedInfo.ImgURL,
		"title"    : imgUploadedInfo.Filename, //新文件名
		"original" : info.Filename, //原始文件名
		"type"     : mimeType,      //文件类型
	}, nil
}

// UploadHandler 文件上传
func UploadHandler(ctx iris.Context) {
	data, err := Upload(ctx)
	if err != nil {
		ctx.JSON(iris.Map{
			"errNo" : model.ErrorCode.ERROR,
			"msg"   : err.Error(),
			"data"  : iris.Map{},
		})
		return
	}
	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : data,
	})
}