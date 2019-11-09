import {
  Controller, Get, Param, Query, Res, UseGuards,
} from '@nestjs/common';
import * as moment from 'moment';
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
import { ActiveGuard } from '../core/guards/active.guard';

@Controller()
export class UCController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly collectionService: CollectionService,
    ) {}

    private readonly ucPages = [
        'articles', 'boilings', 'follows', 'followers',
        'followtags', 'buyhandbooks', 'writehandbooks', 'collections',
    ];

    @Get('/uc/:authorID/:page?')
    @UseGuards(ActiveGuard)
    async userCenter(@Param('authorID', MustIntPipe) authorID: number, @Param('page') page: string, @CurUser() user, @Res() res) {
        if (page && this.ucPages.indexOf(page) < 0) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        const followerID = user && user.id || undefined;
        const pageSize: number = 2;
        const [author, articles, followed] = await bluebird.all([
            this.userService.detail(authorID),
            this.articleService.userArticlesSortByCreatedAt(authorID, 1, pageSize),
            followerID ? this.userService.isUserFollowed(followerID, authorID) : Promise.resolve(false),
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
            userLevelChapterURL: this.configService.static.userLevelChapterURL,
            followed,
            user,
            author: {
                ...author,
                createdAtLabel: moment(author.createdAt).format('YYYY-MM-DD'),
            },
            salutation: user && user.id === author.id ? '我' : '他',
            articles,
            createCollections,
            manageCollections,
        });
    }

    @Get('/uc/:authorID/like/:type')
    async userCenterLike(@Param('authorID', MustIntPipe) authorID: number, @Param('type') type: string, @CurUser() user, @Res() res) {
        if (['articles', 'boilings'].indexOf(type) < 0) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        const pageSize: number = 2;
        const [author, articles] = await bluebird.all([
            this.userService.detail(authorID),
            this.articleService.userArticlesSortByCreatedAt(authorID, 1, pageSize),
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