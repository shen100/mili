package crawler

import (
	"github.com/shen100/golang123/utils"
	"io"
	"os"
	"mime"
	"net/http"
	"fmt"
	"strings"
	"github.com/PuerkitoBio/goquery"
	"net/url"
	"github.com/shen100/golang123/controller/common"
	"github.com/kataras/iris"
	"github.com/shen100/golang123/model"
)

func isImgURLValid(imgURL string) bool {
	urlData, urlErr := url.Parse(imgURL)
	if urlErr != nil {
		return false
	}

	var index = strings.LastIndex(urlData.Path, ".")
	if index < 0 {
		return false
	}

	var ext = urlData.Path[index:]
	if len(ext) == 1 {
		return false
	}
	var mimeType = mime.TypeByExtension(ext)

	if mimeType == "" {
		return false
	}	
	return true
}

// jianShuCrawl 简书爬虫
func jianShuCrawl(pageURL string, ch chan map[string]string) {
	if _, err := url.Parse(pageURL); err != nil {
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
			url, err := utils.RelativeURLToAbsoluteURL(href, pageURL)
			if err == nil {
				articleURLArr = append(articleURLArr, url)
			}
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
				contentDOM := articleDOC.Find(".show-content")
				imgs := contentDOM.Find("img")
				if imgs.Length() > 0 {
					imgs.Each(func(j int, img *goquery.Selection) {
						imgURL, exists := img.Attr("src")
						if exists && isImgURLValid(imgURL) {
							imgURL, _ = utils.RelativeURLToAbsoluteURL(imgURL, articleURLArr[i])
							urlData, _ := url.Parse(imgURL)
							index := strings.LastIndex(urlData.Path, ".")
							ext   := urlData.Path[index:]
							fmt.Println(imgURL)
							fmt.Println(urlData.Path)
							fmt.Println(ext)
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
						}
					})
				}
				articleHTML, htmlErr := contentDOM.Html()
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
	SendErrJSON("抓取完成", ctx)	
}