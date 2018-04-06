package cron

import (
	"fmt"

	"github.com/globalsign/mgo/bson"
	"github.com/shen100/golang123/model"
	"github.com/shen100/golang123/utils"
)

func yesterdayCron() {
	var yesterdaySignupUserCount uint // 昨日注册用户数
	var yesterdayTopicCount uint      // 昨日创建的话题数
	var yesterdayCommentCount uint    // 昨日回复数
	var yesterdayBookCount uint       // 昨日创建的图书数
	var yesterdayPV uint              // 昨日PV
	var yesterdayUV uint              // 昨日UV

	todayTime := utils.GetTodayTime()
	yesterdayTime := utils.GetYesterdayTime()

	if err := model.DB.Model(&model.User{}).Where("activated_at >= ? AND activated_at < ?", yesterdayTime, todayTime).Count(&yesterdaySignupUserCount).Error; err != nil {
		fmt.Println(err)
		return
	}

	if err := model.DB.Model(&model.Article{}).Where("created_at >= ? AND created_at < ?", yesterdayTime, todayTime).Count(&yesterdayTopicCount).Error; err != nil {
		fmt.Println(err)
		return
	}

	if err := model.DB.Model(&model.Comment{}).Where("created_at >= ? AND created_at < ?", yesterdayTime, todayTime).Count(&yesterdayCommentCount).Error; err != nil {
		fmt.Println(err)
		return
	}

	if err := model.DB.Model(&model.Book{}).Where("created_at >= ? AND created_at < ?", yesterdayTime, todayTime).Count(&yesterdayBookCount).Error; err != nil {
		fmt.Println(err)
		return
	}

	var pvCount map[string]uint
	pvErr := model.MongoDB.C("userVisit").Pipe(
		[]bson.M{
			{"$match": bson.M{
				"date": bson.M{
					"$gte": yesterdayTime,
					"$lt":  todayTime,
				},
			}},
			{"$count": "pv"},
		},
	).AllowDiskUse().One(&pvCount)

	if pvErr != nil {
		fmt.Println(pvErr)
	} else {
		yesterdayPV = pvCount["pv"]
	}

	var uvCount map[string]uint
	uvErr := model.MongoDB.C("userVisit").Pipe(
		[]bson.M{
			{"$match": bson.M{
				"date": bson.M{
					"$gte": yesterdayTime,
					"$lt":  todayTime,
				},
			}},
			{
				"$group": bson.M{
					"_id": "$clientID",
				},
			},
			{"$count": "uv"},
		},
	).AllowDiskUse().One(&uvCount)

	if uvErr != nil {
		fmt.Println(uvErr)
	} else {
		yesterdayUV = uvCount["uv"]
	}

	yesterdayStr := utils.GetYesterdayYMD("-")
	_, err := model.MongoDB.C("yesterdayStats").Upsert(bson.M{
		"date": yesterdayStr,
	}, bson.M{
		"$set": bson.M{
			"date":            yesterdayStr,
			"signupUserCount": yesterdaySignupUserCount,
			"topicCount":      yesterdayTopicCount,
			"commentCount":    yesterdayCommentCount,
			"bookCount":       yesterdayBookCount,
			"pv":              yesterdayPV,
			"uv":              yesterdayUV,
		},
	})
	if err != nil {
		fmt.Println(err)
		return
	}
}
