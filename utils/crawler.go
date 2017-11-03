package utils

import (
	"strings"
	"net/url"
	"github.com/PuerkitoBio/goquery"
)

// JianShuCrawl 简书爬虫
func JianShuCrawl(pageURL string, htmlCh chan map[string]string) {
	var theURL *url.URL
	var urlErr error
	if theURL, urlErr = url.Parse(pageURL); urlErr != nil {
		close(htmlCh)
		return
	}

	doc, docErr := goquery.NewDocument(pageURL)
	if docErr != nil {
		close(htmlCh)
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
		articleDOC, err := goquery.NewDocument(articleURLArr[i])
		if err == nil {
			title := articleDOC.Find(".article .title").Text()
			if title != "" {
				articleHTML, htmlErr := articleDOC.Find(".show-content").Html()
				if htmlErr == nil {
					articleHTML = "<div id=\"golang123-content-outter\">" + articleHTML + "</div>"
					htmlCh <- map[string]string{
						"Title": title,
						"Content": articleHTML,	
						"Url": articleURLArr[i],
					}
				}
			}
		}
	}
	close(htmlCh)
}