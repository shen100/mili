import {
    Controller, Get, Res, Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CurUser } from '../core/decorators/user.decorator';
import { RecommendService } from './recommend.service';
import { CategoryService } from './category.service';
import { OSSService } from '../common/oss.service';

@Controller()
export class IndexController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly categoryService: CategoryService,
        private readonly recommendService: RecommendService,
        private readonly ossService: OSSService,
    ) {}

    @Get('/')
    async index(@CurUser() user, @Query('c') c: number, @Res() res) {
        const categoryID = parseInt((c as any), 10) || 0;
        const pageSize = 20;
        const [articleList, categories, recommendUsers, uploadPolicy] = await Promise.all([
            categoryID ? this.articleService.listInCategory(categoryID, 1, pageSize) : this.articleService.list(1, pageSize),
            this.categoryService.all(),
            this.recommendService.recommendUsers(),
            this.ossService.requestPolicy(),
        ]);
        res.render('pages/index', {
            user,
            recommendUsers,
            articles: articleList.list,
            categoryID,
            categories,
            uploadPolicy,
        });
    }
}