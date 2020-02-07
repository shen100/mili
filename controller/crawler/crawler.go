package crawler

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"

	"github.com/PuerkitoBio/goquery"
	"github.com/gin-gonic/gin"
	"github.com/shen100/golang123/config"
	"github.com/shen100/golang123/controller/common"
	"github.com/shen100/golang123/model"
	"github.com/shen100/golang123/utils"
)

type crawlSelector struct {
	From                  int
	ListItemSelector      string
	ListItemTitleSelector string
	TitleSelector         string
	ContentSelector       string
}

func createCrawlSelector(from int) crawlSelector {
	selector := crawlSelector{
		From: from,
	}
	switch from {
	case model.ArticleFromJianShu:
		selector.ListItemSelector = ".note-list li"
		selector.ListItemTitleSelector = ".title"
		selector.TitleSelector = ".article .title"
		selector.ContentSelector = ".show-content"
	case model.ArticleFromZhihu:
		selector.ListItemSelector = ".PostListItem"
		selector.ListItemTitleSelector = ".PostListItem-info a"
		selector.TitleSelector = ".PostIndex-title"
		selector.ContentSelector = ".PostIndex-content"
	case model.ArticleFromHuxiu:
		selector.ListItemSelector = ".mod-art"
		selector.ListItemTitleSelector = ".mob-ctt h2 a"
		selector.TitleSelector = ".t-h1"
		selector.ContentSelector = ".article-content-wrap"
	case model.ArticleFromCustom:
		selector.ListItemSelector = ""
		selector.ListItemTitleSelector = ""
		selector.TitleSelector = ""
		selector.ContentSelector = ""
	case model.ArticleFromNULL:
		selector.ListItemSelector = ""
		selector.ListItemTitleSelector = ""
		selector.TitleSelector = ""
		selector.ContentSelector = ""
	}
	return selector
}

type sourceHTML struct {
	from          int
	sourceHTMLStr string
}

func createSourceHTML(from int) string {
	var htmlArr []string
	switch from {
	case model.ArticleFromJianShu:
		htmlArr = []string{
			"<div id=\"golang123-content-outter-footer\">",
			"<blockquote>",
			"<p>来源: <a href=\"https://www.jianshu.com/\" target=\"_blank\">简书</a><br>",
			"原文: <a href=\"{articleURL}\" target=\"_blank\">{title}</a></p>",
			"</blockquote>",
			"</div>",
		}
	case model.ArticleFromZhihu:
		htmlArr = []string{
			"<div id=\"golang123-content-outter-footer\">",
			"<blockquote>",
			"<p>来源: <a href=\"https://www.zhihu.com\" target=\"_blank\">知乎</a><br>",
			"原文: <a href=\"{articleURL}\" target=\"_blank\">{title}</a></p>",
			"</blockquote>",
			"</div>",
		}
	case model.ArticleFromHuxiu:
		htmlArr = []string{
			"<div id=\"golang123-content-outter-footer\">",
			"<blockquote>",
			"<p>来源: <a href=\"https://www.huxiu.com\" target=\"_blank\">虎嗅</a><br>",
			"原文: <a href=\"{articleURL}\" target=\"_blank\">{title}</a></p>",
			"</blockquote>",
			"</div>",
		}
	case model.ArticleFromCustom:
		htmlArr = []string{
			"<div id=\"golang123-content-outter-footer\">",
			"<blockquote>",
			"<p>来源: <a href=\"{siteURL}\" target=\"_blank\">{siteName}</a><br>",
			"原文: <a href=\"{articleURL}\" target=\"_blank\">{title}</a></p>",
			"</blockquote>",
			"</div>",
		}
	case model.ArticleFromNULL:
		htmlArr = []string{}
	}
	return strings.Join(htmlArr, "")
}

func createArticle(user model.User, category model.Category, from int, data map[string]string) {
	var article model.Article
	article.Name = data["Title"]
	article.HTMLContent = data["Content"]
	article.ContentType = model.ContentTypeHTML
	article.UserID = user.ID
	article.Status = model.ArticleVerifying
	article.Categories = append(article.Categories, category)

	var crawlerArticle model.CrawlerArticle
	crawlerArticle.URL = data["URL"]
	crawlerArticle.Title = article.Name
	crawlerArticle.Content = article.HTMLContent
	crawlerArticle.From = from

	tx := model.DB.Begin()
	if err := tx.Create(&article).Error; err != nil {
		tx.Rollback()
		return
	}
	crawlerArticle.ArticleID = article.ID
	if err := tx.Create(&crawlerArticle).Error; err != nil {
		tx.Rollback()
		return
	}
	tx.Commit()
}

