import {
    Controller, Post, Body, Put, UseGuards, Get, Query, Param, Render, Res,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UserScore } from '../entity/user.entity';
import { ConfigService } from '../config/config.service';
import { ActiveGuard } from '../common/guards/active.guard';
import { CurUser } from '../common/decorators/user.decorator';
import { strToPage } from '../utils/common';
import { MustIntPipe } from '../common/pipes/must-int.pipe';
import { ErrorCode } from '../config/constants';

@Controller()
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly userService: UserService,
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,
    ) {}

    @Get('/api/v1/articles')
    async listView(@Query('page') pageStr, @Query('format') format, @Res() res) {
        const page: number = strToPage(pageStr);
        const articles = await this.articleService.list(page);
        res.render('component/cms/articles', {
            data: {
                articles,
            },
        });
    }

    @Get('/p/:id.html')
    async detail(@CurUser() user, @Param('id', MustIntPipe) id: number, @Res() res) {
        id = id;
        const [userLiked, article, recommends] = await Promise.all([
            user ? this.articleService.isUserLiked(id, user.id) : Promise.resolve(false),
            this.articleService.detail(id),
            this.articleService.recommendList(1),
        ]);
        res.render('pages/article/articleDetail', {
            userLiked,
            article,
            recommends,
        });
    }

    @Post('/api/v1/articles')
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

    @Put('/api/v1/articles')
    @UseGuards(ActiveGuard)
    async update(@CurUser() user, @Body() updateArticleDto: UpdateArticleDto) {
        const [ updateResult ] = await Promise.all([
            this.articleService.update(updateArticleDto, user.id),
        ]);
        return {
            id: updateResult.id,
        };
    }

    @Put('/api/v1/articles/:id/closecomment')
    @UseGuards(ActiveGuard)
    async closeComment(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        await this.articleService.closeOrOpenComment(id, user.id, false);
        return {
        };
    }

    @Put('/api/v1/articles/:id/opencomment')
    @UseGuards(ActiveGuard)
    async openComment(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        await this.articleService.closeOrOpenComment(id, user.id, true);
        return {
        };
    }

    @Post('/api/v1/articles/:id/like')
    @UseGuards(ActiveGuard)
    async like(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        await this.articleService.likeOrCancelLike(id, user.id);
        return {};
    }

    @Post('/api/v1/articles/:id/cancellike')
    @UseGuards(ActiveGuard)
    async cancelLike(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        await this.articleService.likeOrCancelLike(id, user.id);
        return {};
    }
}