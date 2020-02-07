package model

import (
	"time"

	"github.com/globalsign/mgo/bson"
)

// UserVisit 访客记录
type UserVisit struct {
	ID             bson.ObjectId `bson:"_id"`
	Platform       string        `bson:"platform"`
	URL            string        `bson:"url"`
	Referrer       string        `bson:"referrer"`
	ClientID       string        `bson:"clientID"`
	UserID         uint          `bson:"userID"`
	Date           time.Time     `bson:"date"`
	IP             string        `bson:"ip"`
	DeviceWidth    int           `bson:"deviceWidth"`
	DeviceHeight   int           `bson:"deviceHeight"`
	BrowserName    string        `bson:"browserName"`
	BrowserVersion string        `bson:"browserVersion"`
	DeviceModel    string        `bson:"deviceModel"`
	Country        string        `bson:"country"`
	Language       string        `bson:"language"`
	OSName         string        `bson:"osName"`
	OSVersion      string        `bson:"osVersion"`
}

// YesterdayStats 昨日统计
type YesterdayStats struct {
	ID              bson.ObjectId `bson:"_id"`
	Date            string        `bson:"date"`
	SignupUserCount uint          `bson:"signupUserCount"`
	TopicCount      uint          `bson:"topicCount"`
	CommentCount    uint          `bson:"commentCount"`
	BookCount       uint          `bson:"bookCount"`
	PV              uint          `bson:"pv"`
	UV              uint          `bson:"uv"`
}