func crawlContent(pageURL string, crawlSelector crawlSelector, siteInfo map[string]string, crawlExist bool) map[string]string {
	var crawlerArticle model.CrawlerArticle
	if err := model.DB.Where("url = ?", pageURL).Find(&crawlerArticle).Error; err == nil {
		if !crawlExist {
			// 当crawlExist为false时，已抓取过的文章就不再抓取
			return nil
		}
	}
	articleDOC, err := goquery.NewDocument(pageURL)
	if err != nil {
		return nil
	}
	title := articleDOC.Find(crawlSelector.TitleSelector).Text()
	if title == "" && crawlSelector.From != model.ArticleFromNULL {
		return nil
	}
	contentDOM := articleDOC.Find(crawlSelector.ContentSelector)
	imgs := contentDOM.Find("img")
	if imgs.Length() > 0 {
		imgs.Each(func(j int, img *goquery.Selection) {
			imgURL, exists := img.Attr("src")
			var ext string
			if !exists {
				if crawlSelector.From != model.ArticleFromJianShu {
					return
				}
				originalSrc, originalExists := img.Attr("data-original-src")
				if originalExists && originalSrc != "" {
					tempImgURL, tempErr := utils.RelativeURLToAbsoluteURL(originalSrc, pageURL)
					if tempErr != nil || tempImgURL == "" {
						return
					}
					imgURL = tempImgURL
					resp, err := http.Head(imgURL)
					if err != nil {
						fmt.Println(err.Error())
						return
					}

					defer resp.Body.Close()

					contentType := resp.Header.Get("content-type")
					if contentType == "image/jpeg" {
						ext = ".jpg"
					} else if contentType == "image/gif" {
						ext = ".gif"
					} else if contentType == "image/png" {
						ext = ".png"
					}
				}
			}

			if imgURL == "" || crawlSelector.From == model.ArticleFromZhihu && strings.Index(imgURL, "data:image/svg+xml;utf8,") == 0 {
				actualsrc, actualsrcExists := img.Attr("data-actualsrc")
				if actualsrcExists && actualsrc != "" {
					imgURL = actualsrc
				}
			}
			var imgURLErr error
			imgURL, imgURLErr = utils.RelativeURLToAbsoluteURL(imgURL, pageURL)
			if imgURLErr != nil || imgURL == "" {
				return
			}
			urlData, urlErr := url.Parse(imgURL)
			if urlErr != nil {
				return
			}

			if ext == "" {
				index := strings.LastIndex(urlData.Path, ".")
				if index >= 0 {
					ext = urlData.Path[index:]
				}
			}

			resp, err := http.Get(imgURL)

			if err != nil {
				return
			}

			defer resp.Body.Close()

			imgUploadedInfo := model.GenerateImgUploadedInfo(ext)
			if err := os.MkdirAll(imgUploadedInfo.UploadDir, 0777); err != nil {
				fmt.Println(err.Error())
				return
			}
			out, outErr := os.OpenFile(imgUploadedInfo.UploadFilePath, os.O_WRONLY|os.O_CREATE, 0666)
			if outErr != nil {
				fmt.Println(outErr.Error())
				return
			}

			defer out.Close()

			if _, err := io.Copy(out, resp.Body); err != nil {
				fmt.Println(err.Error())
				return
			}
			img.SetAttr("src", imgUploadedInfo.ImgURL)
		})
	}
	contentDOM.Find("a").Each(func(j int, a *goquery.Selection) {
		oldHref, exists := a.Attr("href")
		if exists {
			href, err := utils.RelativeURLToAbsoluteURL(oldHref, pageURL)
			if err == nil {
				a.SetAttr("href", href)
			}
		}
	})
	articleHTML, htmlErr := contentDOM.Html()
	if htmlErr != nil {
		return nil
	}

	sourceHTML := createSourceHTML(crawlSelector.From)
	if crawlSelector.From == model.ArticleFromCustom {
		sourceHTML = strings.Replace(sourceHTML, "{siteURL}", siteInfo["siteURL"], -1)
		sourceHTML = strings.Replace(sourceHTML, "{siteName}", siteInfo["siteName"], -1)
	}
	sourceHTML = strings.Replace(sourceHTML, "{title}", title, -1)
	sourceHTML = strings.Replace(sourceHTML, "{articleURL}", pageURL, -1)
	articleHTML += sourceHTML
	articleHTML = "<div id=\"golang123-content-outter\">" + articleHTML + "</div>"
	return map[string]string{
		"Title":   title,
		"Content": articleHTML,
		"URL":     pageURL,
	}
}

