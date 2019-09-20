import {
    Controller, Post, Body, Put, UseGuards, Get, Query, Param, Res,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ActiveGuard } from '../core/guards/active.guard';
import { CurUser } from '../core/decorators/user.decorator';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { ParsePagePipe } from '../core/pipes/parse-page.pipe';
import { APIPrefix } from '../constants/constants';
import { ArticleService } from './article.service';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import { recentTime } from '../utils/viewfilter';

@Controller()
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly userService: UserService,
        private readonly redisService: RedisService,
    ) {}

    @Get('/p/:id.html')
    async detailView(@CurUser() user, @Param('id', MustIntPipe) id: number, @Res() res) {
        const [userLiked, article, recommends] = await Promise.all([
            user ? this.articleService.isUserLiked(id, user.id) : Promise.resolve(false),
            this.articleService.detail(id),
            this.articleService.recommendList(1, 20),
        ]);
        if (!article) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        let userFollowed = false;
        if (user) {
            userFollowed = await this.userService.isUserFollowed(user.id, article.user.id);
        }
        res.render('pages/article/articleDetail', {
            isAuthorSelf: !!user && user.id === article.user.id,
            userLiked,
            userFollowed,
            article,
            recommends,
        });
    }

    @Get(`${APIPrefix}/articles`)
    async list(@Query('c') c: number, @Query('page', ParsePagePipe) page: number) {
        const categoryID = parseInt((c as any), 10) || 0;
        const pageSize = 20;
        if (categoryID) {
            return this.articleService.listInCategory(categoryID, page, pageSize);
        }
        const listResult = await this.articleService.list(page, pageSize);
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
    async myArticles(@Query('c') c: number, @Query('page', ParsePagePipe) page: number) {
        const categoryID = parseInt((c as any), 10) || 0;
        const pageSize = 20;
        if (categoryID) {
            return this.articleService.listInCategory(categoryID, page, pageSize);
        }
        const listResult = await this.articleService.list(page, pageSize);
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

    @Get(`${APIPrefix}/articles/users/:authorID/like`)
    async userLikeArticles(@Query('c') c: number, @Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        const listResult = await this.articleService.list(page, pageSize);
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
    async create(@CurUser() user, @Body() createArticleDto: CreateArticleDto) {
        user.articleCount++;
        const [ createResult ] = await Promise.all([
            this.articleService.create(createArticleDto, user.id),
            this.userService.updateArticleCount(user.id),
            this.redisService.setUser(user),
            // this.redisService.delCache(this.redisService.cacheKeys.articles),
        ]);
        await this.redisService.setPublishArticle(user.id, createResult);
        return {
            id: createResult.id,
        };
    }

    @Put(`${APIPrefix}/articles`)
    @UseGuards(ActiveGuard)
    async update(@CurUser() user, @Body() updateArticleDto: UpdateArticleDto) {
        await Promise.all([
            this.articleService.update(updateArticleDto, user.id),
        ]);
        return {
            id: updateArticleDto.id,
        };
    }

    @Put(`${APIPrefix}/articles/:id/closecomment`)
    @UseGuards(ActiveGuard)
    async closeComment(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        await this.articleService.closeOrOpenComment(id, user.id, false);
        return {};
    }

    @Put(`${APIPrefix}/articles/:id/opencomment`)
    @UseGuards(ActiveGuard)
    async openComment(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        await this.articleService.closeOrOpenComment(id, user.id, true);
        return {};
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
}