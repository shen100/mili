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

var selectorMap = map[int]map[string]string{
	model.ArticleFromJianShu: map[string]string{
		"ListItemSelector":  ".note-list li",
		"ItemTitleSelector": ".title",
		"TitleSelector":     ".article .title",
		"ContentSelector":   ".show-content",
	},
	model.ArticleFromZhihu: map[string]string{
		"ListItemSelector":  ".PostListItem",
		"ItemTitleSelector": ".PostListItem-info a",
		"TitleSelector":     ".PostIndex-title",
		"ContentSelector":   ".PostIndex-content",
	},
	model.ArticleFromHuxiu: map[string]string{
		"ListItemSelector":  ".mod-art",
		"ItemTitleSelector": ".mob-ctt h2 a",
		"TitleSelector":     ".t-h1",
		"ContentSelector":   ".article-content-wrap",
	},
}

var sourceHTMLMap = map[int][]string{
	model.ArticleFromJianShu: []string{
		"<div id=\"golang123-content-outter-footer\">",
		"<blockquote>",
		"<p>来源: <a href=\"https://www.jianshu.com/\" target=\"_blank\">简书</a><br>",
		"原文: <a href=\"{articleURL}\" target=\"_blank\">{title}</a></p>",
		"</blockquote>",
		"</div>",
	},
	model.ArticleFromZhihu: []string{
		"<div id=\"golang123-content-outter-footer\">",
		"<blockquote>",
		"<p>来源: <a href=\"https://www.zhihu.com\" target=\"_blank\">知乎</a><br>",
		"原文: <a href=\"{articleURL}\" target=\"_blank\">{title}</a></p>",
		"</blockquote>",
		"</div>",
	},
	model.ArticleFromHuxiu: []string{
		"<div id=\"golang123-content-outter-footer\">",
		"<blockquote>",
		"<p>来源: <a href=\"https://www.huxiu.com\" target=\"_blank\">虎嗅</a><br>",
		"原文: <a href=\"{articleURL}\" target=\"_blank\">{title}</a></p>",
		"</blockquote>",
		"</div>",
	},
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

func crawlContent(pageURL string, from int, crawlExist bool) map[string]string {
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
	title := articleDOC.Find(selectorMap[from]["TitleSelector"]).Text()
	if title == "" {
		return nil
	}
	contentDOM := articleDOC.Find(selectorMap[from]["ContentSelector"])
	imgs := contentDOM.Find("img")
	if imgs.Length() > 0 {
		imgs.Each(func(j int, img *goquery.Selection) {
			imgURL, exists := img.Attr("src")
			var ext string
			if !exists {
				if from != model.ArticleFromJianShu {
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

			if imgURL == "" || from == model.ArticleFromZhihu && strings.Index(imgURL, "data:image/svg+xml;utf8,") == 0 {
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

	sourceHTML := strings.Join(sourceHTMLMap[from], "")
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

func crawlList(listURL string, user model.User, category model.Category, from int, crawlExist bool, wg *sync.WaitGroup) {
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
	doc.Find(selectorMap[from]["ListItemSelector"]).Each(func(i int, s *goquery.Selection) {
		articleLink := s.Find(selectorMap[from]["ItemTitleSelector"])
		fmt.Println(s.Html())
		fmt.Println(articleLink.Html())
		href, exists := articleLink.Attr("href")
		if exists {
			url, err := utils.RelativeURLToAbsoluteURL(href, listURL)
			if err == nil {
				articleURLArr = append(articleURLArr, url)
			}
		}
	})

	for i := 0; i < len(articleURLArr); i++ {
		articleMap := crawlContent(articleURLArr[i], from, crawlExist)
		if articleMap != nil {
			createArticle(user, category, from, articleMap)
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

	if jsonData.Scope == model.CrawlerScopeList {
		var wg sync.WaitGroup
		for i := 0; i < len(jsonData.URLS); i++ {
			wg.Add(1)
			go crawlList(jsonData.URLS[i], user, category, jsonData.From, jsonData.CrawlExist, &wg)
		}
		wg.Wait()
	} else if jsonData.Scope == model.CrawlerScopePage {
		for i := 0; i < len(jsonData.URLS); i++ {
			data := crawlContent(jsonData.URLS[i], jsonData.From, jsonData.CrawlExist)
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
