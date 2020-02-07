import * as util from 'util';
import {
    Controller, Post, Body, Get, UseGuards, Query, Param, Put,
} from '@nestjs/common';
import { AdminAPIPrefix } from '../constants/constants';
import { CrawlerService } from './crawler.service';
import { CrawlerDto } from './dto/crawler.dto';
import { CrawlerPageType, CrawlerArticleFromLabelMap } from '../entity/crawler.entity';
import { ActiveGuard } from '../core/guards/active.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { UserRole } from '../entity/user.entity';
import { Roles } from '../core/decorators/roles.decorator';
import { ParsePagePipe } from '../core/pipes/parse-page.pipe';
import { ArticleService } from './article.service';
import { RedisService } from '../redis/redis.service';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { CrawlerArticleDto } from './dto/crawler-article.dto';

@Controller()
export class CrawlerAdminController {
    constructor(
        private readonly crawlerService: CrawlerService,
        private readonly articleService: ArticleService,
        private readonly redisService: RedisService,
    ) {}

    @Get(`${AdminAPIPrefix}/crawler`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async list(@Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        const result = await this.crawlerService.list(page, pageSize);
        return {
            ...result,
            list: result.list.map(article => {
                return {
                    ...article,
                    fromLabel: CrawlerArticleFromLabelMap[article.from],
                };
            }),
        };
    }

    @Get(`${AdminAPIPrefix}/crawler/:id`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async detail(@Param('id', MustIntPipe) id: number) {
        return await this.crawlerService.detail(id);
    }

    @Post(`${AdminAPIPrefix}/crawler`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async crawler(@Body() crawlerDto: CrawlerDto) {
        if (crawlerDto.pageType === CrawlerPageType.List) {
            await this.crawlerService.crawlList(crawlerDto.url, crawlerDto);
            return {};
        }
        const html = await this.crawlerService.crawlPage(crawlerDto.url, crawlerDto);
        return { html };
    }

    /**
     * 使用抓取的内容创建文章
     */
    @Post(`${AdminAPIPrefix}/crawler/articles`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async createArticle(@Body() createArticleDto: CrawlerArticleDto) {
        const crawlerUserID = 84;
        const cacheKey = util.format(this.redisService.cacheKeys.user, crawlerUserID);
        const [ createResult ] = await Promise.all([
            this.articleService.create(createArticleDto, crawlerUserID),
            this.redisService.delCache(cacheKey),
        ]);
        await this.crawlerService.setArticleID(createArticleDto.crawlerID, createResult.id);
        return {
            articleID: createResult.id,
        };
    }
}