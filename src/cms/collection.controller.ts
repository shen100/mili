import {
    Controller, Get, Param, Query, Res, Post, Body, UseGuards, Put, Delete,
} from '@nestjs/common';
import * as _ from 'lodash';
import * as bluebird from 'bluebird';
import { ArticleService } from './article.service';
import { UserService } from '../user/user.service';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { strToPage } from '../utils/common';
import { ConfigService } from '../config/config.service';
import { Article } from 'entity/article.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UploadService } from './upload.service';
import { CollectionService } from './collection.service';
import { Collection } from '../entity/collection.entity';
import { CollectionStatus } from '../entity/collection.entity';
import { ErrorCode } from '../config/constants';
import { MyHttpException } from '../common/exception/my-http.exception';
import { CurUser } from '../common/decorators/user.decorator';
import { ActiveGuard } from '../common/guards/active.guard';
import { User, Follower } from '../entity/user.entity';
import { ParsePagePipe } from '../common/pipes/parse-page.pipe';

@Controller()
export class CollectionController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly uploadService: UploadService,
        private readonly collectionService: CollectionService,
    ) {}

    @Get('/collections/:id.html')
    async detail(@Param('id', ParseIntPipe) id: number, @CurUser() user, @Res() res) {
        const pageSize: number = 2;
        const [articles, collection, articleCount, isFollowed, followers] = await bluebird.all([
            this.articleService.collectionArticlesSortByCommentCount(id, 1, pageSize),
            this.collectionService.findById(id),
            this.collectionService.articleCount(id),
            user ? this.collectionService.isFollowed(user.id, id) : Promise.resolve(false),
            this.collectionService.getFollowers(id, 1),
        ]);
        if (!collection) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        let creatorIndex: number;
        let isCollectionAdmin: boolean = false;
        collection.admins.forEach((u: User, index: number) => {
            if (u.id === collection.creatorID) {
                creatorIndex = index;
            }
            if (u.id === user.id) {
                isCollectionAdmin = true;
            }
        });
        if (creatorIndex > 0) {
            [collection.admins[0], collection.admins[creatorIndex]] = [collection.admins[creatorIndex], collection.admins[0]];
        }

        res.render('pages/collection/collection', {
            isFollowed,
            isCreator: user && user.id === collection.creatorID,
            articles,
            articleCount: articleCount || 0,
            collection,
            isCollectionAdmin,
            followers,
        });
    }

    @Get('/collections/new')
    @UseGuards(ActiveGuard)
    async createView(@Res() res) {
        const uploadPolicy = await this.uploadService.requestPolicy();
        res.render('pages/collection/edit', {
            uploadPolicy,
            collection: {},
        });
    }

    @Get('/collections/:id/edit.html')
    @UseGuards(ActiveGuard)
    async editView(@CurUser() user, @Param('id', ParseIntPipe) id: number, @Res() res) {
        const [collection, uploadPolicy] = await bluebird.all([
            this.collectionService.findById(id),
            this.uploadService.requestPolicy(),
        ]);
        if (!collection) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (collection.creatorID !== user.id) {
            res.redirect(`/u/${user.id}.html`);
            return;
        }
        res.render('pages/collection/edit', {
            uploadPolicy,
            collection,
        });
    }

    @Post('/api/v1/collections')
    @UseGuards(ActiveGuard)
    async create(@CurUser() user, @Body() createCollectionDto: CreateCollectionDto) {
        const collection: Collection = await this.collectionService.create(createCollectionDto, user.id);
        return collection;
    }

    @Put('/api/v1/collections/:id')
    @UseGuards(ActiveGuard)
    async update(@CurUser() user, @Param('id', ParseIntPipe) id: number,
                 @Body() createCollectionDto: CreateCollectionDto) {
        return await this.collectionService.updateOne(createCollectionDto, id, user.id);
    }

    @Post('/api/v1/collections/:collectionID/articles/:articleID')
    @UseGuards(ActiveGuard)
    async collectArticle(@CurUser() user, @Param('collectionID', ParseIntPipe) collectionID: number,
                         @Param('articleID', ParseIntPipe) articleID: number) {
        const [collection, article] = await Promise.all([
            this.collectionService.findById(collectionID),
            this.articleService.detail(articleID),
        ]);
        if (!collection) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (!article) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (article.user.id !== user.id) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }
        const index: number = collection.admins.findIndex((admin: User) => {
            return admin.id === user.id;
        });

        let status: number = CollectionStatus.Auditing;
        if (index >= 0) {
            status = CollectionStatus.Collected;
        }
        await this.collectionService.collectArticle(collectionID, articleID, status);
        return {};
    }

    @Delete('/api/v1/collections/:collectionID/articles/:articleID')
    @UseGuards(ActiveGuard)
    async removeArticle(@CurUser() user, @Param('collectionID', ParseIntPipe) collectionID: number,
                        @Param('articleID', ParseIntPipe) articleID: number) {
        const [collection, article] = await Promise.all([
            this.collectionService.findById(collectionID),
            this.articleService.detail(articleID),
        ]);
        if (!collection) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (!article) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (article.user.id !== user.id) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }

        await this.collectionService.removeArticle(collectionID, articleID);
        return {};
    }

    @Get('/api/v1/collections/:id/myarticles')
    @UseGuards(ActiveGuard)
    async myArticles(@CurUser() user, @Param('id', ParseIntPipe) id: number, @Query('page', ParsePagePipe) page: number,
                     @Query('q') keyword: string) {
        const pageSize: number = 20;
        let  articles: Article[];
        keyword = _.trim(keyword || '');
        keyword = decodeURIComponent(keyword);
        if (keyword) {
            articles = await this.articleService.userArticlesByLike(user.id, keyword, page, pageSize);
        } else {
            articles = await this.articleService.userArticlesSortByCreatedAt(user.id, page, pageSize);
        }
        const articleIDs: number[] = articles.map((article: Article) => article.id);
        const collectedArticleMap = {};
        if (articles.length) {
            const collectedArticles = await this.collectionService.articlesStatusInCollection(id, articleIDs);
            collectedArticles.forEach(colArticle => collectedArticleMap[colArticle.article_id] = colArticle);
        }
        const myArticles = [];
        articles.map(article => {
            const theArticle: any = _.pick(article, ['id', 'name']);
            if (collectedArticleMap[article.id]) {
                theArticle.collectionStatus = collectedArticleMap[article.id].status;
            } else {
                theArticle.collectionStatus = CollectionStatus.NotCollect;
            }
            myArticles.push(theArticle);
        });
        return myArticles;
    }

    @Delete('/api/v1/collections/:id')
    @UseGuards(ActiveGuard)
    async removeCollection(@CurUser() user, @Param('id', ParseIntPipe) id: number) {
        const collection: Collection = await this.collectionService.findById(id);
        if (!collection) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (collection.creatorID !== user.id) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }
        await this.collectionService.deleteCollection(collection.id);
        return {};
    }

    @Post('/api/v1/collections/:id/follow')
    @UseGuards(ActiveGuard)
    async follow(@CurUser() user, @Param('id', ParseIntPipe) id: number) {
        const collection: Collection = await this.collectionService.findById(id);
        if (!collection) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        await this.collectionService.addFollower(collection.id, user.id);
        return {};
    }

    @Delete('/api/v1/collections/:id/follow')
    @UseGuards(ActiveGuard)
    async cancelFollow(@CurUser() user, @Param('id', ParseIntPipe) id: number) {
        const collection: Collection = await this.collectionService.findById(id);
        if (!collection) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        await this.collectionService.removeFollower(collection.id, user.id);
        return {};
    }

    @Get('/api/v1/collections/:id/followers')
    @UseGuards(ActiveGuard)
    async followers(@CurUser() user, @Param('id', ParseIntPipe) id: number) {
        const followers: Follower[] = await this.collectionService.getFollowers(id, 1);
        return followers;
    }
}