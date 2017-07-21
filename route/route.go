package route

import (
	"gopkg.in/kataras/iris.v6"
	"golang123/config"
	"golang123/controller/admin"
	"golang123/controller/category"
)

// Route 路由
func Route(app *iris.Framework) {
	apiPrefix   := config.APIConfig.Prefix

	router := app.Party(apiPrefix) 
	{
		router.Get("/categories",    category.List)
    }

	adminRouter := app.Party(apiPrefix + "/admin", admin.Authentication) 
	{
		adminRouter.Get("/categories",               category.AllList)
		adminRouter.Post("/category/create",         category.Create)
		adminRouter.Post("/category/update",         category.Update)
		adminRouter.Post("/category/status/update",  category.UpdateStatus)
    }
}