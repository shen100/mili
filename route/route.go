package route

import (
	"github.com/gin-gonic/gin"
	"github.com/shen100/golang123/config"
	"github.com/shen100/golang123/controller/user"
)

// Route 路由
func Route(router *gin.Engine) {
	apiPrefix := config.ServerConfig.APIPrefix

	api := router.Group(apiPrefix)

	api.POST("/signin", user.Signin)
	// api.Post("/signup", user.Signup)
	// api.Post("/signout", user.Signout)
	// api.Post("/active/sendmail", user.ActiveSendMail)
	// api.Post("/active/:id/:secret", user.ActiveAccount)
	// api.Post("/reset", user.ResetPasswordMail)
	// api.Get("/reset/verify/:id/:secret", user.VerifyResetPasswordLink)
	// api.Post("/reset/:id/:secret", user.ResetPassword)

	// api.Get("/user/info/public/:id", user.PublicInfo)
	// api.Get("/user/info", auth.SigninRequired,
	// 	user.SecretInfo)
	// api.Get("/user/info/detail", auth.SigninRequired,
	// 	user.InfoDetail)
	// api.Post("/user/update/:field", auth.ActiveRequired,
	// 	user.UpdateInfo)
	// api.Post("/user/password/update", auth.ActiveRequired,
	// 	user.UpdatePassword)
	// api.Get("/user/score/top10", user.Top10)
	// api.Get("/user/score/top100", user.Top100)
	// api.Post("/user/career/add", auth.ActiveRequired,
	// 	user.AddCareer)
	// api.Post("/user/school/add", auth.ActiveRequired,
	// 	user.AddSchool)
	// api.Post("/user/career/delete/:id", auth.ActiveRequired,
	// 	user.DeleteCareer)
	// api.Post("/user/school/delete/:id", auth.ActiveRequired,
	// 	user.DeleteSchool)
	// api.Post("/user/updateavatar", auth.ActiveRequired,
	// 	user.UpdateAvatar)

	// api.Post("/upload", auth.ActiveRequired,
	// 	common.UploadHandler)

	// api.Get("/message/unread", auth.SigninRequired,
	// 	message.Unread)
	// api.Get("/message/unread/count", auth.SigninRequired,
	// 	message.UnreadCount)

	// api.Get("/categories", category.List)

	// api.Get("/articles", article.List)
	// api.Get("/articles/user/:userID", article.UserArticleList)
	// api.Get("/articles/maxcomment", article.ListMaxComment)
	// api.Get("/articles/maxbrowse", article.ListMaxBrowse)
	// api.Get("/article/{id:int min(1)}", article.Info)
	// api.Post("/article/create", auth.ActiveRequired,
	// 	article.Create)
	// api.Post("/article/update", auth.ActiveRequired,
	// 	article.Update)
	// api.Post("/article/delete/:id", auth.ActiveRequired,
	// 	article.Delete)
	// api.Get("/articles/top", article.Tops)
	// api.Post("/article/top/:id", auth.EditorRequired,
	// 	article.Top)
	// api.Post("/article/deltop/:id", auth.EditorRequired,
	// 	article.DeleteTop)

	// api.Post("/collect/folder/create", auth.ActiveRequired,
	// 	collect.CreateFolder)
	// api.Post("/collect/create", auth.ActiveRequired,
	// 	collect.CreateCollect)
	// api.Post("/collect/delete/:id", auth.ActiveRequired,
	// 	collect.DeleteCollect)
	// api.Get("/collect/folders/:userID", collect.Folders)
	// api.Get("/collect/folders/source", auth.ActiveRequired,
	// 	collect.FoldersWithSource)
	// api.Get("/collects", collect.Collects)

	// api.Post("/comment/create", auth.ActiveRequired,
	// 	comment.Create)
	// api.Post("/comment/delete/:id", auth.ActiveRequired,
	// 	comment.Delete)
	// api.Post("/comment/update", auth.ActiveRequired,
	// 	comment.Update)
	// api.Get("/comments/user/:userID", comment.UserCommentList)
	// api.Get("/comments/:sourceName/:sourceID", comment.SourceComments)

	// api.Get("/votes", vote.List)
	// api.Get("/votes/maxbrowse", vote.ListMaxBrowse)
	// api.Get("/votes/maxcomment", vote.ListMaxComment)
	// api.Get("/votes/user/:userID", vote.UserVoteList)
	// api.Post("/vote/create", auth.EditorRequired,
	// 	vote.Create)
	// api.Post("/vote/update", auth.EditorRequired,
	// 	vote.Update)
	// api.Post("/vote/delete/:id", auth.EditorRequired,
	// 	vote.Delete)
	// api.Get("/vote/:id", vote.Info)
	// api.Post("/vote/item/create", auth.EditorRequired,
	// 	vote.CreateVoteItem)
	// api.Post("/vote/item/edit", auth.EditorRequired,
	// 	vote.EditVoteItem)
	// api.Post("/vote/item/delete/:id", auth.EditorRequired,
	// 	vote.DeleteItem)
	// api.Post("/vote/uservote/:id", auth.ActiveRequired,
	// 	vote.UserVoteVoteItem)

	// adminAPI := app.Party(apiPrefix+"/admin", common.SessShiftExpiration, auth.AdminRequired)
	// {
	// 	adminAPI.Get("/categories", category.List)
	// 	adminAPI.Post("/category/create", category.Create)
	// 	adminAPI.Post("/category/update", category.Update)

	// 	adminAPI.Get("/articles", article.AllList)
	// 	adminAPI.Post("/article/status/update", article.UpdateStatus)

	// 	adminAPI.Get("/comments", comment.Comments)
	// 	adminAPI.Put("/comments/update/status/:id", comment.UpdateStatus)

	// 	adminAPI.Post("/crawl", crawler.Crawl)
	// 	adminAPI.Post("/crawl/account", crawler.CreateAccount)
	// 	adminAPI.Get("/crawl/account", crawler.CrawlAccount)

	// 	adminAPI.Post("/pushBaiduLink", baidu.PushToBaidu)

	// 	adminAPI.Get("/users", user.AllList)
	// }
}
