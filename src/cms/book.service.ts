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
        const condition = {
            deletedAt: null,
            status: BookStatus.BookVerifySuccess,
        };
        const [list, count] = await Promise.all([
            this.bookRepository.find({
                select: {
                    id: true,
                    name: true,
                    user: {
                        id: true,
                        username: true,
                        avatarURL: true,
                    },
                } as any,
                relations: ['user'],
                where: condition,
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.bookRepository.count(condition),
        ]);
        return {
            list,
            count,
            page,
            pageSize,
        };
    }
}