import {
    Controller, Get, Res, Query, Param,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CurUser } from '../core/decorators/user.decorator';
import { RecommendService } from './recommend.service';
import { CategoryService } from './category.service';
import { OSSService } from '../common/oss.service';
import { BookService } from './book.service';

@Controller()
export class IndexController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly categoryService: CategoryService,
        private readonly recommendService: RecommendService,
        private readonly bookService: BookService,
        private readonly ossService: OSSService,
    ) {}

    @Get('/')
    async index(@CurUser() user, @Query('sort') sort: string, @Res() res) {
        const pageSize = 20;
        const [articleList, categories, books, recommendUsers, uploadPolicy] = await Promise.all([
            // categoryID ? this.articleService.listInCategory(categoryID, 1, pageSize) : 
            this.articleService.list(1, pageSize),
            this.categoryService.all(),
            this.bookService.recommendList(),
            this.recommendService.recommendUsers(),
            this.ossService.requestPolicy(),
        ]);
        res.render('pages/index', {
            categoryID: undefined,
            sort,
            user,
            recommendedBooks: books,
            recommendUsers,
            articles: articleList.list,
            categories,
            uploadPolicy,
        });
    }

    @Get('/timeline/:categoryPath')
    async timeline(@CurUser() user, @Param('categoryPath') categoryPath: string, @Query('sort') sort: string, @Res() res) {
        const pathname = '/timeline/' + categoryPath;
        const pageSize = 20;
        const categories = await this.categoryService.all();
        const category = categories.find(c => c.path === pathname);
        const [articleList, books, recommendUsers, uploadPolicy] = await Promise.all([
            this.articleService.listInCategory(category.id, 1, pageSize),
            this.bookService.recommendList(),
            this.recommendService.recommendUsers(),
            this.ossService.requestPolicy(),
        ]);
        res.render('pages/index', {
            categoryID: category.id,
            pathname,
            recommendedBooks: books,
            sort,
            user,
            recommendUsers,
            articles: articleList.list,
            categories,
            uploadPolicy,
        });
    }
}