func crawlList(listURL string, user model.User, category model.Category, crawlSelector crawlSelector, siteInfo map[string]string, crawlExist bool, wg *sync.WaitGroup) {
	defer wg.Done()

	if _, err := url.Parse(listURL); err != nil {
		return
	}

	doc, docErr := goquery.NewDocument(listURL)
	if docErr != nil {
		fmt.Println(docErr.Error())
		return
	}

	var articleURLArr []string
	doc.Find(crawlSelector.ListItemSelector).Each(func(i int, s *goquery.Selection) {
		articleLink := s.Find(crawlSelector.ListItemTitleSelector)
		fmt.Println(s.Html())
		fmt.Println(articleLink.Html())
		href, exists := articleLink.Attr("href")
		href = strings.TrimSpace(href)
		if exists {
			url, err := utils.RelativeURLToAbsoluteURL(href, listURL)
			if err == nil {
				articleURLArr = append(articleURLArr, url)
			}
		}
	})

	for i := 0; i < len(articleURLArr); i++ {
		articleMap := crawlContent(articleURLArr[i], crawlSelector, siteInfo, crawlExist)
		if articleMap != nil {
			createArticle(user, category, crawlSelector.From, articleMap)
		}
	}
}

// Crawl 抓取文章
func Crawl(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	type JSONData struct {
		URLS       []string `json:"urls"`
		From       int      `json:"from"`
		CategoryID int      `json:"categoryID"`
		Scope      string   `json:"scope"`
		CrawlExist bool     `json:"crawlExist"`
	}
	var jsonData JSONData
	if err := c.ShouldBindJSON(&jsonData); err != nil {
		SendErrJSON("参数无效", c)
		return
	}

	if jsonData.From != model.ArticleFromJianShu && jsonData.From != model.ArticleFromZhihu &&
		jsonData.From != model.ArticleFromHuxiu {
		SendErrJSON("无效的from", c)
		return
	}
	if jsonData.Scope != model.CrawlerScopePage && jsonData.Scope != model.CrawlerScopeList {
		SendErrJSON("无效的scope", c)
		return
	}

	iuser, _ := c.Get("user")
	user := iuser.(model.User)

	if user.Name != config.ServerConfig.CrawlerName {
		SendErrJSON("您没有权限执行此操作, 请使用爬虫账号", c)
		return
	}

	var category model.Category
	if err := model.DB.First(&category, jsonData.CategoryID).Error; err != nil {
		fmt.Printf(err.Error())
		SendErrJSON("错误的categoryID", c)
		return
	}

	crawlSelector := createCrawlSelector(jsonData.From)

	if jsonData.Scope == model.CrawlerScopeList {
		var wg sync.WaitGroup
		for i := 0; i < len(jsonData.URLS); i++ {
			wg.Add(1)
			go crawlList(jsonData.URLS[i], user, category, crawlSelector, nil, jsonData.CrawlExist, &wg)
		}
		wg.Wait()
	} else if jsonData.Scope == model.CrawlerScopePage {
		for i := 0; i < len(jsonData.URLS); i++ {
			data := crawlContent(jsonData.URLS[i], crawlSelector, nil, jsonData.CrawlExist)
			if data != nil {
				createArticle(user, category, jsonData.From, data)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "抓取完成",
		"data":  gin.H{},
	})
}

// CustomCrawl 自定义抓取
func CustomCrawl(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	type JSONData struct {
		URLS                  []string `json:"urls"`
		From                  int      `json:"from"`
		CategoryID            int      `json:"categoryID"`
		Scope                 string   `json:"scope"`
		CrawlExist            bool     `json:"crawlExist"`
		ListItemSelector      string   `json:"listItemSelector"`
		ListItemTitleSelector string   `json:"listItemTitleSelector"`
		TitleSelector         string   `json:"titleSelector"`
		ContentSelector       string   `json:"contentSelector"`
		SiteURL               string   `json:"siteURL" binding:"required,url"`
		SiteName              string   `json:"siteName" binding:"required"`
	}
	var jsonData JSONData
	if err := c.ShouldBindJSON(&jsonData); err != nil {
		SendErrJSON("参数无效", c)
		return
	}

	if jsonData.From != model.ArticleFromCustom {
		SendErrJSON("无效的from", c)
		return
	}
	if jsonData.Scope != model.CrawlerScopePage && jsonData.Scope != model.CrawlerScopeList {
		SendErrJSON("无效的scope", c)
		return
	}

	iuser, _ := c.Get("user")
	user := iuser.(model.User)

	if user.Name != config.ServerConfig.CrawlerName {
		SendErrJSON("您没有权限执行此操作, 请使用爬虫账号", c)
		return
	}

	var category model.Category
	if err := model.DB.First(&category, jsonData.CategoryID).Error; err != nil {
		fmt.Printf(err.Error())
		SendErrJSON("错误的categoryID", c)
		return
	}

	crawlSelector := createCrawlSelector(model.ArticleFromCustom)
	crawlSelector.ListItemSelector = jsonData.ListItemSelector
	crawlSelector.ListItemTitleSelector = jsonData.ListItemTitleSelector
	crawlSelector.TitleSelector = jsonData.TitleSelector
	crawlSelector.ContentSelector = jsonData.ContentSelector

	siteInfo := map[string]string{
		"siteURL":  jsonData.SiteURL,
		"siteName": jsonData.SiteName,
	}
	if jsonData.Scope == model.CrawlerScopeList {
		var wg sync.WaitGroup
		for i := 0; i < len(jsonData.URLS); i++ {
			wg.Add(1)
			go crawlList(jsonData.URLS[i], user, category, crawlSelector, siteInfo, jsonData.CrawlExist, &wg)
		}
		wg.Wait()
	} else if jsonData.Scope == model.CrawlerScopePage {
		for i := 0; i < len(jsonData.URLS); i++ {
			data := crawlContent(jsonData.URLS[i], crawlSelector, siteInfo, jsonData.CrawlExist)
			if data != nil {
				createArticle(user, category, crawlSelector.From, data)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "抓取完成",
		"data":  gin.H{},
	})
}

// CrawlNotSaveContent 抓取的内容直接返回，而不保存到数据库
func CrawlNotSaveContent(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	type JSONData struct {
		URL             string `json:"url"`
		TitleSelector   string `json:"titleSelector"`
		ContentSelector string `json:"contentSelector"`
	}
	var jsonData JSONData
	if err := c.ShouldBindJSON(&jsonData); err != nil {
		SendErrJSON("参数无效", c)
		return
	}

	crawlSelector := createCrawlSelector(model.ArticleFromNULL)
	crawlSelector.TitleSelector = jsonData.TitleSelector
	crawlSelector.ContentSelector = jsonData.ContentSelector

	data := crawlContent(jsonData.URL, crawlSelector, nil, true)

	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data": gin.H{
			"content": data["Content"],
		},
	})
}

// CrawlAccount 获取爬虫账号
func CrawlAccount(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var users []model.User
	if err := model.DB.Where("name = ?", config.ServerConfig.CrawlerName).Find(&users).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", c)
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"errNo": model.ErrorCode.SUCCESS,
		"msg":   "success",
		"data":  users,
	})
}

// CreateAccount 创建爬虫账号
func CreateAccount(c *gin.Context) {
	SendErrJSON := common.SendErrJSON
	var users []model.User
	if err := model.DB.Where("name = ?", config.ServerConfig.CrawlerName).Find(&users).Error; err != nil {
		fmt.Println(err.Error())
		SendErrJSON("error", c)
		return
	}
	if len(users) <= 0 {
		var user model.User
		user.Name = config.ServerConfig.CrawlerName
		user.Role = model.UserRoleCrawler
		user.AvatarURL = "/images/avatar/spider.png"
		user.Status = model.UserStatusActived
		if err := model.DB.Save(&user).Error; err != nil {
			fmt.Print(err.Error())
			SendErrJSON("error", c)
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"errNo": model.ErrorCode.SUCCESS,
			"msg":   "success",
			"data":  []model.User{user},
		})
		return
	}
	SendErrJSON("爬虫账号已存在", c)
}
