import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { UserModule } from '../user/user.module';
import { CMSModule } from '../cms/cms.module';
import { IndexController } from './index.controller';

@Module({
    imports: [
        CMSModule,
        UserModule,
    ],
    controllers: [
        ArticleController,
        IndexController,
    ],
    providers: [
    ],
})
export class AdminModule {}