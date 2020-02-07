package model

import "time"

// Article 文章, 也称话题
type Article struct {
	ID            uint       `gorm:"primary_key" json:"id"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
	DeletedAt     *time.Time `sql:"index" json:"deletedAt"`
	Name          string     `json:"name"`
	BrowseCount   uint       `json:"browseCount"`
	CommentCount  uint       `json:"commentCount"`
	CollectCount  uint       `json:"collectCount"`
	Status        int        `json:"status"`
	Content       string     `json:"content"`
	HTMLContent   string     `json:"htmlContent"`
	ContentType   int        `json:"contentType"`
	Categories    []Category `gorm:"many2many:article_category;ForeignKey:ID;AssociationForeignKey:ID" json:"categories"`
	Comments      []Comment  `gorm:"ForeignKey:SourceID" json:"comments"`
	UserID        uint       `json:"userID"`
	User          User       `json:"user"`
	LastUserID    uint       `json:"lastUserID"` //最后一个回复话题的人
	LastUser      User       `json:"lastUser"`
	LastCommentAt *time.Time `json:"lastCommentAt"`
}

const (
	// ArticleVerifying 审核中
	ArticleVerifying = 1

	// ArticleVerifySuccess 审核通过
	ArticleVerifySuccess = 2

	// ArticleVerifyFail 审核未通过
	ArticleVerifyFail = 3
)

// MaxTopArticleCount 最多能置顶的文章数
const MaxTopArticleCount = 4

// TopArticle 置顶的文章
type TopArticle struct {
	ID        uint       `gorm:"primary_key" json:"id"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `sql:"index" json:"deletedAt"`
	ArticleID uint       `json:"articleID"`
}
