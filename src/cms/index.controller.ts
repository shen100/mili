import {
    Controller, Get, Res, Query, Param,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CategoryService } from './category.service';
import { BookService } from './book.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '../config/config.service';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';

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
            categoryPathName: 'recommended',
            sort,
            recommendedBooks: books,
            recommendUsers,
            articles: articleResult.list,
            categories,
            userLevelChapterURL: this.configService.static.userLevelChapterURL,
        });
    }

    @Get('/timeline/:categoryPathName')
    async timeline(@Param('categoryPathName') categoryPathName: string, @Query('sort') sort: string, @Res() res) {
        if (this.sortArr.indexOf(sort) < 0) {
            sort = 'popular';
        }
        const pageSize = 20;
        const categories = await this.categoryService.all();
        const category = categories.find(c => c.pathname === categoryPathName);
        if (!category) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        const [articleResult, books, recommendUsers] = await Promise.all([
            this.articleService.listInCategory(category.id, 1, pageSize),
            this.bookService.recommendList(),
            this.userService.userRankings(1, 3),
        ]);
        res.render('pages/index', {
            categoryPathName,
            recommendedBooks: books,
            sort,
            recommendUsers,
            articles: articleResult.list,
            categories,
            userLevelChapterURL: this.configService.static.userLevelChapterURL,
        });
    }
}