import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { UserModule } from '../user/user.module';
import { CMSModule } from '../cms/cms.module';
import { IndexController } from './index.controller';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        CMSModule,
        UserModule,
        CommonModule,
    ],
    controllers: [
        ArticleController,
        IndexController,
    ],
    providers: [
    ],
})
export class AdminModule {}