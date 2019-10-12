import {
    Controller, Get, Res, Query, Param, Next,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ShouldIntPipe } from '../core/pipes/should-int.pipe';
import { ParsePagePipe } from '../core/pipes/parse-page.pipe';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { BookStatus, BookCategory } from '../entity/book.entity';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';

@Controller()
export class BookController {
    constructor(
        private readonly bookService: BookService,
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

    @Get('/books/:id')
    async bookView(@Param('id', MustIntPipe) id: number, @Res() res) {
        const [book, chapters] = await Promise.all([
            this.bookService.detail(id),
            this.bookService.chapters(id),
        ]);

        if (!book) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        res.render('pages/books/bookDetail', {
            book,
            chapters,
        });
    }

    @Get('/books/:bookID/chapters/:chapterID')
    async chapterView(@Param('bookID', MustIntPipe) bookID: number, @Param('chapterID', MustIntPipe) chapterID: number, @Res() res) {
        const [chapters, chapter] = await Promise.all([
            this.bookService.chapters(bookID),
            this.bookService.chapterDetail(chapterID),
        ]);
        if (!chapter || chapter.book.status !== BookStatus.BookVerifySuccess) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        res.render('pages/books/chapter', {
            chapter,
            chapters,
        });
    }

    @Get('/api/v1/books/:categoryPathName')
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
}