import {
    Controller, Get, Query, Res,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleConstants } from '../config/constants';
import { Article } from '../entity/article.entity';
import { SearchService } from './search.service';
import { recentTime } from '../utils/viewfilter';

@Controller('/')
export class SearchController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly searchService: SearchService,
    ) {}

    @Get('/')
    async article(@Query('type') type: string) {
        let view = 'pages/search/article';
        switch (type) {
            case 'article': {
                view = 'pages/search/article';
                break;
            }
            case 'user': {
                view = 'pages/search/user';
                break;
            }
            case 'collection': {
                view = 'pages/search/collection';
                break;
            }
        }
        const articles = await this.articleService.list(1);
        return {
            view,
            data: {
                articles,
            },
        };
    }

    @Get('/search')
    async searchView(@Query('keyword') keyword: string, @Query('type') type: string, @Res() res) {
        if (!keyword || keyword.length > ArticleConstants.MAX_TITLE_LENGTH) {
            keyword = '';
        }
        keyword = decodeURIComponent(keyword);
        let view = 'pages/search/all';
        switch (type) {
            case 'all': {
                view = 'pages/search/all';
                break;
            }
            case 'article': {
                view = 'pages/search/article';
                break;
            }
        }
        res.render(view, {
            keyword,
        });
    }

    @Get('/api/v1/search')
    async searchArticle(@Query('keyword') keyword: string, @Query('type') type: string) {
        if (!keyword || keyword.length > ArticleConstants.MAX_TITLE_LENGTH) {
            keyword = '';
        }
        keyword = decodeURIComponent(keyword);

        if (!type) {
            // 查询综合
        }

        if (type === 'article') {
            let articles: Array<Article>;
            if (!keyword) {
                articles = await this.articleService.randomArticles(1, 20);
            } else {
                articles = await this.searchService.searchArticle(keyword, 1, 20);
            }
            articles = articles || [];
            articles = articles.map(article => {
                return {
                    ...article,
                    createdAtLabel: recentTime(article.createdAt, 'YYYY.MM.DD HH:mm'),
                };
            });
            return {
                articles,
            };
        }
    }
}