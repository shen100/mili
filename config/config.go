package config

import (
    "strings"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "regexp"
    "golang123/utils"
)

var jsonData map[string]interface{}

func initJSON() {
    bytes, err := ioutil.ReadFile("./configuration.json")
    if err != nil {
        fmt.Println("ReadFile: ", err.Error())
    }

	configStr := string(bytes[:])
	reg       := regexp.MustCompile(`/\*.*\*/`)

	configStr  = reg.ReplaceAllString(configStr, "")
	bytes      = []byte(configStr)

    if err := json.Unmarshal(bytes, &jsonData); err != nil {
        fmt.Println("invalid config: ", err.Error())
    }
}

type dBConfig struct {
	Dialect       string
	Database      string
	User          string
	Password      string
	Charset       string
	URL           string
	MaxIdleConns  int    
	MaxOpenConns  int 
}

// DBConfig 数据库相关配置
var DBConfig dBConfig

func initDB() {
	utils.SetStructByJSON(&DBConfig, jsonData["database"].(map[string]interface{}))
	url := "{user}:{password}@/{database}?charset={charset}&parseTime=True&loc=Local"
	url  = strings.Replace(url, "{database}", DBConfig.Database, -1)
	url  = strings.Replace(url, "{user}",     DBConfig.User,     -1)
	url  = strings.Replace(url, "{password}", DBConfig.Password, -1)
	url  = strings.Replace(url, "{charset}",  DBConfig.Charset,  -1)
	DBConfig.URL = url
}

type serverConfig struct {
	Env                 string
	ImgPath             string
	UploadImgDir        string
	Port                int
	SessionID           string
	MaxOrder            int
	MinOrder            int
	PageSize            int
	MaxPageSize         int
	MinPageSize         int
	MaxNameLen          int
	MaxContentLen       int
}

// ServerConfig 服务器相关配置
var ServerConfig serverConfig

func initServer() {
	utils.SetStructByJSON(&ServerConfig, jsonData["go"].(map[string]interface{}))
}

type apiConfig struct {
	Prefix   string
	URL      string
}

// APIConfig api相关配置
var APIConfig apiConfig

func initAPI() {
	utils.SetStructByJSON(&APIConfig, jsonData["api"].(map[string]interface{}))
}

func init() {
	initJSON()
	initDB()
	initServer()
	initAPI()
}