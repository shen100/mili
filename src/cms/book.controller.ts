import {
    Controller, Get, Res, Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { ShouldIntPipe } from '../common/pipes/should-int.pipe';

@Controller()
export class BookController {
    constructor(
        private readonly bookService: BookService,
    ) {}

    @Get('/books')
    async books(@Query('c', ShouldIntPipe) c: number, @Res() res) {
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
        const page = 1;
        const pageSize = 20;
        const [categories, [books, count]] = await Promise.all([
            this.bookService.allCategories(),
            this.bookService.list(2, page, pageSize),
        ]);
        if (c) {
            let found = false;
            for (const category of categories) {
                if (category.id === c) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                c = undefined;
            }
        }

        res.render('pages/books/books', {
            recommendHandBooks,
            books,
            categoryID: c,
            categories,
            page,
            pageSize,
            count,
        });
    }
}