package crawler

import (
	"github.com/shen100/golang123/manager"
	"github.com/shen100/golang123/utils"
	"io"
	"os"
	//"mime"
	"net/http"
	"fmt"
	"strings"
	"github.com/PuerkitoBio/goquery"
	"net/url"
	"github.com/shen100/golang123/controller/common"
	"github.com/kataras/iris"
	"github.com/shen100/golang123/model"
)

var selectorMap = map[int]map[string]string{
	model.ArticleFromJianShu: map[string]string{
		"PageURLSelector": ".note-list li",
		"PageTitleSelector": ".title",
		"TitleSelector": ".article .title",
		"ContentSelector": ".show-content",
	},
	model.ArticleFromWeixin: map[string]string{
		"PageURLSelector": ".news-list li",
		"PageTitleSelector": "h3 a",
		"TitleSelector": "#page-content .rich_media_title",
		"ContentSelector": ".rich_media_content",
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
	model.ArticleFromWeixin: []string{
		"<div id=\"golang123-content-outter-footer\">",
		"<blockquote>",
		"<p>来源: <a href=\"https://mp.weixin.qq.com\" target=\"_blank\">微信</a><br>",
		"原文: <a href=\"{articleURL}\" target=\"_blank\">{title}</a></p>",
		"</blockquote>",
		"</div>",
	},
}

func createArticle(user model.User, category model.Category, from int, data map[string]string) {
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
	crawlerArticle.From    = from
	
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

func isImgURLValid(imgURL string) bool {
	_, urlErr := url.Parse(imgURL)
	if urlErr != nil {
		return false
	}
	return true
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
			var imgURL string
			var exists bool
			if from == model.ArticleFromWeixin {
				imgURL, exists = img.Attr("data-src")	
			} else if from == model.ArticleFromJianShu {
				imgURL, exists = img.Attr("src")	
			}
			if exists && isImgURLValid(imgURL) {
				imgURL, _ = utils.RelativeURLToAbsoluteURL(imgURL, pageURL)
				var ext = ""
				if from == model.ArticleFromWeixin {
					imgExt, existsExt := img.Attr("data-type")	
					if !existsExt {
						return
					}
					ext = "." + imgExt
				} else if from == model.ArticleFromJianShu {
					urlData, _ := url.Parse(imgURL)
					index := strings.LastIndex(urlData.Path, ".")
					ext    = urlData.Path[index:]
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
			}

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

	sourceHTML := strings.Join(sourceHTMLMap[from],"")
	sourceHTML   = strings.Replace(sourceHTML, "{title}", title, -1)
	sourceHTML   = strings.Replace(sourceHTML, "{articleURL}", pageURL, -1)
	articleHTML += sourceHTML
	articleHTML  = "<div id=\"golang123-content-outter\">" + articleHTML + "</div>"
	return map[string]string{
		"Title": title,
		"Content": articleHTML,	
		"URL": pageURL,
	}
}

func crawlList(listURL string, from int, crawlExist bool, ch chan map[string]string) {
	if _, err := url.Parse(listURL); err != nil {
		close(ch)
		return
	}

	doc, docErr := goquery.NewDocument(listURL)
	if docErr != nil {
		close(ch)
		return
	}

	var articleURLArr []string
	doc.Find(selectorMap[from]["PageURLSelector"]).Each(func(i int, s *goquery.Selection) {
		articleLink := s.Find(selectorMap[from]["PageTitleSelector"])
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
			ch <- articleMap
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
		Scope      string `json:"scope"`
		CrawlExist bool   `json:"crawlExist"`
	}
	var jsonData JSONData
	if err := ctx.ReadJSON(&jsonData); err != nil {
		SendErrJSON("参数无效", ctx)
		return
	}

	if jsonData.From != model.ArticleFromJianShu && jsonData.From != model.ArticleFromWeixin {
		SendErrJSON("无效的from", ctx)
		return	
	}
	if jsonData.Scope != model.CrawlerScopePage && jsonData.Scope != model.CrawlerScopeList {
		SendErrJSON("无效的scope", ctx)
		return	
	}

	user, _ := manager.Sess.Start(ctx).Get("user").(model.User)

	// var user model.User	
	// if err := model.DB.Where("name = 'golang123'").Find(&user).Error; err != nil {
	// 	SendErrJSON("error", ctx)
	// 	return	
	// }

	if user.Name != "超级爬虫" {
		SendErrJSON("您没有权限执行此操作", ctx)
		return
	}

	var category model.Category
	if err := model.DB.First(&category, jsonData.CategoryID).Error; err != nil {
		fmt.Printf(err.Error())
		SendErrJSON("错误的categoryID", ctx)
		return
	}

	if jsonData.Scope == model.CrawlerScopeList {
		ch := make(chan map[string]string, 5)
		
		go crawlList(jsonData.URL, jsonData.From, jsonData.CrawlExist, ch)
			
		for {
			data, ok := <- ch
			if ok {
				createArticle(user, category, jsonData.From, data)
			} else {
				break
			}
		}
	}

	ctx.JSON(iris.Map{
		"errNo" : model.ErrorCode.SUCCESS,
		"msg"   : "抓取完成",
		"data"  : iris.Map{},
	})
}