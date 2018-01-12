package router

import (
	"github.com/gin-gonic/gin"
	"github.com/shen100/golang123/config"
	"github.com/shen100/golang123/controller/article"
	"github.com/shen100/golang123/controller/baidu"
	"github.com/shen100/golang123/controller/category"
	"github.com/shen100/golang123/controller/collect"
	"github.com/shen100/golang123/controller/comment"
	"github.com/shen100/golang123/controller/common"
	"github.com/shen100/golang123/controller/crawler"
	"github.com/shen100/golang123/controller/user"
	"github.com/shen100/golang123/controller/vote"
	"github.com/shen100/golang123/middleware"
)

// Route 路由
func Route(router *gin.Engine) {
	apiPrefix := config.ServerConfig.APIPrefix

	api := router.Group(apiPrefix, middleware.RefreshTokenCookie)
	{
		api.POST("/signin", user.Signin)
		api.POST("/signup", user.Signup)
		api.POST("/signout", middleware.SigninRequired,
			user.Signout)
		api.POST("/active/sendmail", user.ActiveSendMail)
		api.POST("/active/user/:id/:secret", user.ActiveAccount)
		api.POST("/reset", user.ResetPasswordMail)
		api.POST("/reset/verify/:id/:secret", user.VerifyResetPasswordLink)
		api.POST("/reset/password/:id/:secret", user.ResetPassword)

		api.GET("/user/info", middleware.SigninRequired,
			user.SecretInfo)
		api.GET("/user/info/detail", middleware.SigninRequired,
			user.InfoDetail)
		api.PUT("/user/update/:field", middleware.ActiveRequired,
			user.UpdateInfo)
		api.PUT("/user/password/update", middleware.ActiveRequired,
			user.UpdatePassword)
		api.GET("/user/score/top10", user.Top10)
		api.GET("/user/score/top100", user.Top100)
		api.GET("/user/info/public/:id", user.PublicInfo)
		api.POST("/user/career/add", middleware.ActiveRequired,
			user.AddCareer)
		api.POST("/user/school/add", middleware.ActiveRequired,
			user.AddSchool)
		api.DELETE("/user/career/delete/:id", middleware.ActiveRequired,
			user.DeleteCareer)
		api.DELETE("/user/school/delete/:id", middleware.ActiveRequired,
			user.DeleteSchool)
		api.POST("/user/updateavatar", middleware.ActiveRequired,
			user.UpdateAvatar)

		api.POST("/upload", middleware.ActiveRequired,
			common.UploadHandler)

		// api.Get("/message/unread", auth.SigninRequired,
		// 	message.Unread)
		// api.Get("/message/unread/count", auth.SigninRequired,
		// 	message.UnreadCount)

		api.GET("/categories", category.List)

		api.GET("/articles", article.List)
		api.GET("/articles/info/:id", article.Info)
		api.GET("/articles/max/bycomment", article.ListMaxComment)
		api.GET("/articles/max/bybrowse", article.ListMaxBrowse)
		api.GET("/articles/top/global", article.Tops)
		api.GET("/articles/user/:userID", article.UserArticleList)
		api.POST("/article/create", middleware.ActiveRequired,
			article.Create)
		api.PUT("/article/update", middleware.ActiveRequired,
			article.Update)
		api.DELETE("/article/delete/:id", middleware.ActiveRequired,
			article.Delete)
		api.POST("/article/top/:id", middleware.EditorRequired,
			article.Top)
		api.POST("/article/deltop/:id", middleware.EditorRequired,
			article.DeleteTop)

		api.POST("/collect/folder/create", middleware.ActiveRequired,
			collect.CreateFolder)
		api.POST("/collect/create", middleware.ActiveRequired,
			collect.CreateCollect)
		api.POST("/collect/delete/:id", middleware.ActiveRequired,
			collect.DeleteCollect)
		api.GET("/collect/folders/withsource", middleware.SigninRequired,
			collect.FoldersWithSource)
		api.GET("/collect/user/:userID/folders", collect.Folders)
		api.GET("/collects", collect.Collects)

		api.POST("/comment/create", middleware.ActiveRequired,
			comment.Create)
		api.POST("/comment/delete/:id", middleware.ActiveRequired,
			comment.Delete)
		api.POST("/comment/update", middleware.ActiveRequired,
			comment.Update)
		api.GET("/comments/user/:userID", comment.UserCommentList)
		api.GET("/comments/source/:sourceName/:sourceID", comment.SourceComments)

		api.GET("/votes", vote.List)
		api.GET("/votes/maxbrowse", vote.ListMaxBrowse)
		api.GET("/votes/maxcomment", vote.ListMaxComment)
		api.GET("/votes/user/:userID", vote.UserVoteList)
		api.POST("/vote/create", middleware.EditorRequired,
			vote.Create)
		api.POST("/vote/update", middleware.EditorRequired,
			vote.Update)
		api.POST("/vote/delete/:id", middleware.EditorRequired,
			vote.Delete)
		api.GET("/vote/:id", vote.Info)
		api.POST("/vote/item/create", middleware.EditorRequired,
			vote.CreateVoteItem)
		api.POST("/vote/item/edit", middleware.EditorRequired,
			vote.EditVoteItem)
		api.POST("/vote/item/delete/:id", middleware.EditorRequired,
			vote.DeleteItem)
		api.POST("/vote/uservote/:id", middleware.ActiveRequired,
			vote.UserVoteVoteItem)
	}

	adminAPI := app.Party(apiPrefix+"/admin", middleware.RefreshTokenCookie, middleware.AdminRequired)
	{
		adminAPI.Get("/categories", category.List)
		adminAPI.Post("/category/create", category.Create)
		adminAPI.Post("/category/update", category.Update)

		adminAPI.Get("/articles", article.AllList)
		adminAPI.Post("/article/status/update", article.UpdateStatus)

		adminAPI.Get("/comments", comment.Comments)
		adminAPI.Put("/comments/update/status/:id", comment.UpdateStatus)

		adminAPI.Post("/crawl", crawler.Crawl)
		adminAPI.Post("/crawl/account", crawler.CreateAccount)
		adminAPI.Get("/crawl/account", crawler.CrawlAccount)

		adminAPI.Post("/pushBaiduLink", baidu.PushToBaidu)

		adminAPI.Get("/users", user.AllList)
	}
}
