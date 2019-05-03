import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entity/category.entity';
import { Book, BookCategory, BookStatus } from '../entity/book.entity';

@Injectable()
export class BookService {

    constructor(
        @InjectRepository(BookCategory)
        private readonly bookCategoryRepository: Repository<BookCategory>,

        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
    ) {}

    async allCategories() {
        return await this.bookCategoryRepository.find({
            select: {
                id: true,
                name: true,
            },
        });
    }

    async list(categoryID: number, page: number, pageSize: number) {
        const result = await this.bookRepository.createQueryBuilder('b')
                .select(['b.id', 'b.name', 'b.coverURL', 'b.chapterCount',
                    'b.wordCount', 'b.userCount', 'b.summary',
                    'u.id', 'u.username', 'u.avatarURL',
                    'c.id', 'c.name'])
                .leftJoin('b.user', 'u')
                .leftJoin('b.categories', 'c')
                .where('b.status = :status', { status: BookStatus.BookVerifySuccess })
                .andWhere('c.id = :id', { id: categoryID })
                .skip((page - 1) * pageSize).take(pageSize)
                .getManyAndCount();
        return result;
    }
}