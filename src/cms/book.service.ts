import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Book, BookCategory, BookStatus, BookChapter, BookStar, BookStarStatus } from '../entity/book.entity';
import { ListResult } from '../entity/listresult.entity';
import { CreateBookStarDto } from './dto/create-book-star.dto';
import { parseCountResult } from '../utils/query';
import { User } from '../entity/user.entity';
import { ChapterComment } from '../entity/comment.entity';

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

        @InjectRepository(ChapterComment)
        private readonly chapterCommentRepository: Repository<ChapterComment>,
    ) {}

    async allCategories() {
        return await this.bookCategoryRepository.find({
            select: {
                id: true,
                name: true,
                pathname: true,
            },
        });
    }

    async basic(bookID: number) {
        return await this.bookRepository.findOne({
            select: {
                id: true,
                name: true,
                coverURL: true,
            },
            where: {
                id: bookID,
                status: BookStatus.BookVerifySuccess,
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
            },
            relations: ['user'],
            where: {
                id: bookID,
                status: BookStatus.BookVerifySuccess,
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
            .where('b.status = :status', { status: BookStatus.BookVerifySuccess });
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

    async recommendList() {
        return await this.bookRepository.find({
            select: {
                id: true,
                name: true,
                coverURL: true,
                chapterCount: true,
                wordCount: true,
                studyUserCount: true,
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

    async chapterDetail(id: number) {
        return await this.chapterRepository.findOne({
            select: {
                id: true,
                name: true,
                htmlContent: true,
                user: {
                    id: true,
                    username: true,
                    avatarURL: true,
                },
                book: {
                    id: true,
                    name: true,
                    coverURL: true,
                    status: true,
                },
            },
            relations: ['book', 'user'],
            where: {
                id,
            },
        });
    }

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

    async studyBookUsers(bookID: number, page: number, pageSize: number): Promise<ListResult<User>> {
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

    async commentList(bookID: number, page: number, pageSize: number): Promise<ListResult<ChapterComment>> {
        const [list, count] = await this.chapterCommentRepository.findAndCount({
            select: {
                id: true,
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
}