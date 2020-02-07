import * as marked from 'marked';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Book, BookCategory, BookStatus, BookChapter, BookStar, BookStarStatus } from '../entity/book.entity';
import { ListResult } from '../entity/listresult.entity';
import { CreateBookStarDto } from './dto/create-book-star.dto';
import { parseCountResult } from '../utils/query';
import { User } from '../entity/user.entity';
import { CreateBookCategoryDto } from './dto/create-bookcategory.dto';
import { UpdateBookCategoryDto } from './dto/update-category.dto';
import { ArticleContentType } from '../entity/article.entity';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import { CreateBookDto } from './dto/create-book.dto';
import { CreateBookChapterDto } from './dto/create-book-chapter.dto';
import { NO_PARENT } from '../constants/constants';
import { UpdateBookChapterDto } from './dto/update-book-chapter.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {

    constructor(
        @InjectRepository(BookCategory)
        private readonly bookCategoryRepository: Repository<BookCategory>,

        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,

        @InjectRepository(BookChapter)
        private readonly chapterRepository: Repository<BookChapter>,

        @InjectRepository(BookStar)
        private readonly bookStarRepository: Repository<BookStar>,
    ) {}

    async allCategories() {
        return await this.bookCategoryRepository.find({
            select: {
                id: true,
                name: true,
                sequence: true,
                pathname: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async basic(bookID: number) {
        return await this.bookRepository.findOne({
            select: {
                id: true,
                name: true,
                contentType: true,
                coverURL: true,
                status: true,
            },
            where: {
                id: bookID,
            },
        });
    }

    async detail(bookID: number) {
        return await this.bookRepository.findOne({
            select: {
                id: true,
                name: true,
                studyUserCount: true,
                commentCount: true,
                coverURL: true,
                summary: true,
                starUserCount: true,
                status: true,
                contentType: true,
                user: {
                    id: true,
                    username: true,
                    avatarURL: true,
                },
            },
            relations: ['user'],
            where: {
                id: bookID,
            },
        });
    }

    async isChapterExist(id: number): Promise<boolean> {
        const chapter = await this.chapterRepository.findOne({
            select: ['id'],
            where: {
                id,
            },
        });
        return chapter !== null;
    }

    async list(page: number, pageSize: number): Promise<ListResult<Book>> {
        return this.listInCategory(undefined, page, pageSize);
    }

    async listInCategory(categoryID: number, page: number, pageSize: number): Promise<ListResult<Book>> {
        let query = await this.bookRepository.createQueryBuilder('b')
            .select(['b.id', 'b.name', 'b.coverURL', 'b.chapterCount',
                'b.wordCount', 'b.studyUserCount', 'b.summary',
                'u.id', 'u.username', 'u.avatarURL',
                'c.id', 'c.name'])
            .leftJoin('b.user', 'u')
            .leftJoin('b.categories', 'c')
            .where('b.status = :status', { status: BookStatus.BookPublished });
        if (categoryID) {
            query = query.andWhere('c.id = :id', { id: categoryID });
        }
        const [list, count] = await query.skip((page - 1) * pageSize).take(pageSize)
            .getManyAndCount();
        return {
            list,
            page,
            pageSize,
            count,
        };
    }

    async all(page: number, pageSize: number): Promise<ListResult<Book>> {
        const query = await this.bookRepository.createQueryBuilder('b')
            .select(['b.id', 'b.name', 'b.coverURL', 'b.chapterCount', 'b.contentType',
                'b.wordCount', 'b.studyUserCount', 'b.summary', 'b.status',
                'b.createdAt', 'b.updatedAt', 'b.starUserCount', 'b.chapterCount',
                'u.id', 'u.username', 'u.avatarURL',
                'c.id', 'c.name'])
            .leftJoin('b.user', 'u')
            .leftJoin('b.categories', 'c')
            .orderBy('b.id', 'DESC');
        const [list, count] = await query.skip((page - 1) * pageSize).take(pageSize)
            .getManyAndCount();
        return {
            list,
            page,
            pageSize,
            count,
        };
    }

    async recommendList() {
        return await this.bookRepository.find({
            select: {
                id: true,
                name: true,
                coverURL: true,
                chapterCount: true,
                wordCount: true,
                studyUserCount: true,
                user: {
                    id: true,
                    username: true,
                    avatarURL: true,
                },
            },
            relations: ['user'],
            where: {
                id: In([9, 19]),
            },
        });
    }

    async chapters(bookID: number) {
        return await this.chapterRepository.find({
            select: {
                id: true,
                name: true,
                parentID: true,
                bookID: true,
                wordCount: true,
                browseCount: true,
                commentCount: true,
            },
            where: {
                bookID,
            },
            order: {
                createdAt: 'ASC',
            },
        });
    }

    async isChapterInBook(chapterID: number, bookID: number) {
        const chapter = await this.chapterRepository.findOne({
            select: {
                id: true,
            },
            where: {
                id: chapterID,
                bookID,
            },
        });
        return !!chapter;
    }

    async chapterBasic(id: number) {
        return await this.chapterRepository.findOne({
            select: {
                id: true,
                name: true,
                contentType: true,
                bookID: true,
            },
            where: {
                id,
            },
        });
    }

    async chapterDetail(id: number) {
        return await this.chapterRepository.findOne({
            select: {
                id: true,
                name: true,
                htmlContent: true,
                commentCount: true,
                rootCommentCount: true,
                user: {
                    id: true,
                    username: true,
                    avatarURL: true,
                },
                book: {
                    id: true,
                    status: true,
                },
            },
            relations: ['user', 'book'],
            where: {
                id,
            },
        });
    }

    /**
     * 编辑章节时，返回章节的内容
     */
    async chapterEditorContent(id: number, contentType: number) {
        const select = {
            id: true,
            name: true,
            content: true,
            htmlContent: true,
        };
        if (contentType === ArticleContentType.HTML) {
            delete select.content;
        } else if (contentType === ArticleContentType.Markdown) {
            delete select.htmlContent;
        } else {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        return await this.chapterRepository.findOne({
            select,
            where: {
                id,
            },
        });
    }

    /**
     * 标记用户学习过此图书
     */
    async studyBook(bookID: number, userID: number) {
        const sql = `INSERT INTO book_user_study (user_id, book_id, created_at, updated_at) VALUES(?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE updated_at = ?`;
        const now = new Date();
        await this.bookRepository.manager.connection.transaction(async manager => {
            const result = await manager.query(sql, [userID, bookID, now, now, now]);
            if (result.affectedRows === 1) {
                await manager.query('UPDATE books SET study_user_count = study_user_count + 1 WHERE id = ?', [bookID]);
            }
        });
    }

    /**
     * 学习过此图书的用户
     */
    async bookStudyUsers(bookID: number, page: number, pageSize: number): Promise<ListResult<User>> {
        const sql = `SELECT users.id as id, users.username as username, users.avatar_url as avatarURL,
                users.job as job, users.company as company
            FROM book_user_study, users WHERE  book_user_study.book_id = ? AND book_user_study.user_id = users.id
            ORDER BY book_user_study.updated_at LIMIT ?, ?`;
        const sql2 = `SELECT COUNT(*) as count FROM book_user_study
            WHERE book_user_study.book_id = ?`;
        const [list, countResult] = await Promise.all([
            this.bookRepository.manager.query(sql, [bookID, (page - 1) * pageSize, pageSize]),
            this.bookRepository.manager.query(sql2, [bookID]),
        ]);
        return {
            list,
            count: parseCountResult(countResult),
            page,
            pageSize,
        };
    }

    /**
     * 创建图书评价
     */
    async createStar(createBookStarDto: CreateBookStarDto, userID: number) {
        await this.bookRepository.manager.connection.transaction(async manager => {
            await manager.getRepository(BookStar).insert({
                createdAt: new Date(),
                htmlContent: createBookStarDto.htmlContent,
                userID,
                bookID: createBookStarDto.bookID,
                star: createBookStarDto.star,
                status: BookStarStatus.BookVerifying,
            });
            await await manager.query('UPDATE books SET star_user_count = star_user_count + 1 WHERE id = ?', [createBookStarDto.bookID]);
        });
        return;
    }

    /**
     * 图书下的评价列表
     */
    async starList(bookID: number, page: number, pageSize: number): Promise<ListResult<BookStar>> {
        const [list, count] = await this.bookStarRepository.findAndCount({
            select: {
                id: true,
                star: true,
                createdAt: true,
                htmlContent: true,
                user: {
                    id: true,
                    username: true,
                    avatarURL: true,
                },
            },
            relations: ['user'],
            where: {
                bookID,
            },
            order: {
                createdAt: 'DESC',
            },
            take: pageSize,
            skip: (page - 1) * pageSize,
        });
        return {
            list,
            page,
            pageSize,
            count,
        };
    }

    /**
     * 是否已提交过评价
     */
    async isCommitedStar(bookID: number, userID: number): Promise<boolean> {
        const result = await this.bookStarRepository.findOne({
            select: ['id'],
            where: {
                bookID,
                userID,
            },
        });
        return !!result;
    }

    async createCategory(createBookCategoryDto: CreateBookCategoryDto) {
        const category = new BookCategory();
        category.name = createBookCategoryDto.name;
        category.sequence = createBookCategoryDto.sequence;
        category.pathname = createBookCategoryDto.pathname;
        category.createdAt = new Date();
        category.updatedAt = category.createdAt;
        return await this.bookCategoryRepository.save(category);
    }

    async updateCategory(updateBookCategoryDto: UpdateBookCategoryDto) {
        return await this.bookCategoryRepository.update({
            id: updateBookCategoryDto.id,
        }, {
            name: updateBookCategoryDto.name,
            sequence: updateBookCategoryDto.sequence,
            pathname: updateBookCategoryDto.pathname,
        });
    }

    async createBook(createBookDto: CreateBookDto, userID: number) {
        const book = new Book();
        book.name = createBookDto.name;
        book.summary = createBookDto.summary,
        book.contentType = createBookDto.contentType;
        book.coverURL = createBookDto.coverURL;
        book.createdAt = new Date();
        book.updatedAt = book.createdAt;
        book.browseCount = book.commentCount = book.starUserCount = book.chapterCount = 0;
        book.star = 0;
        book.userID = userID;
        book.status = BookStatus.BookUnpublish;
        return await this.bookRepository.save(book);
    }

    async updateBook(updateBookDto: UpdateBookDto, id: number) {
        return await this.bookRepository.update({
            id,
        }, {
            name: updateBookDto.name,
            summary: updateBookDto.summary,
            coverURL: updateBookDto.coverURL,
            updatedAt: new Date(),
        });
    }

    async createBookChapter(createBookChapterDto: CreateBookChapterDto, contentType: number, userID: number) {
        const chapter = new BookChapter();
        chapter.name = createBookChapterDto.name;
        chapter.createdAt = new Date();
        chapter.updatedAt = chapter.createdAt;
        chapter.browseCount = chapter.commentCount = chapter.wordCount = chapter.rootCommentCount = 0;
        chapter.userID = userID;
        chapter.bookID = createBookChapterDto.bookID;
        chapter.parentID = createBookChapterDto.parentChapterID || NO_PARENT;
        chapter.contentType = contentType;
        return await this.chapterRepository.save(chapter);
    }

    async deleteBookChapter(id: number) {
        return await this.chapterRepository.delete({ id });
    }

    async updateBookChapter(updateBookChapterDto: UpdateBookChapterDto, id: number) {
        const updateData = {
            name: updateBookChapterDto.name,
            content: updateBookChapterDto.content,
            htmlContent: updateBookChapterDto.htmlContent,
            updatedAt: new Date(),
        };
        if (typeof updateData.name === 'undefined') {
            delete updateData.name;
        }
        if (typeof updateData.htmlContent === 'undefined') {
            delete updateData.htmlContent;
        }
        if (typeof updateData.content === 'undefined') {
            delete updateData.content;
        } else {
            updateData.htmlContent = marked(updateData.content);
        }
        if (!updateData.name && !updateData.content && !updateData.htmlContent) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        return await this.chapterRepository.update({
            id,
        }, updateData);
    }

    async publish(id: number) {
        return await this.bookRepository.update({
            id,
        }, {
            status: BookStatus.BookPublished,
        });
    }

    async unpublish(id: number) {
        return await this.bookRepository.update({
            id,
        }, {
            status: BookStatus.BookUnpublish,
        });
    }
}