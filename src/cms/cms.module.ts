import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { User } from '../entity/user.entity';
import { Article } from '../entity/article.entity';
import { UserModule } from '../user/user.module';
import { UploadService } from './upload.service';
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

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Settings,
            Article,
            Collection,
            Category,
            Draft,
        ]),
        UserModule,
    ],
    controllers: [
        IndexController,
        ArticleController,
        CategoryController,
        UCController,
        CollectionController,
        EditorController,
        SearchController,
        AdminController,
    ],
    providers: [
        ArticleService,
        DraftService,
        CategoryService,
        UploadService,
        CollectionService,
    ],
})
export class CMSModule {}