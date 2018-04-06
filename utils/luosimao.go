package utils

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
)

// LuosimaoVerify 对前端的验证码进行验证
func LuosimaoVerify(reqURL, apiKey, response string) error {
	if apiKey == "" {
		// 没有配置LuosimaoAPIKey的话，就没有验证码功能
		return nil
	}
	if response == "" {
		return errors.New("人机识别验证失败")
	}
	reqData := make(url.Values)
	reqData["api_key"] = []string{apiKey}
	reqData["response"] = []string{response}

	res, err := http.PostForm(reqURL, reqData)
	if err != nil {
		fmt.Println(err.Error())
		return errors.New("人机识别验证失败")
	}

	defer res.Body.Close()

	resBody, readErr := ioutil.ReadAll(res.Body)

	if readErr != nil {
		fmt.Println(readErr.Error())
		return errors.New("人机识别验证失败")
	}

	type LuosimaoResult struct {
		Error int    `json:"error"`
		Res   string `json:"res"`
		Msg   string `json:"msg"`
	}
	var luosimaoResult LuosimaoResult
	if err := json.Unmarshal(resBody, &luosimaoResult); err != nil {
		fmt.Println(err)
		return errors.New("人机识别验证失败")
	}
	if luosimaoResult.Res != "success" {
		fmt.Println("luosimaoResult.Res", luosimaoResult.Res)
		return errors.New("人机识别验证失败")
	}
	return nil
}
