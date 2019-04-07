import {
    Controller, Get, Param, Query,
} from '@nestjs/common';
import * as bluebird from 'bluebird';
import { ArticleService } from './article.service';
import { UserService } from '../user/user.service';
import { MustIntPipe } from '../common/pipes/must-int.pipe';
import { strToPage } from '../utils/common';
import { ConfigService } from '../config/config.service';
import { Article } from 'entity/article.entity';

@Controller('search')
export class SearchController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {}

    @Get('/')
    async article(@Query('type') type: string) {
        let view = 'pages/search/article';
        switch (type) {
            case 'article': {
                view = 'pages/search/article';
                break;
            }
            case 'user': {
                view = 'pages/search/user';
                break;
            }
            case 'collection': {
                view = 'pages/search/collection';
                break;
            }
        }
        const articles = await this.articleService.list(1);
        return {
            view,
            data: {
                articles,
            },
        };
    }
}