import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Article } from '../entity/article.entity';
import { UserModule } from '../user/user.module';
import { Settings } from '../entity/settings.entity';
import { BookChapterComment, ArticleComment, BoilingPointComment } from '../entity/comment.entity';
import { HandBookController } from './handBook.controller';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book, BookCategory, BookChapter, BookStar } from '../entity/book.entity';
import { HandBook, HandBookChapter } from '../entity/handbook.entity';
import { HandBookService } from './handbook.service';
import { OSSService } from '../common/oss.service';
import { CommonModule } from '../common/common.module';
import { Image } from '../entity/image.entity';
import { Collection } from '../entity/collection.entity';
import { Category } from '../entity/category.entity';
import { PostMsg } from '../entity/postmsg.entity';
import { Draft } from '../entity/draft.entity';
import { Tag } from '../entity/tag.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            BookChapterComment,
            Book,
            HandBook,
            HandBookChapter,
            BookChapter,
            BookCategory,
            BookStar,
            Image,
        ]),
        UserModule,
        CommonModule,
    ],
    controllers: [
        BookController,
        HandBookController,
    ],
    providers: [
        BookService,
        HandBookService,
        OSSService,
    ],
    exports: [
        BookService,
        HandBookService,
    ],
})
export class BookModule {}