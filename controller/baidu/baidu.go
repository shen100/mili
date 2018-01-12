package baidu

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/shen100/golang123/config"
	"github.com/shen100/golang123/controller/common"
	"github.com/shen100/golang123/model"
)

func postToBaidu(url string, data []byte) ([]byte, error) {
	body := bytes.NewReader(data)
	request, err := http.NewRequest("POST", url, body)
	if err != nil {
		fmt.Println(err.Error(), url)
		return []byte(""), err
	}
	request.Header.Set("Connection", "Keep-Alive")
	var resp *http.Response
	resp, err = http.DefaultClient.Do(request)
	if err != nil {
		fmt.Println(err.Error(), url)
		return []byte(""), err
	}
	defer resp.Body.Close()
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err.Error(), url)
	}
	return b, err
}

// PushToBaidu 百度链接提交
func PushToBaidu(c *gin.Context) {
	// 查询参数type目前为article, 未来可添加
	SendErrJSON := common.SendErrJSON
	var count int
	if err := model.DB.Model(&model.Article{}).Where("status <> ?", model.ArticleVerifyFail).Count(&count).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", c)
		return
	}
	limit := 40
	go func() {
		for i := 0; i < 1; i += limit {
			var articles []model.Article
			if err := model.DB.Where("status <> ?", model.ArticleVerifyFail).Offset(i).
				Limit(limit).Find(&articles).Error; err == nil {
				var urlArr []string
				for j := 0; j < len(articles); j++ {
					urlArr = append(urlArr, "https://"+config.ServerConfig.Host+"/topic/"+strconv.Itoa(int(articles[j].ID)))
				}
				urlArr = []string{"https://www.golang123.com/topic/1"}
				urlStr := strings.Join(urlArr, "\n")
				result, err := postToBaidu(config.ServerConfig.BaiduPushLink, []byte(urlStr))
				fmt.Println(urlStr)
				fmt.Println(string(result))
				if err != nil {
					fmt.Println(err.Error())
				}
			}
		}
	}()
	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data":  gin.H{},
	})
}
