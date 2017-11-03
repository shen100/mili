package crawler

import (
	"fmt"
	"strings"
	"github.com/PuerkitoBio/goquery"
	"net/url"
	"github.com/shen100/golang123/controller/common"
	"github.com/kataras/iris"
	"github.com/shen100/golang123/model"
)

// jianShuCrawl 简书爬虫
func jianShuCrawl(pageURL string, ch chan map[string]string) {
	var theURL *url.URL
	var urlErr error
	if theURL, urlErr = url.Parse(pageURL); urlErr != nil {
		close(ch)
		return
	}

	doc, docErr := goquery.NewDocument(pageURL)
	if docErr != nil {
		close(ch)
		return
	}

	var articleURLArr []string
	doc.Find(".note-list").Find("li").Each(func(i int, s *goquery.Selection) {
		articleLink := s.Find(".title")
		href, exists := articleLink.Attr("href")
		if exists {
			url := href
			if strings.Index(url, "http") == -1 {
				url = theURL.Scheme + "://" + theURL.Host + href
			}
			articleURLArr = append(articleURLArr, url)
		}
	})

	for i := 0; i < len(articleURLArr); i++ {
		var crawlerArticle model.CrawlerArticle
		if err := model.DB.Where("url = ?", articleURLArr[i]).Find(&crawlerArticle).Error; err == nil {
			// 已抓取过的文章就不再抓取
			continue
		}
		articleDOC, err := goquery.NewDocument(articleURLArr[i])
		if err == nil {
			title := articleDOC.Find(".article .title").Text()
			if title != "" {
				articleHTML, htmlErr := articleDOC.Find(".show-content").Html()
				if htmlErr == nil {
					articleHTML = "<div id=\"golang123-content-outter\">" + articleHTML + "</div>"
					ch <- map[string]string{
						"Title": title,
						"Content": articleHTML,	
						"URL": articleURLArr[i],
					}
				}
			}
		}
	}
	close(ch)
}

// Crawl 抓取文章
func Crawl(ctx iris.Context) {
	SendErrJSON := common.SendErrJSON
	type JSONData struct {
		URL        string `json:"url"`
		From       int    `json:"from"`
		CategoryID int    `json:"categoryID"`
	}
	var jsonData JSONData
	if err := ctx.ReadJSON(&jsonData); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}
	var user model.User
	if err := model.DB.Where("name = 'golang123'").Find(&user).Error; err != nil {
		SendErrJSON("error", ctx)
		return	
	}
	var category model.Category
	if err := model.DB.First(&category, jsonData.CategoryID).Error; err != nil {
		fmt.Printf(err.Error())
		SendErrJSON("错误的categoryID", ctx)
		return
	}
	ch := make(chan map[string]string)
	switch jsonData.From {
	case model.ArticleFromJianShu:
		go jianShuCrawl(jsonData.URL, ch)
		break
	default:
		SendErrJSON("参数无效", ctx)
		return	
	}
	for {
		data, ok := <- ch
		if ok {
			var article model.Article
			article.Name        = data["Title"]
			article.HTMLContent = data["Content"]
			article.ContentType = model.ContentTypeHTML
			article.UserID      = user.ID
			article.Status      = model.ArticleVerifying
			article.Categories  = append(article.Categories, category)

			var crawlerArticle model.CrawlerArticle
			crawlerArticle.URL     = data["URL"]
			crawlerArticle.Title   = article.Name
			crawlerArticle.Content = article.HTMLContent
			crawlerArticle.From    = model.ArticleFromJianShu

			tx := model.DB.Begin()
			if err := tx.Create(&article).Error; err != nil {
				tx.Rollback()
			}
			if err := tx.Create(&crawlerArticle).Error; err != nil {
				tx.Rollback()
			}
			tx.Commit()
		} else {
			break
		}
	}
	SendErrJSON("抓却完成", ctx)
	return	
}