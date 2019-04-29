import {
    Controller, Get, Query, Res,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleConstants } from '../config/constants';
import { SearchService } from './search.service';
import { recentTime } from '../utils/viewfilter';
import { ParsePagePipe } from '../common/pipes/parse-page.pipe';
import { CategoryService } from './category.service';
import { UserService } from '../user/user.service';
import { Category } from 'entity/category.entity';
import { ShouldIntPipe } from '../common/pipes/should-int.pipe';

@Controller('/')
export class SearchController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly categoryService: CategoryService,
        private readonly searchService: SearchService,
        private readonly userService: UserService,
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
    async searchView(@Query('q') q: string, @Query('type') type: string, @Res() res) {
        let searchKeyword = q;
        if (!searchKeyword || searchKeyword.length > ArticleConstants.MAX_TITLE_LENGTH) {
            searchKeyword = '';
        }
        const keywordEncoded = encodeURIComponent(searchKeyword);
        if (['all', 'article', 'channel', 'user'].indexOf(type) < 0) {
            type = 'all';
        }
        res.render('pages/search/search', {
            keywordEncoded,
            searchKeyword,
            searchType: type,
        });
    }

    @Get('/api/v1/search')
    async searchArticle(@Query('keyword') keyword: string, @Query('type') type: string,
                        @Query('period', ShouldIntPipe) period: number, @Query('page', ParsePagePipe) page: number) {
        if (!keyword || keyword.length > ArticleConstants.MAX_TITLE_LENGTH) {
            keyword = '';
        }
        keyword = decodeURIComponent(keyword);

        const pageSize: number = 20;

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

        if (type === 'user') {
            let result;
            if (!keyword) {
                result = await this.userService.randomUsers(page, pageSize);
            } else {
                result = await this.userService.searchUsers(keyword, page, pageSize);
            }
            return result;
        }

        // 查询综合
        let category: Category;
        let articleResult;
        if (keyword) {
            category = await this.categoryService.searchCategoryByName(keyword);
        }
        // period
        // 0: 全部
        // 1: 一天内
        // 2: 一周内
        // 3: 三月内
        articleResult = await this.searchService.searchArticle(keyword, page, pageSize);
        return {
            category,
            ...articleResult,
        };
    }
}