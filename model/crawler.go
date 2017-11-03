package model

import "time"

// CrawlerArticle 爬虫抓取的文章
type CrawlerArticle struct {
    ID             uint               `gorm:"primary_key" json:"id"`
    CreatedAt      time.Time          `json:"createdAt"`
    UpdatedAt      time.Time          `json:"updatedAt"`
    DeletedAt      *time.Time         `sql:"index" json:"deletedAt"`
	URL            string             `json:"url"`
	Title          string             `json:"title"`
	Content        string             `json:"content"`
	From           int                `json:"from"`
}

const (
	// ArticleFromJianShu 简书
	ArticleFromJianShu = 1
)
