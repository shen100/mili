import {
    Controller, Get, Query, Res,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleConstants } from '../config/constants';
import { Article } from '../entity/article.entity';
import { SearchService } from './search.service';
import { recentTime } from '../utils/viewfilter';
import { ParsePagePipe } from '../common/pipes/parse-page.pipe';
import { CategoryService } from './category.service';

@Controller('/')
export class SearchController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly categoryService: CategoryService,
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
            case 'channel': {
                view = 'pages/search/category';
                break;
            }
        }
        res.render(view, {
            keyword,
        });
    }

    @Get('/api/v1/search')
    async searchArticle(@Query('keyword') keyword: string, @Query('type') type: string, @Query('page', ParsePagePipe) page: number) {
        if (!keyword || keyword.length > ArticleConstants.MAX_TITLE_LENGTH) {
            keyword = '';
        }
        keyword = decodeURIComponent(keyword);

        const pageSize: number = 20;

        if (!type) {
            // 查询综合
        }

        if (type === 'article') {
            let result;
            if (!keyword) {
                result = await this.articleService.randomArticles(page, pageSize);
            } else {
                result = await this.searchService.searchArticle(keyword, page, pageSize);
            }
            result.list = result.list.map(item => {
                return {
                    ...item,
                    createdAtLabel: recentTime(item.createdAt, 'YYYY.MM.DD HH:mm'),
                };
            });
            return result;
        }

        if (type === 'category') {
            let result;
            if (!keyword) {
                result = await this.categoryService.randomCategories(page, pageSize);
            } else {
                result = await this.categoryService.searchCategories(keyword, page, pageSize);
            }
            return result;
        }
    }
}