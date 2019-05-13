import {
    Controller, Get, Res, Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ShouldIntPipe } from '../common/pipes/should-int.pipe';
import { ParsePagePipe } from '../common/pipes/parse-page.pipe';

@Controller()
export class BookController {
    constructor(
        private readonly bookService: BookService,
    ) {}

    @Get('/books')
    async booksView(@Query('c', ShouldIntPipe) c: number, @Query('page', ParsePagePipe) page: number, @Res() res) {
        const recommendHandBooks = [
            {
                name: 'Kubernetes 从上手到实践Kubernetes 从上手到实践Kubernetes 从上手到实践',
                saleCount: 1123,
                coverURL: '/images/index/book1.jpg',
            },
            {
                name: 'Kubernetes 从上手到实践',
                saleCount: 1123,
                coverURL: '/images/index/book1.jpg',
            },
        ];

        const categoryID = parseInt((c as any), 10) || 0;
        const pageSize = 2;

        const [categories, listResult] = await Promise.all([
            this.bookService.allCategories(),
            this.bookService.listInCategory(categoryID, page, pageSize),
        ]);

        res.render('pages/books/books', {
            recommendHandBooks,
            categoryID,
            categories,
            ...listResult,
        });
    }

    @Get('/api/v1/books')
    async list(@Query('c', ShouldIntPipe) c: number, @Query('page', ParsePagePipe) page: number) {
        const categoryID = parseInt((c as any), 10) || 0;
        const pageSize = 2;
        const listResult = await this.bookService.listInCategory(categoryID, page, pageSize);
        return listResult;
    }
}