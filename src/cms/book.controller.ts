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
import { clampPage } from '../utils/common';

@Controller()
export class BookController {
    constructor(
        private readonly bookService: BookService,
        private readonly configService: ConfigService,
    ) {}

    /**
     * 全部图书或分类下的图书
     */
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
            ...listResult,
            recommendBooks,
            categoryPathName: categoryPathName || 'all',
            categories,
        });
    }

    /**
     * 图书详情页面
     */
    @Get('/books/:id')
    async bookView(@Param('id', MustIntPipe) id: number, @Res() res) {
        const page = 1;
        const pageSize = 20;
        const [book, chapters, studyUsers, recommendBooks] = await Promise.all([
            this.bookService.detail(id),
            this.bookService.chapters(id),
            this.bookService.bookStudyUsers(id, page, pageSize),
            this.bookService.recommendList(),
        ]);

        if (!book || book.status !== BookStatus.BookPublished) {
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

    /**
     * 章节详情页面
     */
    @Get('/books/:bookID/chapters/:chapterID')
    async chapterView(@CurUser() user, @Param('bookID', MustIntPipe) bookID: number, @Param('chapterID', MustIntPipe) chapterID: number, @Res() res) {
        const [book, chapters, isChapterInBook, isCommitedStar] = await Promise.all([
            this.bookService.basic(bookID),
            this.bookService.chapters(bookID),
            this.bookService.isChapterInBook(chapterID, bookID),
            user ? this.bookService.isCommitedStar(bookID, user.id) : Promise.resolve(false),
            user ? this.bookService.studyBook(bookID, user.id) : Promise.resolve(),
        ]);
        if (!book || book.status !== BookStatus.BookPublished || !isChapterInBook) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        res.render('pages/books/chapter', {
            isHandbook: false,
            book,
            chapterID,
            chapters,
            isCommitedStar,
        });
    }

    @Get(`${APIPrefix}/books/chapters/:chapterID`)
    async chapter(@Param('chapterID', MustIntPipe) chapterID: number) {
        const chapter  = await this.bookService.chapterDetail(chapterID);
        if (!chapter || chapter.book.status !== BookStatus.BookPublished) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        return chapter;
    }

    @Get(`${APIPrefix}/books/:bookID/studyusers`)
    async bookStudyUsers(@Param('bookID', MustIntPipe) bookID: number, @Query('page', ParsePagePipe) page: number) {
        const listResult = await this.bookService.bookStudyUsers(bookID, page, 20);
        return listResult;
    }

    @Get(`${APIPrefix}/books/:bookID/stars`)
    async stars(@Param('bookID', MustIntPipe) bookID: number, @Query('page', ParsePagePipe) page: number,
                @Query('pageSize', ShouldIntPipe) pageSize: number) {
        pageSize = pageSize || 20;
        pageSize = clampPage(pageSize, 1, 20);
        const listResult = await this.bookService.starList(bookID, page, pageSize);
        return listResult;
    }

    @Get(`${APIPrefix}/books/:bookID/comments`)
    async comments(@Param('bookID', MustIntPipe) bookID: number, @Query('page', ParsePagePipe) page: number,
                   @Query('pageSize', ShouldIntPipe) pageSize: number) {
        pageSize = pageSize || 20;
        pageSize = clampPage(pageSize, 1, 20);
        const listResult = await this.bookService.commentList(bookID, page, pageSize);
        return listResult;
    }

    @Get(`${APIPrefix}/books/:categoryPathName`)
    async list(@Param('categoryPathName') categoryPathName: string, @Query('page', ParsePagePipe) page: number) {
        // 查询全部图书时，categoryPathName 传 all
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