import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { User } from '../entity/user.entity';
import { Article } from '../entity/article.entity';
import { UserModule } from '../user/user.module';
import { AdminController } from './admin.controller';
import { IndexController } from './index.controller';
import { UCController } from './uc.controller';
import { SearchController } from './search.controller';
import { CollectionController } from './collection.controller';
import { Collection } from '../entity/collection.entity';
import { CollectionService } from './collection.service';
import { EditorController } from './editor.controller';
import { Category } from '../entity/category.entity';
import { Draft } from '../entity/draft.entity';
import { DraftService } from './draft.service';
import { Settings } from '../entity/settings.entity';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { PostMsg } from '../entity/postmsg.entity';
import { Comment, ChapterComment } from '../entity/comment.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { HandBookController } from './handBook.controller';
import { SearchService } from './search.service';
import { RecommendController } from './recommend.controller';
import { RecommendService } from './recommend.service';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book, BookCategory, BookChapter } from '../entity/book.entity';
import { HandBook, HandBookChapter } from '../entity/handbook.entity';
import { HandBookService } from './handbook.service';
import { Tag } from '../entity/tag.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { OSSService } from '../common/oss.service';
import { CodeReviewController } from './codereview.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Settings,
            Article,
            Comment,
            ChapterComment,
            Collection,
            Category,
            Draft,
            PostMsg,
            Book,
            HandBook,
            HandBookChapter,
            BookChapter,
            BookCategory,
            Tag,
        ]),
        UserModule,
    ],
    controllers: [
        BookController,
        IndexController,
        ArticleController,
        CategoryController,
        CodeReviewController,
        CommentController,
        HandBookController,
        UCController,
        CollectionController,
        EditorController,
        MessageController,
        SearchController,
        RecommendController,
        AdminController,
        TagController,
    ],
    providers: [
        ArticleService,
        BookService,
        CommentService,
        DraftService,
        CategoryService,
        HandBookService,
        MessageService,
        CollectionService,
        RecommendService,
        OSSService,
        SearchService,
        TagService,
    ],
})
export class CMSModule {}