package model

import "time"

// Folder 收藏夹
type Folder struct {
    ID           uint          `gorm:"primary_key" json:"id"`
    CreatedAt    time.Time     `json:"createdAt"`
    UpdatedAt    time.Time     `json:"updatedAt"`
	DeletedAt    *time.Time    `sql:"index" json:"deletedAt"`
	Name         string        `json:"name"`
	UserID       uint          `json:"userID"`
    ParentID     uint          `json:"parentID"`
}

// Collect 收藏
type Collect struct {
    ID         uint          `gorm:"primary_key" json:"id"`
    CreatedAt  time.Time     `json:"createdAt"`
    UpdatedAt  time.Time     `json:"updatedAt"`
	DeletedAt  *time.Time    `sql:"index" json:"deletedAt"`
	UserID     uint          `json:"userID"`
	SourceName string        `json:"sourceName"`//用来区分是对话题，还是对投票进行评论
    SourceID   uint          `json:"sourceID"`  //话题或投票的ID
    FolderID   uint          `json:"folderID"`  //收藏到哪个收藏夹
    Folder     Folder        `json:"folder"`
}

const (
    // CollectSourceArticle 对话题进行收藏
    CollectSourceArticle = "collect_source_article"

    // CollectSourceVote 对投票进行收藏
    CollectSourceVote    = "collect_source_vote"
)

// MaxFolderCount 最多能创建的收藏夹个数
const MaxFolderCount = 20