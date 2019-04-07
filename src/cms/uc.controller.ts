import {
  Controller, Get, Param, Query, Res,
} from '@nestjs/common';
import * as bluebird from 'bluebird';
import { ArticleService } from './article.service';
import { UserService } from '../user/user.service';
import { MustIntPipe } from '../common/pipes/must-int.pipe';
import { strToPage } from '../utils/common';
import { ConfigService } from '../config/config.service';
import { Article } from 'entity/article.entity';
import { ErrorCode } from '../config/constants';
import { CurUser } from '../common/decorators/user.decorator';
import { MyHttpException } from '../common/exception/my-http.exception';
import { CollectionService } from './collection.service';
import { Collection } from 'entity/collection.entity';

@Controller('u')
export class UCController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly collectionService: CollectionService,
    ) {}

    @Get('/:id.html')
    async article(@Param('id', MustIntPipe) id: number, @CurUser() user, @Res() res) {
        const pageSize: number = 2;
        const [author, articles] = await bluebird.all([
            this.userService.detail(id),
            this.articleService.userArticlesSortByCreatedAt(id, 1, pageSize),
        ]);
        if (!author) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        const createCollections: Collection[] = [];
        const manageCollections: Collection[] = [];
        author.collections.forEach(c => {
            if (c.creatorID === author.id) {
                createCollections.push(c);
            } else {
                manageCollections.push(c);
            }
        });
        res.render('pages/user/user', {
            followed: false,
            user,
            author,
            salutation: user && user.id === author.id ? '我' : '他',
            articles,
            createCollections,
            manageCollections,
        });
    }

    @Get('/articles')
    async list(@Query('userID', MustIntPipe) userID: number,
               @Query('page', MustIntPipe) page: number,
               @Query('format') format: string,
               @Query('sort') sort: string) {
        const pageSize: number = 2;
        let articles: Article[];
        switch (sort) {
            case 'createdat': {
                articles = await this.articleService.userArticlesSortByCreatedAt(userID, page, pageSize);
                break;
            }
            case 'hot': {
                articles = await this.articleService.userArticlesSortByHot(userID, page, pageSize);
                break;
            }
            case 'commentcount': {
                articles = await this.articleService.userArticlesSortByCommentCount(userID, page, pageSize);
                break;
            }
            default: {
                articles = await this.articleService.userArticlesSortByCreatedAt(userID, page, pageSize);
            }
        }
        const result: any = {
            data: {
                articles,
            },
        };
        if (format === 'html') {
            result.view = 'component/cms/articles';
        } else {
            result.errNo = ErrorCode.SUCCESS.CODE;
        }
        return result;
    }
}