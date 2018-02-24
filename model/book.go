package model

import "time"

// BookCategory 图书的分类
type BookCategory struct {
	ID        uint       `gorm:"primary_key" json:"id"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `sql:"index" json:"deletedAt"`
	Name      string     `json:"name"`
	Sequence  int        `json:"sequence"` //同级别的分类可根据sequence的值来排序
	ParentID  int        `json:"parentId"` //直接父分类的ID
}

// Book 图书
type Book struct {
	ID             uint           `gorm:"primary_key" json:"id"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      time.Time      `json:"updatedAt"`
	DeletedAt      *time.Time     `sql:"index" json:"deletedAt"`
	Name           string         `json:"name"`
	CoverURL       string         `json:"coverURL"`
	Star           int            `json:"star"` // 图书最终得了几颗星
	OneStarCount   int            `json:"oneStarCount"`
	TwoStarCount   int            `json:"twoStarCount"`
	ThreeStarCount int            `json:"threeStarCount"`
	FourStarCount  int            `json:"fourStarCount"`
	FiveStarCount  int            `json:"fiveStarCount"`
	TotalStarCount int            `json:"TotalStarCount"`
	BrowseCount    uint           `json:"browseCount"`
	CommentCount   uint           `json:"commentCount"`
	CollectCount   uint           `json:"collectCount"`
	Status         string         `json:"status"`
	Content        string         `json:"content"`
	HTMLContent    string         `json:"htmlContent"`
	ContentType    int            `json:"contentType"`
	Categories     []BookCategory `gorm:"many2many:book_category;ForeignKey:ID;AssociationForeignKey:ID" json:"categories"`
	Comments       []BookComment  `json:"comments"`
	UserID         uint           `json:"userID"`
	User           User           `json:"user"`
}

// BookChapter 图书的章节
type BookChapter struct {
	ID           uint          `gorm:"primary_key" json:"id"`
	CreatedAt    time.Time     `json:"createdAt"`
	UpdatedAt    time.Time     `json:"updatedAt"`
	DeletedAt    *time.Time    `sql:"index" json:"deletedAt"`
	Name         string        `json:"name"`
	BrowseCount  uint          `json:"browseCount"`
	CommentCount uint          `json:"commentCount"`
	Content      string        `json:"content"`
	HTMLContent  string        `json:"htmlContent"`
	ContentType  int           `json:"contentType"`
	Comments     []BookComment `json:"comments"`
	UserID       uint          `json:"userID"`
	User         User          `json:"user"`
	ParentID     uint          `json:"parentID"` //直接父章节的ID
	BookID       uint          `json:"bookID"`
}

// BookComment 书评
type BookComment struct {
	ID          uint       `gorm:"primary_key" json:"id"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
	DeletedAt   *time.Time `sql:"index" json:"deletedAt"`
	Status      string     `json:"status"`
	Star        int        `json:"Star"`
	Content     string     `json:"content"`
	HTMLContent string     `json:"htmlContent"`
	ContentType int        `json:"contentType"`
	BookID      uint       `json:"bookID"`
	UserID      uint       `json:"userID"`
	User        User       `json:"user"`
}

// BookChapterComment 章节的评论
type BookChapterComment struct {
	ID          uint          `gorm:"primary_key" json:"id"`
	CreatedAt   time.Time     `json:"createdAt"`
	UpdatedAt   time.Time     `json:"updatedAt"`
	DeletedAt   *time.Time    `sql:"index" json:"deletedAt"`
	Status      string        `json:"status"`
	Content     string        `json:"content"`
	HTMLContent string        `json:"htmlContent"`
	ContentType int           `json:"contentType"`
	ParentID    uint          `json:"parentID"` //直接父评论的ID
	Parents     []BookComment `json:"parents"`  //所有的父评论
	BookID      uint          `json:"bookID"`
	PageID      uint          `json:"pageID"`
	UserID      uint          `json:"userID"`
	User        User          `json:"user"`
}

const (
	// BookUnpublish 未发布
	BookUnpublish = "book_unpublish"

	// BookVerifying 审核中
	BookVerifying = "book_verifying"

	// BookVerifySuccess 审核通过
	BookVerifySuccess = "book_verify_success"

	// BookVerifyFail 审核未通过
	BookVerifyFail = "book_verify_fail"
)

const (
	// BookCommentVerifying 审核中
	BookCommentVerifying = "book_comment_verifying"

	// BookCommentVerifySuccess 审核通过
	BookCommentVerifySuccess = "book_comment_verify_success"

	// BookCommentVerifyFail 审核未通过
	BookCommentVerifyFail = "book_comment_verify_fail"
)
