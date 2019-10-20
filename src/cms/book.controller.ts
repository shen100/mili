import {
    Controller, Get, Res, Query, Param, Next, Post, Body, UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ParsePagePipe } from '../core/pipes/parse-page.pipe';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { BookStatus, BookCategory } from '../entity/book.entity';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import { CurUser } from '../core/decorators/user.decorator';
import { APIPrefix } from '../constants/constants';
import { CreateBookStarDto } from './dto/create-book-star.dto';
import { ActiveGuard } from '../core/guards/active.guard';
import { ConfigService } from '../config/config.service';
import { ShouldIntPipe } from '../core/pipes/should-int.pipe';

@Controller()
export class BookController {
    constructor(
        private readonly bookService: BookService,
        private readonly configService: ConfigService,
    ) {}

    @Get('/books/:categoryPathName?')
    async booksView(@Param('categoryPathName') categoryPathName: string, @Query('page', ParsePagePipe) page: number, @Res() res, @Next() next) {
        if (categoryPathName && !isNaN(Number(categoryPathName))) {
            // 转到图书详情页面
            next();
            return;
        }
        const pageSize = 20;
        const categories: BookCategory[] = await this.bookService.allCategories();
        let category: BookCategory;
        if (categoryPathName) {
            category = categories.find(c => c.pathname === categoryPathName);
            if (!category) {
                throw new MyHttpException({
                    errorCode: ErrorCode.NotFound.CODE,
                });
            }
        }
        let bookListQuery = this.bookService.list(page, pageSize);
        if (category) {
            bookListQuery = this.bookService.listInCategory(category.id, page, pageSize);
        }
        const [listResult, recommendBooks] = await Promise.all([
            bookListQuery,
            this.bookService.recommendList(),
        ]);

        res.render('pages/books/books', {
            recommendBooks,
            categoryPathName: categoryPathName || 'all',
            categories,
            ...listResult,
        });
    }

    /**
     * 图书详情页面
     */
    @Get('/books/:id')
    async bookView(@Param('id', MustIntPipe) id: number, @Res() res) {
        const [book, chapters, studyUsers, recommendBooks] = await Promise.all([
            this.bookService.detail(id),
            this.bookService.chapters(id),
            this.bookService.studyBookUsers(id, 1, 20),
            this.bookService.recommendList(),
        ]);

        if (!book) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        res.render('pages/books/bookDetail', {
            book,
            chapters,
            studyUsers: studyUsers.list,
            list: recommendBooks,
            userLevelChapterURL: this.configService.static.userLevelChapterURL,
        });
    }

    @Get('/books/:bookID/chapters/:chapterID')
    async chapterView(@CurUser() user, @Param('bookID', MustIntPipe) bookID: number, @Param('chapterID', MustIntPipe) chapterID: number, @Res() res) {
        const [book, chapters, isChapterInBook, isCommitedStar] = await Promise.all([
            this.bookService.basic(bookID),
            this.bookService.chapters(bookID),
            this.bookService.isChapterInBook(chapterID, bookID),
            user ? this.bookService.isCommitedStar(bookID, user.id) : Promise.resolve(false),
            user ? this.bookService.studyBook(bookID, user.id) : Promise.resolve(),
        ]);
        if (!book || !isChapterInBook) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        res.render('pages/books/chapter', {
            isHandbook: true,
            book,
            chapterID,
            chapters,
            isCommitedStar,
        });
    }

    @Get(`${APIPrefix}/books/chapters/:chapterID`)
    async chapter(@Param('chapterID', MustIntPipe) chapterID: number) {
        const chapter  = await this.bookService.chapterDetail(chapterID);
        if (!chapter || chapter.book.status !== BookStatus.BookVerifySuccess) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        return chapter;
    }

    @Get(`${APIPrefix}/books/:bookID/studyusers`)
    async studyBookUsers(@Param('bookID', MustIntPipe) bookID: number, @Query('page', ParsePagePipe) page: number) {
        const listResult = await this.bookService.studyBookUsers(bookID, page, 20);
        return listResult;
    }

    @Get(`${APIPrefix}/books/:bookID/stars`)
    async stars(@Param('bookID', MustIntPipe) bookID: number, @Query('page', ParsePagePipe) page: number,
                @Query('pageSize', ShouldIntPipe) pageSize: number) {
        if (!pageSize) {
            pageSize = 20;
        }
        pageSize = Math.min(pageSize, 20);
        pageSize = Math.max(pageSize, 1);
        const listResult = await this.bookService.starList(bookID, page, pageSize);
        return listResult;
    }

    @Get(`${APIPrefix}/books/:bookID/comments`)
    async comments(@Param('bookID', MustIntPipe) bookID: number, @Query('page', ParsePagePipe) page: number,
                   @Query('pageSize', ShouldIntPipe) pageSize: number) {
        if (!pageSize) {
            pageSize = 20;
        }
        pageSize = Math.min(pageSize, 20);
        pageSize = Math.max(pageSize, 1);
        const listResult = await this.bookService.commentList(bookID, page, pageSize);
        return listResult;
    }

    @Get(`${APIPrefix}/books/:categoryPathName`)
    async list(@Param('categoryPathName') categoryPathName: string, @Query('page', ParsePagePipe) page: number) {
        const categories = await this.bookService.allCategories();
        const category = categories.find(c => c.pathname === categoryPathName);
        if (!category && categoryPathName !== 'all') {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }

        const pageSize = 20;

        let bookListQuery = this.bookService.list(page, pageSize);
        if (category) {
            bookListQuery = this.bookService.listInCategory(category.id, page, pageSize);
        }
        const [listResult] = await Promise.all([
            bookListQuery,
        ]);
        return listResult;
    }

    @Post(`${APIPrefix}/books/star`)
    @UseGuards(ActiveGuard)
    async commitStar(@CurUser() user, @Body() createBookStarDto: CreateBookStarDto) {
        await this.bookService.createStar(createBookStarDto, user.id);
        return {};
    }
}