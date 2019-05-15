import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookCategory, BookStatus, BookChapter } from '../entity/book.entity';
import { ListResult } from '../entity/interface';

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
            },
        });
    }

    async listInCategory(categoryID: number, page: number, pageSize: number): Promise<ListResult> {
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

    async bookBasic(id: number) {
        return await this.bookRepository.findOne({
            id,
            status: BookStatus.BookVerifySuccess,
        }, {
            select: ['id', 'name'],
        });
    }

    async chapters(bookID: number) {
        return await this.chapterRepository.find({
            select: {
                id: true,
                name: true,
            },
            where: {
                bookID,
            },
        });
    }

    async chapterDetail(id: number) {
        return await this.chapterRepository.findOne({
            select: {
                id: true,
                name: true,
                book: {
                    id: true,
                    name: true,
                    status: true,
                },
            },
            relations: ['book'],
            where: {
                id,
            },
        });
    }
}