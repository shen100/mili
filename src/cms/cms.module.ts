import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { User } from '../entity/user.entity';
import { Article } from '../entity/article.entity';
import { UserModule } from '../user/user.module';
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
import { BookChapterComment, BoilingPointComment, ArticleComment } from '../entity/comment.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { SearchService } from './search.service';
import { RecommendController } from './recommend.controller';
import { Book, BookCategory, BookChapter, BookStar } from '../entity/book.entity';
import { HandBook, HandBookChapter } from '../entity/handbook.entity';
import { Tag } from '../entity/tag.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { OSSService } from '../common/oss.service';
import { CommonModule } from '../common/common.module';
import { Image } from '../entity/image.entity';
import { BoilingPointModule } from '../boilingpoint/boilingpoint.module';
import { BookModule } from '../book/book.module';
import { CrawlerAdminController } from './crawler.admin.controller';
import { CrawlerService } from './crawler.service';
import { CrawlerArticle } from '../entity/crawler.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Settings,
            Article,
            BoilingPointComment,
            ArticleComment,
            BookChapterComment,
            Collection,
            Category,
            CrawlerArticle,
            Draft,
            PostMsg,
            Book,
            HandBook,
            HandBookChapter,
            BookChapter,
            BookCategory,
            BookStar,
            Tag,
            Image,
        ]),
        UserModule,
        CommonModule,
        BookModule,
        BoilingPointModule,
    ],
    controllers: [
        IndexController,
        ArticleController,
        CategoryController,
        CommentController,
        CrawlerAdminController,
        UCController,
        CollectionController,
        EditorController,
        MessageController,
        SearchController,
        RecommendController,
        TagController,
    ],
    providers: [
        ArticleService,
        CommentService,
        DraftService,
        CategoryService,
        CrawlerService,
        MessageService,
        CollectionService,
        OSSService,
        SearchService,
        TagService,
    ],
    exports: [
        ArticleService,
    ],
})
export class CMSModule {}