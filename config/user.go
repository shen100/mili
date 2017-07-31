package config

type userConfig struct {
	CreateArticleScore uint
}

// UserConfig 用户相关配置
var UserConfig userConfig

func init() {
	UserConfig.CreateArticleScore = 5	
}