import {
    Controller, Get, Res, Query, Param, Next, Post, Body, UseGuards, Put, Delete,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ParsePagePipe } from '../core/pipes/parse-page.pipe';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { BookStatus, BookCategory, Book, BookChapter } from '../entity/book.entity';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import { CurUser } from '../core/decorators/user.decorator';
import { APIPrefix, AdminAPIPrefix } from '../constants/constants';
import { CreateBookStarDto } from './dto/create-book-star.dto';
import { ActiveGuard } from '../core/guards/active.guard';
import { ConfigService } from '../config/config.service';
import { ShouldIntPipe } from '../core/pipes/should-int.pipe';
import { clampNumber } from '../utils/common';
import { RolesGuard } from '../core/guards/roles.guard';
import { Roles } from '../core/decorators/roles.decorator';
import { UserRole } from '../entity/user.entity';
import { CreateBookCategoryDto } from './dto/create-bookcategory.dto';
import { UpdateBookCategoryDto } from './dto/update-category.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { CreateBookChapterDto } from './dto/create-book-chapter.dto';
import { UpdateBookChapterDto } from './dto/update-book-chapter.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller()
export class BookController {
    constructor(
        private readonly bookService: BookService,
        private readonly configService: ConfigService,
    ) {}

    /**
     * 全部图书或分类下的图书(页面)
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

    /**
     * 章节详情
     */
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

    /**
     * 编辑章节时，返回章节的内容
     */
    @Get(`${APIPrefix}/books/chapters/:chapterID/editorcontent`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async chapterEditorContent(@Param('chapterID', MustIntPipe) chapterID: number, @Query('contentType', MustIntPipe) contentType: number) {
        const chapter  = await this.bookService.chapterEditorContent(chapterID, contentType);
        if (!chapter) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        return chapter;
    }

    /**
     * 学习过此图书的用户
     */
    @Get(`${APIPrefix}/books/:bookID/studyusers`)
    async bookStudyUsers(@Param('bookID', MustIntPipe) bookID: number, @Query('page', ParsePagePipe) page: number) {
        const listResult = await this.bookService.bookStudyUsers(bookID, page, 20);
        return listResult;
    }

    /**
     * 图书的评价
     */
    @Get(`${APIPrefix}/books/:bookID/stars`)
    async stars(@Param('bookID', MustIntPipe) bookID: number, @Query('page', ParsePagePipe) page: number,
                @Query('pageSize', ShouldIntPipe) pageSize: number) {
        pageSize = clampNumber(pageSize, 5, 20);
        const listResult = await this.bookService.starList(bookID, page, pageSize);
        return listResult;
    }

    /**
     * 图书列表, 查询全部图书时，categoryPathName 传 all
     */
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

    /**
     * 图书列表, 后台管理的接口，查出所有的开源图书，包括已下架的
     */
    @Get(`${AdminAPIPrefix}/books`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async all(@Query('page', ParsePagePipe) page: number, @Query('pageSize', ShouldIntPipe) pageSize: number) {
        pageSize = clampNumber(pageSize, 5, 200);
        return await this.bookService.all(page, pageSize);
    }

    /**
     * 全部图书分类
     */
    @Get(`${APIPrefix}/books/categories/all`)
    async categories() {
        return await this.bookService.allCategories();
    }

    /**
     * 图书详情接口
     */
    @Get(`${APIPrefix}/books/detail/:id`)
    async bookDetail(@Param('id', MustIntPipe) id: number) {
        return await this.bookService.detail(id);
    }

    /**
     * 图书下的所有章节
     */
    @Get(`${APIPrefix}/books/:id/chapters`)
    async chapters(@Param('id', MustIntPipe) id: number) {
        return await this.bookService.chapters(id);
    }

    /**
     * 创建图书分类
     */
    @Post(`${AdminAPIPrefix}/books/categories`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async createCategory(@Body() createBookCategoryDto: CreateBookCategoryDto) {
        const createResult = await this.bookService.createCategory(createBookCategoryDto);
        return {
            id: createResult.id,
        };
    }

    /**
     * 创建开源图书
     */
    @Post(`${AdminAPIPrefix}/books`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async createBook(@CurUser() user, @Body() createBookDto: CreateBookDto) {
        const createResult = await this.bookService.createBook(createBookDto, user.id);
        return {
            id: createResult.id,
        };
    }

    /**
     * 提交图书评价
     */
    @Post(`${APIPrefix}/books/star`)
    @UseGuards(ActiveGuard)
    async commitStar(@CurUser() user, @Body() createBookStarDto: CreateBookStarDto) {
        await this.bookService.createStar(createBookStarDto, user.id);
        return {};
    }

    /**
     * 创建图书章节
     */
    @Post(`${AdminAPIPrefix}/books/chapters`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async createChapter(@CurUser() user, @Body() createBookChapterDto: CreateBookChapterDto) {
        const book: Book = await this.bookService.basic(createBookChapterDto.bookID);
        if (!book) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '无效的bookID',
            });
        }
        const result = await this.bookService.createBookChapter(createBookChapterDto, book.contentType, user.id);
        return { id: result.id };
    }

    @Put(`${AdminAPIPrefix}/books/categories/:categoryID`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async updateCategory(@Body() updateBookCategoryDto: UpdateBookCategoryDto) {
        await this.bookService.updateCategory(updateBookCategoryDto);
        return {};
    }

    /**
     * 更新开源图书
     */
    @Put(`${AdminAPIPrefix}/books/:id`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async updateBook(@CurUser() user, @Body() updateBookDto: UpdateBookDto, @Param('id', MustIntPipe) id: number) {
        await this.bookService.updateBook(updateBookDto, id);
        return {};
    }

    /**
     * 更新图书章节
     */
    @Put(`${AdminAPIPrefix}/books/chapters/:id`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async updateChapter(@CurUser() user, @Body() updateBookChapterDto: UpdateBookChapterDto, @Param('id', MustIntPipe) id: number) {
        const chapter: BookChapter = await this.bookService.chapterBasic(id);
        if (!chapter) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        await this.bookService.updateBookChapter(updateBookChapterDto, id);
        return {};
    }

    /**
     * 发布
     */
    @Put(`${AdminAPIPrefix}/books/:bookID/publish`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async publish(@Param('bookID', MustIntPipe) bookID: number) {
        await this.bookService.publish(bookID);
        return {};
    }

    /**
     * 下架
     */
    @Put(`${AdminAPIPrefix}/books/:bookID/unpublish`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async unpublish(@Param('bookID', MustIntPipe) bookID: number) {
        await this.bookService.unpublish(bookID);
        return {};
    }

    /**
     * 删除图书章节
     */
    @Delete(`${AdminAPIPrefix}/books/:id/chapters/:chapterID`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async deleteChapter(@Param('id', MustIntPipe) id: number, @Param('chapterID', MustIntPipe) chapterID: number) {
        const [ book, chapter ] = await Promise.all([
            this.bookService.basic(id),
            this.bookService.chapterBasic(chapterID),
        ]);
        if (!book || !chapter || chapter.bookID !== book.id) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        if (book.status === BookStatus.BookPublished) {
            throw new MyHttpException({
                errorCode: ErrorCode.ERROR.CODE,
                message: '已发布的图书不能删除章节',
            });
        }
        await this.bookService.deleteBookChapter(chapterID);
        return {};
    }
}