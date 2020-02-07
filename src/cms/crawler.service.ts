import axios from 'axios';
import * as mime from 'mime';
import * as bluebird from 'bluebird';
import * as uuid from 'uuid/v4';
import * as moment from 'moment';
import * as url from 'url';
import * as cheerio from 'cheerio';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CrawlerArticle, CrawlerArticleFrom } from '../entity/crawler.entity';
import { Repository } from 'typeorm';
import { OSSService } from '../common/oss.service';
import { ListResult } from '../entity/listresult.entity';
import { CrawlerDto } from './dto/crawler.dto';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import { getContentTypeFromHeaders } from '../utils/common';

@Injectable()
export class CrawlerService {
    constructor(
        private readonly ossService: OSSService,
        @InjectRepository(CrawlerArticle)
        private readonly crawlerArticleRepository: Repository<CrawlerArticle>,
    ) {}

    encodeEntity(root) {
        if (!root || !root.children || !root.children.length) {
            return;
        }
        const keyArr = [`'`, '"', '&', '<', '>'];
        const valueArr = ['&apos;', '&quot;', '&amp;', '&lt;', '&gt;'];
        const entityMap = {};
        for (let i = 0; i < keyArr.length; i++) {
            entityMap[keyArr[i]] = valueArr[i];
        }

        let arr = [ root ];
        while (arr.length) {
            const node = arr[0];
            if ((node.type === 'root' || node.type === 'tag') && node.children && node.children.length) {
                arr = arr.concat(node.children);
            } else if (node.type === 'text') {
                node.data = ((node.data || '').replace(/[\&\'\>\<\"]/g, (name) => {
                    return entityMap[name];
                }));
            }
            arr.splice(0, 1);
        }
    }

