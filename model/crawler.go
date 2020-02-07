package model

import "time"

// CrawlerArticle 爬虫抓取的文章
type CrawlerArticle struct {
	ID        uint       `gorm:"primary_key" json:"id"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `sql:"index" json:"deletedAt"`
	URL       string     `json:"url"`
	Title     string     `json:"title"`
	Content   string     `json:"content"`
	From      int        `json:"from"`
	ArticleID uint       `json:"articleID"`
}

const (
	// ArticleFromNULL 无来源
	ArticleFromNULL = 0

	// ArticleFromJianShu 简书
	ArticleFromJianShu = 1

	// ArticleFromZhihu 知乎
	ArticleFromZhihu = 2

	// ArticleFromHuxiu 虎嗅
	ArticleFromHuxiu = 3

	// ArticleFromCustom 自定义
	ArticleFromCustom = 10
)

const (
	// CrawlerScopePage 抓取单篇文章
	CrawlerScopePage = "page"

	// CrawlerScopeList 抓取一批文章
	CrawlerScopeList = "list"
)
