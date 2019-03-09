import {
    Controller, Post, Body, UseGuards, Get, Query, Param, Render, Res, Delete,
} from '@nestjs/common';
import moment = require('moment');
import { ArticleService } from './article.service';
import { UserService } from '../user/user.service';
import { ActiveGuard } from '../common/guards/active.guard';
import { CurUser } from '../common/decorators/user.decorator';
import { strToPage } from '../utils/common';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { ErrorCode } from '../config/constants';
import { UploadService } from './upload.service';
import { DraftService } from './draft.service';
import { APIPrefix } from '../config/constants';
import { CreateDraftDto } from './dto/create-draft.dto';
import { ArticleContentType } from '../entity/article.entity';
import { SwitchEditorDto } from './dto/switch-editor.dto';
import { Draft } from '../entity/draft.entity';
import { MyHttpException } from '../common/exception/my-http.exception';

@Controller()
export class EditorController {
    constructor(
        private readonly userService: UserService,
        private readonly articleService: ArticleService,
        private readonly draftService: DraftService,
        private readonly uploadService: UploadService,
    ) {}

    @Get('/editor/drafts.html')
    @UseGuards(ActiveGuard)
    async listView(@Res() res) {
        res.render('pages/editor/drafts', {});
    }

    @Get('/editor/drafts/new')
    @UseGuards(ActiveGuard)
    async createDraft(@CurUser() user, @Query() query, @Res() res) {
        const [settings, uploadPolicy] = await Promise.all([
            this.userService.findSettings(user.id),
            this.uploadService.requestPolicy(),
        ]);
        if (settings.editorType === ArticleContentType.HTML) {
            res.render('pages/editor/editRichArticle', {
                user,
                uploadPolicy,
            });
            return;
        }
        res.render('pages/editor/editMarkdownArticle', {
            user,
            uploadPolicy,
        });
    }

    @Get('/editor/drafts/:id.html')
    @UseGuards(ActiveGuard)
    async editDraftView(@Param('id', ParseIntPipe) id: number, @CurUser() user, @Res() res) {
        const [draft, uploadPolicy] = await Promise.all([
            this.draftService.detail(id),
            this.uploadService.requestPolicy(),
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

    @Get('/editor/posts/:id.html')
    @UseGuards(ActiveGuard)
    async editPostView(@Param('id', ParseIntPipe) id: number, @CurUser() user, @Res() res) {
        const [article, uploadPolicy] = await Promise.all([
            this.articleService.detailForEditor(id),
            this.uploadService.requestPolicy(),
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

    @Get('/editor/published/:id.html')
    @UseGuards(ActiveGuard)
    async publishedView(@Param('id', ParseIntPipe) id: number, @CurUser() user, @Res() res) {
        const [article] = await Promise.all([
            this.articleService.detailForEditor(id),
        ]);
        res.render('pages/editor/published', {
            user,
            article,
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
    async deleteDraft(@CurUser() user, @Param('id', ParseIntPipe) id: number) {
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