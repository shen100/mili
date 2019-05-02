import {
    Controller, Get, Render, Req, Res, Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CurUser } from '../common/decorators/user.decorator';

@Controller()
export class IndexController {
    constructor(
        private readonly articleService: ArticleService,
    ) {}

    @Get('/')
    async index(@CurUser() user, @Query('c') c: number, @Res() res) {
        const result = await this.articleService.list(1, 20);
        res.render('pages/index', {
            user,
            articles: result.list,
            categoryID: parseInt((c as any), 10) || 0,
            categories: [
                {
                    id: 1,
                    name: 'Android',
                },
                {
                    id: 2,
                    name: '前端',
                },
                {
                    id: 3,
                    name: 'iOS',
                },
                {
                    id: 4,
                    name: '后端',
                },
                {
                    id: 5,
                    name: '设计',
                },
                {
                    id: 6,
                    name: '产品',
                },
            ],
        });
    }
}