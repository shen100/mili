package model

// Image 图片
type Image struct {
    ID             uint       `gorm:"primary_key" json:"id"`
    Title          string     `json:"title"`
    OrignalTitle   string     `json:"orignalTitle"`
    URL            string     `json:"url"`
    Width          uint       `json:"width"`
    Height         uint       `json:"height"`
    Mime           string     `json:"mime"`
}  