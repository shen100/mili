import {
    Controller, Get, Render, Req, Res,
} from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller()
export class IndexController {
    constructor(
        private readonly articleService: ArticleService,
    ) {}

    @Get('/')
    async index(@Req() req, @Res() res) {
        const articles = await this.articleService.list(1);
        res.render('pages/index', {
            user: req.user,
            articles,
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