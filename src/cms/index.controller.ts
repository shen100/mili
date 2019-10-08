import {
    Controller, Get, Res, Query, Param,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CategoryService } from './category.service';
import { BookService } from './book.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '../config/config.service';

@Controller()
export class IndexController {
    private readonly sortArr = ['popular', 'newest', 'noreply'];

    constructor(
        private readonly configService: ConfigService,
        private readonly articleService: ArticleService,
        private readonly categoryService: CategoryService,
        private readonly userService: UserService,
        private readonly bookService: BookService,
    ) {}

    @Get('/')
    async index(@Query('sort') sort: string, @Res() res) {
        if (this.sortArr.indexOf(sort) < 0) {
            sort = 'popular';
        }
        const pageSize = 20;
        const [articleResult, categories, books, recommendUsers] = await Promise.all([
            this.articleService.recommendList(1, pageSize, sort),
            this.categoryService.all(),
            this.bookService.recommendList(),
            this.userService.userRankings(1, 3),
        ]);
        res.render('pages/index', {
            categoryID: undefined,
            sort,
            recommendedBooks: books,
            recommendUsers,
            articles: articleResult.list,
            categories,
            userLevelChapterURL: this.configService.static.userLevelChapterURL,
        });
    }

    @Get('/timeline/:categoryPath')
    async timeline(@Param('categoryPath') categoryPath: string, @Query('sort') sort: string, @Res() res) {
        if (this.sortArr.indexOf(sort) < 0) {
            sort = 'popular';
        }
        const pathname = '/timeline/' + categoryPath;
        const pageSize = 20;
        const categories = await this.categoryService.all();
        const category = categories.find(c => c.path === pathname);
        const [articleResult, books, recommendUsers] = await Promise.all([
            this.articleService.listInCategory(category.id, 1, pageSize),
            this.bookService.recommendList(),
            this.userService.userRankings(1, 3),
        ]);
        res.render('pages/index', {
            categoryID: category.id,
            pathname,
            recommendedBooks: books,
            sort,
            recommendUsers,
            articles: articleResult.list,
            categories,
            userLevelChapterURL: this.configService.static.userLevelChapterURL,
        });
    }
}