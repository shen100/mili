package model

import "time"

// Article 文章
type Article struct {
    ID             uint               `gorm:"primary_key" json:"id"`
    CreatedAt      time.Time          `json:"createdAt"`
    UpdatedAt      time.Time          `json:"updatedAt"`
    DeletedAt      *time.Time         `sql:"index" json:"deletedAt"`
    Name           string             `json:"name"`
    BrowseCount    int                `json:"browseCount"`
    CommentCount   int                `json:"commentCount"`
    Status         int                `json:"status"`
    Content        string             `json:"content"`
    Categories     []Category         `gorm:"many2many:article_category;ForeignKey:ID;AssociationForeignKey:ID" json:"categories"`
    Comments       []Comment          `gorm:"AssociationForeignKey:SourceID" json:"comments"` 
    UserID         uint               `json:"userID"`
    User           User               `json:"user"`
}

const (
    // ArticleVerifying 审核中
    ArticleVerifying      = 1

    // ArticleVerifySuccess 审核通过
    ArticleVerifySuccess  = 2

    // ArticleVerifyFail 审核未通过
    ArticleVerifyFail     = 3
)