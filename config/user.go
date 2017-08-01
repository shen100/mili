package config

type userConfig struct {
	CreateArticleScore uint
	MaxNameLen         uint
	MinNameLen         uint
	MaxPassLen         uint
	MinPassLen         uint
}

// UserConfig 用户相关配置
var UserConfig userConfig

func init() {
	UserConfig.CreateArticleScore = 5	
	UserConfig.MaxNameLen = 20	
	UserConfig.MinNameLen = 4	
	UserConfig.MaxPassLen = 6	
	UserConfig.MinPassLen = 20	
}