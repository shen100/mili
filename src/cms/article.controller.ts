import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';
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

let count = 0;

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
    async detail(@Param('id', ParseIntPipe) id: number, @Res() res) {
        const [article, recommends] = await Promise.all([
            this.articleService.detail(id),
            this.articleService.recommendList(1),
        ]);
        res.render('pages/article/articleDetail', {
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

    @Get('/api/v1/articles/download')
    async downloadImg(@Query() query, @Res() res) {
        let url = query.url;
        url = decodeURIComponent(url);
        const filename = url.substr(url.lastIndexOf('/') + 1);
        await axios({
            method: 'get',
            url,
            responseType: 'stream',
        }).then((response) => {
            const thePath = path.join('/Users/liushen/dev/workspace/nodejs/mili/public/images/emojis', filename);
            // tslint:disable-next-line:no-console
            console.log(count++, thePath);
            response.data.pipe(fs.createWriteStream(thePath));
        });
        return {};
    }
}