    async crawlPage(pageURL: string, crawlerDto: CrawlerDto) {
        const crawlerArticle: CrawlerArticle = await this.crawlerArticleRepository.findOne({
            where: {
                url: pageURL,
            },
        });

        // 无来源，调抓取接口时，接口直接返回文章内容，不入库
        if (crawlerArticle && crawlerDto.from !== CrawlerArticleFrom.ArticleFromNULL) {
            return;
        }

        const pageResult = await axios.get(pageURL);

        const $ = cheerio.load(pageResult.data, { decodeEntities: false });

        const title = $(crawlerDto.titleSelector).text();
        if (!title && crawlerDto.from !== CrawlerArticleFrom.ArticleFromNULL) {
            throw new MyHttpException({
                message: '错误的标题选择器',
            });
        }
        const contentDOM = $(crawlerDto.contentSelector);

        if (!(contentDOM && contentDOM.length)) {
            throw new MyHttpException({
                message: '错误的正文选择器',
            });
        }
        const imgs = contentDOM.find('img');
        const imgURLArr = [];
        if (imgs && imgs.length) {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < imgs.length; i++) {
                const img = $(imgs[i]);
                let imgURL = img.attr('src') || img.attr('_src');
                imgURL = imgURL || img.attr('data-original-src'); // 简书
                // 知乎
                if (imgURL && imgURL.indexOf('data:image/svg+xml;utf8,') === 0) {
                    imgURL = img.attr('data-actualsrc');
                }
                // SegmentFault
                if (imgURL && (imgURL.indexOf('segmentfault.com') > 0
                    || imgURL.indexOf('segmentfault.com') > 0) && img.attr('data-src')) {
                    imgURL = img.attr('data-src');
                }
                imgURL = imgURL || img.attr('data-src');
                if (imgURL) {
                    imgURL = url.resolve(pageURL, imgURL);
                    imgURLArr.push(imgURL);
                }
            }
        }
        if (imgURLArr.length) {
            const now = moment();
            const uploadImgURLArr = await bluebird.map(imgURLArr, (imgURL) => {
                const urlData = url.parse(imgURL);
                let ext = '';
                const index = urlData.pathname.lastIndexOf('.');
                if (index >= 0) {
                    ext = urlData.pathname.substr(index);
                }
                const newPathname = '/' + now.year() + '/' + (now.month() + 1) + '/' + uuid();
                if (ext) {
                    return this.ossService.uploadFromStreamURL(imgURL, newPathname + ext);
                }
                // 不能用 head 方法，有的图片地址会二次跳转, 用head可能会 403
                return axios.get(imgURL).then((imgInfoRes) => {
                    const contentType = getContentTypeFromHeaders(imgInfoRes.headers);
                    ext = mime.getExtension(contentType);
                    ext = (ext && ext.charAt(0) !== '.') ? `.${ext}` : ext;
                    return this.ossService.uploadFromStreamURL(imgURL, newPathname + ext);
                });
            }, { concurrency: 20 });
            uploadImgURLArr.forEach((newImgURL, i) => {
                $(imgs[i]).attr('src', newImgURL);
            });
        }
        const links = contentDOM.find('a');
        if (links && links.length) {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < links.length; i++) {
                const link = $(links[i]);
                let linkURL = link.attr('href');
                if (linkURL) {
                    linkURL = url.resolve(pageURL, linkURL);
                    link.attr('href', linkURL);
                }
            }
        }

        this.encodeEntity(contentDOM[0]);

        let articleHTML = contentDOM.html();

        if (crawlerDto.from === CrawlerArticleFrom.ArticleFromNULL) {
            return `<div id="mili-content-outter">${articleHTML}</div>`;
        }
        let fromHTML = crawlerDto.fromTemplate;
        fromHTML = fromHTML.replace('{title}', title);
        fromHTML = fromHTML.replace('{articleURL}', pageURL);
        articleHTML = fromHTML + articleHTML;
        articleHTML = `<div id="mili-content-outter">${articleHTML}</div>`;

        await this.crawlerArticleRepository.insert({
            title,
            content: articleHTML,
            from: crawlerDto.from,
            url: pageURL,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return articleHTML;
    }

    async crawlList(listURL: string, crawlerDto: CrawlerDto) {
        if (crawlerDto.from === CrawlerArticleFrom.ArticleFromZhihu) {
            return await this.crawlZhihuList(listURL, crawlerDto);
        }
        if (crawlerDto.from === CrawlerArticleFrom.ArticleFromSegmentJuejin) {
            return await this.crawlJuejinList(listURL, crawlerDto);
        }
        const pageResult = await axios.get(listURL);
        const $ = cheerio.load(pageResult.data);
        const articleItems = $(crawlerDto.itemSelector);
        const articleURLArr: string[] = [];
        if (articleItems && articleItems.length) {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < articleItems.length; i++) {
                const articleLink = $(articleItems[i]).find(crawlerDto.itemTitleSelector);
                let href: string = articleLink.attr('href') || '';
                href = href.trim();
                if (href) {
                    href = url.resolve(listURL, href);
                    articleURLArr.push(href);
                }
            }
        }
        await bluebird.map(articleURLArr, (articleURL) => {
            return this.crawlPage(articleURL, crawlerDto);
        }, { concurrency: 10 });
    }

    async crawlZhihuList(listURL: string, crawlerDto: CrawlerDto) {
        const jsonResult = await axios.get(listURL);
        if (jsonResult.data && jsonResult.data.data) {
            await bluebird.map(jsonResult.data.data, (articleItem) => {
                return this.crawlPage(articleItem.url, crawlerDto);
            }, { concurrency: 20 });
        }
    }

    async crawlJuejinList(listURL: string, crawlerDto: CrawlerDto) {
        let postData;
        try {
            postData = JSON.parse(crawlerDto.postData);
        } catch (err) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        const jsonResult = await axios.post(listURL, postData, {
            headers: {
                'X-Agent': 'Juejin/Web',
            },
        });
        if (jsonResult.data && jsonResult.data.data) {
            await bluebird.map(jsonResult.data.data.articleFeed.items.edges, (articleItem) => {
                return this.crawlPage(articleItem.node.originalUrl, crawlerDto);
            }, { concurrency: 20 });
        }
    }

    async list(page: number, pageSize: number): Promise<ListResult<CrawlerArticle>> {
        const [ list, count ] = await Promise.all([
            this.crawlerArticleRepository.find({
                select: ['id', 'from', 'title', 'articleID', 'url', 'createdAt', 'updatedAt'],
                order: {
                    updatedAt: 'DESC',
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.crawlerArticleRepository.count(),
        ]);
        return {
            list,
            count,
            page,
            pageSize,
        };
    }

    async detail(id: number) {
        return await this.crawlerArticleRepository.findOne({
            where: { id },
        });
    }

    async setArticleID(id: number, articleID: number) {
        return await this.crawlerArticleRepository.update({
            id,
        }, {
            articleID,
            updatedAt: new Date(),
        });
    }
}