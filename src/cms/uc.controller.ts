import {
  Controller, Get, Param, Query, Res,
} from '@nestjs/common';
import * as bluebird from 'bluebird';
import { ArticleService } from './article.service';
import { UserService } from '../user/user.service';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { ConfigService } from '../config/config.service';
import { Article } from '../entity/article.entity';
import { ErrorCode } from '../constants/error';
import { CurUser } from '../core/decorators/user.decorator';
import { MyHttpException } from '../core/exception/my-http.exception';
import { CollectionService } from './collection.service';
import { Collection } from '../entity/collection.entity';
import { ShouldIntPipe } from '../core/pipes/should-int.pipe';

@Controller()
export class UCController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly collectionService: CollectionService,
    ) {}

    @Get('/users/:id/:page')
    async userCenter(@Param('id', MustIntPipe) id: number, @Param('page') page: string, @CurUser() user, @Res() res) {
        if (['articles', 'boilings'].indexOf(page) < 0) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
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

    @Get('/users/articles')
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

    @Get('/api/v1/users/:userID/businesscard')
    async businessCard(@CurUser() user, @Param('userID', MustIntPipe) userID: number) {
        const [userInfo, articles, isFollowed] = await Promise.all([
            this.userService.detail(userID),
            this.articleService.userRecentArticles(userID, 3),
            user ? this.userService.isUserFollowed(user.id, userID) : Promise.resolve(false),
        ]);
        return {
            user: userInfo,
            articles,
            isFollowed,
        };
    }
}