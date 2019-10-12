import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Book, BookCategory, BookStatus, BookChapter } from '../entity/book.entity';
import { ListResult } from '../entity/listresult.entity';

@Injectable()
export class BookService {

    constructor(
        @InjectRepository(BookCategory)
        private readonly bookCategoryRepository: Repository<BookCategory>,

        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,

        @InjectRepository(BookChapter)
        private readonly chapterRepository: Repository<BookChapter>,
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

    async detail(bookID: number) {
        return await this.bookRepository.findOne({
            select: {
                id: true,
                name: true,
                userCount: true,
                coverURL: true,
            },
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
                'b.wordCount', 'b.userCount', 'b.summary',
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
                browseCount: true,
            },
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
            },
            where: {
                bookID,
            },
            order: {
                createdAt: 'ASC',
            },
        });
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
                    status: true,
                },
            },
            relations: ['book', 'user'],
            where: {
                id,
            },
        });
    }
}