import {
    Controller, Post, Body, Req, Put, UseGuards, Get, Query, Param, Render, Res,
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
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
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
    @Render('pages/article/articleDetail')
    async detail(@Param('id', ParseIntPipe) id: number) {
        const article = await this.articleService.detail(id);
        return {
            article,
        };
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
        return {
            errorCode: ErrorCode.SUCCESS.CODE,
            data: { id: createResult.id },
        };
    }

    @Put('/api/v1/articles')
    @UseGuards(ActiveGuard)
    async update(@CurUser() user, @Body() updateArticleDto: UpdateArticleDto) {
        const [ updateResult ] = await Promise.all([
            this.articleService.update(updateArticleDto, user.id),
        ]);
        return {
            errorCode: ErrorCode.SUCCESS.CODE,
            data: { id: updateResult.id },
        };
    }
}