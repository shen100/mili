package router

import (
	"github.com/gin-gonic/gin"
	"github.com/shen100/golang123/config"
	"github.com/shen100/golang123/controller/article"
	"github.com/shen100/golang123/controller/baidu"
	"github.com/shen100/golang123/controller/book"
	"github.com/shen100/golang123/controller/category"
	"github.com/shen100/golang123/controller/collect"
	"github.com/shen100/golang123/controller/comment"
	"github.com/shen100/golang123/controller/common"
	"github.com/shen100/golang123/controller/crawler"
	"github.com/shen100/golang123/controller/keyvalueconfig"
	"github.com/shen100/golang123/controller/message"
	"github.com/shen100/golang123/controller/user"
	"github.com/shen100/golang123/controller/vote"
	"github.com/shen100/golang123/middleware"
)

// Route 路由
func Route(router *gin.Engine) {
	apiPrefix := config.ServerConfig.APIPrefix

	api := router.Group(apiPrefix, middleware.RefreshTokenCookie)
	{
		api.GET("/siteinfo", common.SiteInfo)
		api.POST("/signin", user.Signin)
		api.POST("/signup", user.Signup)
		api.POST("/signout", middleware.SigninRequired,
			user.Signout)
		api.POST("/upload", middleware.SigninRequired,
			common.UploadHandler)
		api.POST("crawlnotsavecontent", middleware.EditorRequired,
			crawler.CrawlNotSaveContent)

		api.POST("/active/sendmail", user.ActiveSendMail)
		api.POST("/active/user/:id/:secret", user.ActiveAccount)

		api.POST("/reset/sendmail", user.ResetPasswordMail)
		api.GET("/reset/verify/:id/:secret", user.VerifyResetPasswordLink)
		api.POST("/reset/password/:id/:secret", user.ResetPassword)

		api.GET("/user/info", middleware.SigninRequired,
			user.SecretInfo)
		api.GET("/user/score/top10", user.Top10)
		api.GET("/user/score/top100", user.Top100)
		api.GET("/user/info/detail", middleware.SigninRequired,
			user.InfoDetail)
		api.GET("/user/info/public/:id", user.PublicInfo)
		api.POST("/user/uploadavatar", middleware.SigninRequired,
			user.UploadAvatar)
		api.POST("/user/career/add", middleware.SigninRequired,
			user.AddCareer)
		api.POST("/user/school/add", middleware.SigninRequired,
			user.AddSchool)
		api.PUT("/user/update/:field", middleware.SigninRequired,
			user.UpdateInfo)
		api.PUT("/user/password/update", middleware.SigninRequired,
			user.UpdatePassword)
		api.DELETE("/user/career/delete/:id", middleware.SigninRequired,
			user.DeleteCareer)
		api.DELETE("/user/school/delete/:id", middleware.SigninRequired,
			user.DeleteSchool)

		api.GET("/messages/unread", middleware.SigninRequired,
			message.Unread)
		api.GET("/messages/read/:id", middleware.SigninRequired,
			message.Read)

		api.GET("/categories", category.List)

		api.GET("/articles", article.List)
		api.GET("/articles/max/bycomment", article.ListMaxComment)
		api.GET("/articles/max/bybrowse", article.ListMaxBrowse)
		api.GET("/articles/top/global", article.Tops)
		api.GET("/articles/info/:id", article.Info)
		api.GET("/articles/user/:userID", article.UserArticleList)
		api.POST("/articles/create", middleware.SigninRequired,
			article.Create)
		api.POST("/articles/top/:id", middleware.EditorRequired,
			article.Top)
		api.PUT("/articles/update", middleware.SigninRequired,
			article.Update)
		api.DELETE("/articles/delete/:id", middleware.SigninRequired,
			article.Delete)
		api.DELETE("/articles/deltop/:id", middleware.EditorRequired,
			article.DeleteTop)

		api.GET("/collects", collect.Collects)
		api.GET("/collects/folders/withsource", middleware.SigninRequired,
			collect.FoldersWithSource)
		api.GET("/collects/user/:userID/folders", collect.Folders)
		api.POST("/collects/create", middleware.SigninRequired,
			collect.CreateCollect)
		api.POST("/collects/folder/create", middleware.SigninRequired,
			collect.CreateFolder)
		api.DELETE("/collects/delete/:id", middleware.SigninRequired,
			collect.DeleteCollect)

		api.GET("/comments/user/:userID", comment.UserCommentList)
		api.GET("/comments/source/:sourceName/:sourceID", comment.SourceComments)
		api.POST("/comments/create", middleware.SigninRequired,
			comment.Create)
		api.PUT("/comments/update", middleware.SigninRequired,
			comment.Update)
		api.DELETE("/comments/delete/:id", middleware.SigninRequired,
			comment.Delete)

		api.GET("/votes", vote.List)
		api.GET("/votes/info/:id", vote.Info)
		api.GET("/votes/max/bybrowse", vote.ListMaxBrowse)
		api.GET("/votes/max/bycomment", vote.ListMaxComment)
		api.GET("/votes/user/:userID", vote.UserVoteList)
		api.POST("/votes/create", middleware.EditorRequired,
			vote.Create)
		api.POST("/votes/item/create", middleware.EditorRequired,
			vote.CreateVoteItem)
		api.POST("/votes/uservote/:id", middleware.SigninRequired,
			vote.UserVoteVoteItem)
		api.PUT("/votes/update", middleware.EditorRequired,
			vote.Update)
		api.PUT("/votes/item/edit", middleware.EditorRequired,
			vote.EditVoteItem)
		api.DELETE("/votes/delete/:id", middleware.EditorRequired,
			vote.Delete)
		api.DELETE("/votes/item/delete/:id", middleware.EditorRequired,
			vote.DeleteItem)

		api.GET("/books", book.List)
		api.GET("/books/info/:id", book.Info)
		api.GET("/books/chapters/:bookID", book.Chapters)
		api.GET("/books/chapter/:chapterID", book.Chapter)
		api.POST("/books", middleware.EditorRequired,
			book.Create)
		api.POST("/books/chapters", middleware.EditorRequired,
			book.CreateChapter)
		api.PUT("/books/update", middleware.EditorRequired,
			book.Update)
		api.PUT("/books/updatename", middleware.EditorRequired,
			book.UpdateName)
		api.PUT("/books/publish/:bookID", middleware.EditorRequired,
			book.Publish)
		api.PUT("/books/chapters/content", middleware.EditorRequired,
			book.UpdateChapterContent)
		api.PUT("/books/chapters/updatename", middleware.EditorRequired,
			book.UpdateChapterName)
		api.DELETE("/books/chapters/:chapterID", middleware.EditorRequired,
			book.DeleteChapter)
	}

	adminAPI := router.Group(apiPrefix+"/admin", middleware.RefreshTokenCookie, middleware.AdminRequired)
	{
		adminAPI.POST("/keyvalueconfig", keyvalueconfig.SetKeyValue)

		adminAPI.GET("/users", user.AllList)

		adminAPI.GET("/categories", category.List)
		adminAPI.POST("/categories/create", category.Create)
		adminAPI.PUT("/categories/update", category.Update)

		adminAPI.GET("/articles", article.AllList)
		adminAPI.PUT("/articles/status/update", article.UpdateStatus)

		adminAPI.GET("/comments", comment.Comments)
		adminAPI.PUT("/comments/update/status/:id", comment.UpdateStatus)

		adminAPI.GET("/crawl/account", crawler.CrawlAccount)
		adminAPI.POST("/crawl", crawler.Crawl)
		adminAPI.POST("/customcrawl", crawler.CustomCrawl)
		adminAPI.POST("/crawl/account", crawler.CreateAccount)

		adminAPI.POST("/pushBaiduLink", baidu.PushToBaidu)
	}
}
