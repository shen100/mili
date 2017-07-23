package route

import (
	"gopkg.in/kataras/iris.v6"
	"golang123/config"
	"golang123/controller/admin"
	"golang123/controller/category"
	"golang123/controller/article"
	"golang123/controller/user"
)

// Route 路由
func Route(app *iris.Framework) {
	apiPrefix   := config.APIConfig.Prefix

	router := app.Party(apiPrefix) 
	{	
		router.Post("/login",           user.Login)

		router.Get("/categories",       category.List)

		router.Get("/articles",         article.List)
		router.Get("/article/:id",      article.Info)
		router.Post("/article/create",  article.Create)
		router.Post("/article/update",  article.Update)
    }

	adminRouter := app.Party(apiPrefix + "/admin", admin.Authentication) 
	{
		adminRouter.Get("/categories",               category.AllList)
		adminRouter.Post("/category/create",         category.Create)
		adminRouter.Post("/category/update",         category.Update)
		adminRouter.Post("/category/status/update",  category.UpdateStatus)

		adminRouter.Get("/articles",                 article.AllList)
		adminRouter.Post("/article/status/update",   article.UpdateStatus)
    }
}