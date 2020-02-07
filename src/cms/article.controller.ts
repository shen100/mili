import * as util from 'util';
import {
    Controller, Post, Body, Put, UseGuards, Get, Query, Param, Res, Delete,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';
import { EditArticleDto } from './dto/edit-article.dto';
import { ActiveGuard } from '../core/guards/active.guard';
import { CurUser } from '../core/decorators/user.decorator';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { ParsePagePipe } from '../core/pipes/parse-page.pipe';
import { APIPrefix } from '../constants/constants';
import { ArticleService } from './article.service';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import { recentTime } from '../utils/viewfilter';
import { CategoryService } from './category.service';
import { getShareURL } from '../utils/social';
import { SocialConstants } from '../constants/social';
import { ConfigService } from '../config/config.service';
import { BookService } from '../book/book.service';

@Controller()
export class ArticleController {
    constructor(
        private readonly configService: ConfigService,
        private readonly articleService: ArticleService,
        private readonly categoryService: CategoryService,
        private readonly userService: UserService,
        private readonly redisService: RedisService,
        private readonly bookService: BookService,
    ) {}

    @Get('/p/:id')
    async detailView(@CurUser() user, @Param('id', MustIntPipe) id: number, @Res() res) {
        const [userLiked, article, recommends, books] = await Promise.all([
            user ? this.articleService.isUserLiked(id, user.id) : Promise.resolve(false),
            this.articleService.detail(id),
            this.articleService.relativeRecommendList(1, 20),
            this.bookService.recommendList(),
        ]);
        if (!article) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }

        article.browseCount++;
        article.user.articleViewCount++;

        await Promise.all([
            this.articleService.incArticleViewCount(article.id, article.userID),
            this.redisService.delCache(util.format(this.redisService.cacheKeys.user, article.userID)),
        ]);

        let userFollowed = false;
        if (user) {
            userFollowed = await this.userService.isUserFollowed(user.id, article.user.id);
        }
        const shareData = {
            title: article.name,
            imageURL: article.coverURL,
            url: '',
        };

        res.render('pages/article/articleDetail', {
            isAuthorSelf: !!user && user.id === article.user.id,
            userLevelChapterURL: this.configService.static.userLevelChapterURL,
            userLiked,
            userFollowed,
            article,
            articles: recommends.list,
            recommendedBooks: books,
            weiboShareURL: getShareURL({ ...shareData, platform: SocialConstants.WEIBO }),
            qqShareURL: getShareURL({ ...shareData, platform: SocialConstants.QQ }),
            weixinShareURL: getShareURL({ ...shareData, platform: SocialConstants.WEIXIN }),
        });
    }

    @Get(`${APIPrefix}/articles`)
    async list(@Query('cPath') categoryPathName: string, @Query('s') s: string, @Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        const categories = await this.categoryService.all();
        const category = categories.find(c => c.pathname === categoryPathName);
        if (!category && categoryPathName !== 'recommended') {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        let sort = 'createdAt';
        let order: 'DESC' | 'ASC' = 'DESC';
        if (s === 'popular') {
            sort = 'hot';
        } else if (s === 'newest') {
            sort = 'createdAt';
        } else if (s === 'popular') {
            sort = 'commentCount';
            order = 'ASC';
        }
        if (category) {
            return this.articleService.listInCategory(category.id, sort, order, page, pageSize);
        }
        const listResult = await this.articleService.list(sort, order, page, pageSize);
        const list = listResult.list.map(article => {
            return {
                ...article,
                createdAtLabel: recentTime(article.createdAt, 'YYYY.MM.DD HH:mm'),
            };
        });
        return {
            ...listResult,
            list,
        };
    }

    @Get(`${APIPrefix}/articles/users/:authorID`)
    async userArticles(@Param('authorID', MustIntPipe) authorID: number, @Query('sort') s: string, @Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        let sort = 'hot';
        const order: 'DESC' | 'ASC' = 'DESC';
        if (s === 'popular') {
            sort = 'hot';
        } else if (s === 'newest') {
            sort = 'createdAt';
        }
        const listResult = await this.articleService.userArticles(authorID, sort, order, page, pageSize);
        const list = listResult.list.map(article => {
            return {
                ...article,
                createdAtLabel: recentTime(article.createdAt, 'YYYY.MM.DD HH:mm'),
            };
        });
        return {
            ...listResult,
            list,
        };
    }

    /**
     * 用户点过赞的文章
     */
    @Get(`${APIPrefix}/articles/users/:userID/like`)
    async userLikeArticles(@Param('userID', MustIntPipe) userID: number, @Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        const listResult = await this.articleService.userLikeArticles(userID, page, pageSize);
        const list = listResult.list.map(article => {
            return {
                ...article,
                createdAtLabel: recentTime(article.createdAt, 'YYYY.MM.DD HH:mm'),
            };
        });
        return {
            ...listResult,
            list,
        };
    }

    @Post(`${APIPrefix}/articles`)
    @UseGuards(ActiveGuard)
    async create(@CurUser() user, @Body() createArticleDto: EditArticleDto) {
        user.articleCount++;
        const [ createResult ] = await Promise.all([
            this.articleService.create(createArticleDto, user.id),
            this.redisService.setUser(user),
            // this.redisService.delCache(this.redisService.cacheKeys.articles),
        ]);
        await this.redisService.setPublishArticle(user.id, createResult);
        return {
            id: createResult.id,
        };
    }

    @Put(`${APIPrefix}/articles/:id`)
    @UseGuards(ActiveGuard)
    async update(@CurUser() user, @Body() editArticleDto: EditArticleDto, @Param('id', MustIntPipe) id: number) {
        await Promise.all([
            this.articleService.update(editArticleDto, id, user.id),
        ]);
        return {
            id,
        };
    }

    @Post(`${APIPrefix}/articles/:id/like`)
    @UseGuards(ActiveGuard)
    async like(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        await this.articleService.likeOrCancelLike(id, user.id);
        return {};
    }

    @Post(`${APIPrefix}/articles/:id/cancellike`)
    @UseGuards(ActiveGuard)
    async cancelLike(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        await this.articleService.likeOrCancelLike(id, user.id);
        return {};
    }

    @Delete(`${APIPrefix}/articles/:id`)
    @UseGuards(ActiveGuard)
    async delete(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        await this.articleService.deleteArticle(id, user.id);
        return {};
    }
}