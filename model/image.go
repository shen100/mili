package model

import (
	"strings"
    "unicode/utf8"
    "os"
	"github.com/shen100/golang123/config"
	"github.com/shen100/golang123/utils"
    "github.com/satori/go.uuid"
)

// Image 图片
type Image struct {
    ID             uint       `gorm:"primary_key" json:"id"`
    Title          string     `json:"title"`
    OrignalTitle   string     `json:"orignalTitle"`
    URL            string     `json:"url"`
    Width          uint       `json:"width"`
    Height         uint       `json:"height"`
    Mime           string     `json:"mime"`
}  

// ImageUploadedInfo 图片上传后的相关信息(目录、文件路径、文件名、UUIDName、请求URL)
type ImageUploadedInfo struct {
    UploadDir       string
    UploadFilePath  string
    Filename        string
    UUIDName        string
    ImgURL          string
}

// GenerateImgUploadedInfo 创建一个ImageUploadedInfo
func GenerateImgUploadedInfo(ext string) ImageUploadedInfo {
    sep          := string(os.PathSeparator)
    uploadImgDir := config.ServerConfig.UploadImgDir
	length       := utf8.RuneCountInString(uploadImgDir)
	lastChar     := uploadImgDir[length - 1:]
    ymStr        := utils.GetTodayYM(sep)
    
	var uploadDir string
	if lastChar != sep {
		uploadDir = uploadImgDir + sep	+ ymStr
	} else {
		uploadDir = uploadImgDir + ymStr
	}

    uuidName       := uuid.NewV4().String()
	filename       := uuidName + ext
	uploadFilePath := uploadDir + sep + filename
    imgURL         := strings.Join([]string{
        "https://" + config.ServerConfig.ImgHost + config.ServerConfig.ImgPath,
        ymStr,
        filename,
    }, "/")
	return ImageUploadedInfo{
        ImgURL: imgURL,
        UUIDName: uuidName,
		Filename: filename,
		UploadDir: uploadDir,
		UploadFilePath: uploadFilePath,
	}
}