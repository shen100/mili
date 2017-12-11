package baidu

import (
	"strconv"
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"github.com/kataras/iris"
	"github.com/shen100/golang123/config"
	"github.com/shen100/golang123/model"
	"github.com/shen100/golang123/controller/common"
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
func PushToBaidu(ctx iris.Context) {
	// 查询参数type目前为article, 未来可添加
	SendErrJSON := common.SendErrJSON
	var count int
	if err := model.DB.Model(&model.Article{}).Where("status <> ?", model.ArticleVerifyFail).Count(&count).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", ctx)
		return
	}
	limit := 40
	go func() {
		for i := 0; i < count; i += limit {
			var articles []model.Article
			if err := model.DB.Where("status <> ?", model.ArticleVerifyFail).Offset(i).
					Limit(limit).Find(&articles).Error; err == nil {
				var urlArr []string
				for j := 0; j < len(articles); j++ {
					urlArr = append(urlArr, "https://" + config.ServerConfig.Host + "/topic/" + strconv.Itoa(int(articles[j].ID)))
				}
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
	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "success",
		"data"  : iris.Map{},
	})
}