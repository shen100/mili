import {
    Controller, Get, Render, Req,
} from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller()
export class IndexController {
    constructor(
        private readonly articleService: ArticleService,
    ) {}

    @Get('/')
    @Render('pages/index')
    async index(@Req() req) {
        const articles = await this.articleService.list(1);
        return {
            user: req.user,
            articles,
        };
    }
}