import {
    Controller, Get, Query, Res,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleConstants, PeriodConstants } from '../constants/constants';
import { SearchService } from './search.service';
import { recentTime } from '../utils/viewfilter';
import { ParsePagePipe } from '../core/pipes/parse-page.pipe';
import { CategoryService } from './category.service';
import { UserService } from '../user/user.service';
import { Category } from '../entity/category.entity';
import { ShouldIntPipe } from '../core/pipes/should-int.pipe';
import { CurUser } from '../core/decorators/user.decorator';

@Controller('/')
export class SearchController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly categoryService: CategoryService,
        private readonly searchService: SearchService,
        private readonly userService: UserService,
    ) {}

    @Get('/search')
    async searchView(@Query('q') q: string, @Query('period') period: number, @Query('type') type: string, @Res() res) {
        let searchKeyword = q;
        if (!searchKeyword || searchKeyword.length > ArticleConstants.MAX_TITLE_LENGTH) {
            searchKeyword = '';
        }
        const keywordEncoded = encodeURIComponent(searchKeyword);
        period = parseInt(period as any, 10);
        if (['all', 'article', 'category', 'user'].indexOf(type) < 0) {
            type = 'all';
        }

        if ([PeriodConstants.ALL, PeriodConstants.DAY, PeriodConstants.WEEK, PeriodConstants.THREE_MONTHS].indexOf(period) < 0) {
            period = PeriodConstants.ALL;
        }

        const recommendHandBooks = [
            {
                name: 'Kubernetes 从上手到实践Kubernetes 从上手到实践Kubernetes 从上手到实践',
                saleCount: 1123,
                coverURL: '/images/index/book1.jpg',
            },
            {
                name: 'Kubernetes 从上手到实践',
                saleCount: 1123,
                coverURL: '/images/index/book1.jpg',
            },
        ];
        res.render('pages/search/search', {
            keywordEncoded,
            searchKeyword,
            searchType: type,
            recommendHandBooks,
            period,
        });
    }

    @Get('/api/v1/search')
    async searchArticle(@CurUser() user, @Query('q') q: string, @Query('type') type: string,
                        @Query('period', ShouldIntPipe) period: number, @Query('page', ParsePagePipe) page: number) {
        let keyword = q;
        if (!keyword || keyword.length > ArticleConstants.MAX_TITLE_LENGTH) {
            keyword = '';
        }
        keyword = decodeURIComponent(keyword);

        period = parseInt(period as any, 10);
        if ([PeriodConstants.ALL, PeriodConstants.DAY, PeriodConstants.WEEK, PeriodConstants.THREE_MONTHS].indexOf(period) < 0) {
            period = PeriodConstants.ALL;
        }

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
            return {
                period,
                ...result,
            };
        }

        if (type === 'category') {
            let result;
            if (!keyword) {
                result = await this.categoryService.randomCategories(page, pageSize);
            } else {
                result = await this.categoryService.searchCategories(keyword, page, pageSize);
            }
            if (user) {
                const categories = result.list.map(c => c.id);
                const followedCategories = await this.categoryService.findCategoriesFilterByFollowerID(user.id, categories);
                const categoryMap = {};
                followedCategories.forEach(followedCategory => {
                    categoryMap[followedCategory.categoryID] = true;
                });
                result.list.forEach((categoryData: any) => {
                    categoryData.isFollowed = !!categoryMap[categoryData.id];
                });
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
            if (user) {
                const users = result.list.map(u => u.id);
                const followedUsers = await this.userService.usersFilterByFollowerID(users, user.id);
                const userMap = {};
                followedUsers.forEach(followedUser => {
                    userMap[followedUser.userID] = true;
                });
                result.list.forEach((userData: any) => {
                    userData.isFollowed = !!userMap[userData.id];
                });
            }
            return result;
        }

        // 查询综合
        let category: Category;
        let articleResult;
        if (keyword) {
            category = await this.categoryService.searchCategoryByName(keyword);
            if (category) {
                const categories = [category.id];
                const followedCategories = await this.categoryService.findCategoriesFilterByFollowerID(user.id, categories);
                if (followedCategories.length) {
                    (category as any).isFollowed = true;
                } else {
                    (category as any).isFollowed = false;
                }
            }
        }
        // period
        // 0: 全部
        // 1: 一天内
        // 2: 一周内
        // 3: 三月内
        articleResult = await this.searchService.searchArticle(keyword, page, pageSize);
        return {
            period,
            category,
            ...articleResult,
        };
    }
}