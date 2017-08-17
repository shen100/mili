package route

import (
	"gopkg.in/kataras/iris.v6"
	"golang123/config"
	"golang123/controller/common"
	"golang123/controller/auth"
	"golang123/controller/category"
	"golang123/controller/article"
	"golang123/controller/collect"
	"golang123/controller/comment"
	"golang123/controller/vote"
	"golang123/controller/user"
	"golang123/controller/message"
)

// Route 路由
func Route(app *iris.Framework) {
	apiPrefix   := config.APIConfig.Prefix

	router := app.Party(apiPrefix) 
	{	
		router.Post("/signin",                   user.Signin)
		router.Post("/signup",                   user.Signup)
		router.Post("/signout",                  user.Signout)
		router.Get("/active/verify/:id/:secret", user.VerifyActiveLink)
		router.Post("/active/:id/:secret",       user.ActiveAccount)
		router.Post("/reset",                    user.ResetPasswordMail)
		router.Get("/reset/verify/:id/:secret",  user.VerifyResetPasswordLink)
		router.Post("/reset/:id/:secret",        user.ResetPassword)

		router.Get("/user/info",             auth.SigninRequired,  
											 user.Info)
		router.Post("/user/update",          auth.ActiveRequired,       
										     user.UpdateInfo)
		router.Post("/user/password/update", auth.ActiveRequired,       
											 user.UpdatePassword)
		router.Get("/user/score/top10",      user.Top10)
		router.Get("/user/score/top100",     user.Top100)
		router.Post("/upload",               auth.ActiveRequired,          
											 common.Upload)
		router.Get("/message/unread",        auth.SigninRequired,  
											 message.Unread)
		router.Get("/message/unread/count",  auth.SigninRequired,  
											 message.UnreadCount)

		router.Get("/categories",           category.List)

		router.Get("/articles",                article.List)
		router.Get("/articles/recent/:userID", article.RecentList)
		router.Get("/articles/maxcomment",     article.ListMaxComment)
		router.Get("/articles/maxbrowse",      article.ListMaxBrowse)
		router.Get("/article/:id",             article.Info)
		router.Post("/article/create",         auth.ActiveRequired, 
										       article.Create)
		router.Post("/article/update",         auth.ActiveRequired,    
											   article.Update)
											   
		router.Post("/collect/create",      auth.ActiveRequired,
											collect.Collect)
		router.Post("/collect/delete",      auth.ActiveRequired,
										    collect.DeleteCollect)
		router.Get("/collects",             auth.SigninRequired,
											collect.List)
		router.Post("/comment/create",      auth.ActiveRequired,
											comment.Create)
		router.Get("/votes",                vote.List)
		router.Post("/vote/create",         auth.EditorRequired,
											vote.Create)
		router.Post("/vote/delete",         auth.EditorRequired,
											vote.Delete)
		router.Get("/vote/:id",             vote.Info)
		router.Post("/vote/item/create",    auth.EditorRequired,
											vote.CreateVoteItem)
		router.Post("/vote/item/edit",      auth.EditorRequired,
											vote.EditVoteItem)
		router.Post("/vote/uservote/:id",   auth.ActiveRequired,
											vote.UserVoteVoteItem)
    }

	adminRouter := app.Party(apiPrefix + "/admin", auth.AdminRequired)
	{
		adminRouter.Get("/categories",               category.AllList)
		adminRouter.Post("/category/create",         category.Create)
		adminRouter.Post("/category/update",         category.Update)
		adminRouter.Post("/category/status/update",  category.UpdateStatus)

		adminRouter.Get("/articles",                 article.AllList)
		adminRouter.Post("/article/status/update",   article.UpdateStatus)
    }
}