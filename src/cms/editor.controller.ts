import * as util from 'util';
import {
    Controller, Post, Body, UseGuards, Get, Query, Param, Res, Delete,
} from '@nestjs/common';
import moment = require('moment');
import { ArticleService } from './article.service';
import { UserService } from '../user/user.service';
import { ActiveGuard } from '../core/guards/active.guard';
import { CurUser } from '../core/decorators/user.decorator';
import { strToPage } from '../utils/common';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { ErrorCode } from '../constants/error';
import { OSSService } from '../common/oss.service';
import { DraftService } from './draft.service';
import { APIPrefix } from '../constants/constants';
import { CreateDraftDto } from './dto/create-draft.dto';
import { ArticleContentType } from '../entity/article.entity';
import { SwitchEditorDto } from './dto/switch-editor.dto';
import { Draft } from '../entity/draft.entity';
import { MyHttpException } from '../core/exception/my-http.exception';
import { CollectionService } from './collection.service';
import { RedisService } from '../redis/redis.service';

@Controller()
export class EditorController {
    constructor(
        private readonly redisService: RedisService,
        private readonly userService: UserService,
        private readonly articleService: ArticleService,
        private readonly draftService: DraftService,
        private readonly ossService: OSSService,
        private readonly collectionService: CollectionService,
    ) {}

    @Get('/editor/drafts')
    @UseGuards(ActiveGuard)
    async listView(@Res() res) {
        res.render('pages/editor/drafts', {});
    }

    @Get('/editor/drafts/new')
    @UseGuards(ActiveGuard)
    async createDraftView(@CurUser() user, @Res() res) {
        const [settings, uploadPolicy] = await Promise.all([
            this.userService.findSettings(user.id),
            this.ossService.requestPolicy(),
        ]);
        if (!settings || settings.editorType === ArticleContentType.Markdown) {
            res.render('pages/editor/editMarkdownArticle', {
                user,
                uploadPolicy,
            });
            return;
        }
        res.render('pages/editor/editRichArticle', {
            user,
            uploadPolicy,
        });
    }

    @Get('/editor/drafts/:id')
    @UseGuards(ActiveGuard)
    async editDraftView(@Param('id', MustIntPipe) id: number, @CurUser() user, @Res() res) {
        const [draft, uploadPolicy] = await Promise.all([
            this.draftService.detail(id),
            this.ossService.requestPolicy(),
        ]);
        if (!draft) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (draft.contentType === ArticleContentType.HTML) {
            res.render('pages/editor/editRichArticle', {
                user,
                draft,
                uploadPolicy,
            });
            return;
        }
        res.render('pages/editor/editMarkdownArticle', {
            user,
            draft,
            uploadPolicy,
        });
    }

    @Get('/editor/posts/:id')
    @UseGuards(ActiveGuard)
    async editPostView(@Param('id', MustIntPipe) id: number, @CurUser() user, @Res() res) {
        const [article, uploadPolicy] = await Promise.all([
            this.articleService.detailForEditor(id),
            this.ossService.requestPolicy(),
        ]);
        if (article.contentType === ArticleContentType.HTML) {
            res.render('pages/editor/editRichArticle', {
                user,
                article,
                uploadPolicy,
            });
            return;
        }
        res.render('pages/editor/editMarkdownArticle', {
            user,
            article,
            uploadPolicy,
        });
    }

    @Get('/editor/published.html')
    @UseGuards(ActiveGuard)
    async publishedView(@CurUser() user, @Res() res) {
        const publishArticleKey: string = util.format(this.redisService.cacheKeys.publishArticle, user.id);
        const [article, recommendCollections, collections, contributeCollections] = await Promise.all([
            this.redisService.getCache(publishArticleKey),
            // 排除掉自己创建或管理的专题
            this.collectionService.recommends(user.id),
            this.collectionService.createOrMangeCollections(user.id, 1),
            // 排除掉自己创建或管理的专题
            this.collectionService.contributeCollections(user.id, 1),
        ]);
        if (!article) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        await this.redisService.delCache(publishArticleKey);
        const articleObj = JSON.parse(article);
        res.render('pages/editor/published', {
            user,
            article: articleObj,
            collections: collections || [],
            recommendCollections: recommendCollections || [],
            contributeCollections: contributeCollections || [],
        });
    }

    @Get(`${APIPrefix}/editor/drafts`)
    @UseGuards(ActiveGuard)
    async list(@Query('page') pageStr) {
        const page: number = strToPage(pageStr);
        const limit = 20;
        const [drafts, count] = await Promise.all([
            this.draftService.list(page, limit),
            this.draftService.count(),
        ]);
        const list = drafts.map(draft => {
            return {
                createdAtStr: moment(draft.createdAt).format('YYYY 年 MM 月 DD 日 HH:mm'),
                ...draft,
            };
        });

        return { list, count, page, limit };
    }

    @Post(`${APIPrefix}/editor/drafts`)
    @UseGuards(ActiveGuard)
    async create(@CurUser() user, @Body() createDraftDto: CreateDraftDto) {
        if (!createDraftDto.name && !createDraftDto.content) {
            return {};
        }
        const createResult = await this.draftService.create(createDraftDto, user.id);
        return createResult;
    }

    @Delete(`${APIPrefix}/editor/drafts/:id`)
    @UseGuards(ActiveGuard)
    async deleteDraft(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        await this.draftService.delete(id, user.id);
        return {};
    }

    @Post(`${APIPrefix}/editor/switch`)
    @UseGuards(ActiveGuard)
    async switchEditor(@CurUser() user, @Body() switchEditorDto: SwitchEditorDto) {
        let createResult: Draft;
        if (switchEditorDto.name || switchEditorDto.content) {
            createResult = await this.draftService.create(switchEditorDto, user.id);
        }
        await this.userService.updateEditorSettings(user.id, switchEditorDto.editorType);
        return createResult && { id: createResult.id } || {};
    }
}