import {
    Controller, Post, Body, UseGuards, Get, Query, Param, Delete, Res, Put,
} from '@nestjs/common';
import * as _ from 'lodash';
import { ErrorCode } from '../constants/error';
import { MyHttpException } from '../core/exception/my-http.exception';
import { CurUser } from '../core/decorators/user.decorator';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { ConfigService } from '../config/config.service';
import { ActiveGuard } from '../core/guards/active.guard';
import { HandBookService } from './handbook.service';
import { OSSService } from '../common/oss.service';
import { APIPrefix } from '../constants/constants';
import {
    UpdateHandbookChapterNameDto,
    UpdateHandbookChapterContentDto,
    UpdateHandbookChapterTryReadDto,
} from './dto/update-handbook-chapter.dto';
import { CreateHandbookChapterDto } from './dto/create-handbook-chapter.dto';
import { UpdateHandbookIntroduceDto, CommitHandbookDto } from './dto/update-handbook.dto';

@Controller()
export class HandBookController {
    constructor(
        private readonly configService: ConfigService,
        private readonly handBookService: HandBookService,
        private readonly ossService: OSSService,
    ) {}

    @Get('/handbooks')
    async list(@CurUser() user, @Res() res) {
        const data = {
            icp: this.configService.server.icp,
            categories: [
                {
                    name: '前端',
                },
                {
                    name: '后台',
                },
                {
                    name: '移动开发',
                },
                {
                    name: '区块链',
                },
                {
                    name: '通用',
                },
            ],
            handbooks: [
                {},
                {},
                {},
                {},
            ],
        };
        res.render('pages/handbook/handbooks.njk', data);
    }

    @Get('/handbooks/:id.html')
    async detail(@CurUser() user, @Res() res) {
        res.render('pages/handbook/handbookDetail.njk', {
            handbooks: [
                {},
                {},
                {},
                {},
            ],
        });
    }

    @Get('/handbooks/new')
    @UseGuards(ActiveGuard)
    async create(@CurUser() user, @Query() query, @Res() res) {
        const handBook = await this.handBookService.create(user.id);
        res.redirect(`/handbooks/${handBook.id}/chapter/introduce/edit`);
    }

    @Get('/handbooks/:handbookID/chapter/:chapterID/edit')
    @UseGuards(ActiveGuard)
    async edit(@CurUser() user, @Param('handbookID', MustIntPipe) handbookID: number, @Param('chapterID') chapterID: string, @Res() res) {
        let isQueryChapger = true;
        let theChapterID;
        if (chapterID === 'introduce') {
            isQueryChapger = false;
        } else {
            theChapterID = parseInt(chapterID, 10);
            if (isNaN(theChapterID) || theChapterID <= 0) {
                throw new MyHttpException({
                    errorCode: ErrorCode.NotFound.CODE,
                });
            }
        }
        const [ handbook, chapters, chapter, uploadPolicy ] = await Promise.all([
            this.handBookService.basic(handbookID),
            this.handBookService.getChapters(handbookID),
            isQueryChapger ? this.handBookService.getChapter(theChapterID) : Promise.resolve(null),
            this.ossService.requestPolicy(),
        ]);

        res.render('pages/handbook/editHandbook', {
            siteName: this.configService.server.siteName,
            companyName: this.configService.server.companyName,
            user,
            handbook: {
                ...handbook,
                completionAt: handbook.completionAt ? handbook.completionAt.getTime() : undefined,
            },
            chapters,
            chapter,
            uploadPolicy,
        });
    }

    @Put(`${APIPrefix}/handbooks/:id/introduce`)
    @UseGuards(ActiveGuard)
    async updateHandbookIntroduce(@CurUser() user, @Param('id', MustIntPipe) id: number, @Body() updateDto: UpdateHandbookIntroduceDto) {
        await this.handBookService.updateIntroduce(id, updateDto.introduce, user.id);
        return {
        };
    }

    @Put(`${APIPrefix}/handbooks/:id/commit`)
    @UseGuards(ActiveGuard)
    async commitHandbook(@CurUser() user, @Param('id', MustIntPipe) id: number, @Body() handbookDto: CommitHandbookDto) {
        if (!handbookDto.isAgree) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }
        const data = {
            name: handbookDto.name || '',
            summary: handbookDto.summary || '',
            authorIntro: handbookDto.authorIntro || '',
            price: handbookDto.price || 0,
            completionAt: handbookDto.completionAt ? new Date(handbookDto.completionAt) : null,
            isAllDone: handbookDto.isAllDone,
            isAgree: handbookDto.isAgree,
        };
        if (!data.completionAt) {
            delete data.completionAt;
        }
        await this.handBookService.updateHandbook(id, data, user.id);
        return {
        };
    }

    @Post(`${APIPrefix}/handbooks/:id/chapters`)
    @UseGuards(ActiveGuard)
    async createChapter(@CurUser() user, @Param('id', MustIntPipe) id: number, @Body() chapterDto: CreateHandbookChapterDto) {
        const isHandbookOwner = this.handBookService.isOwner(id, user.id);
        if (!isHandbookOwner) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }
        const createResult = await this.handBookService.createChapter(id, chapterDto.name, user.id);
        return {
            id: createResult.id,
            name: chapterDto.name,
        };
    }

    @Put(`${APIPrefix}/handbooks/chapters/:id/title`)
    @UseGuards(ActiveGuard)
    async updateChapterTitle(@CurUser() user, @Param('id', MustIntPipe) id: number, @Body() updateChapterDto: UpdateHandbookChapterNameDto) {
        await this.handBookService.updateChapterTitle(id, updateChapterDto.name, user.id);
        return {
            name: updateChapterDto.name,
        };
    }

    @Put(`${APIPrefix}/handbooks/chapters/:id/content`)
    @UseGuards(ActiveGuard)
    async updateChapterContent(@CurUser() user, @Param('id', MustIntPipe) id: number, @Body() updateChapterDto: UpdateHandbookChapterContentDto) {
        await this.handBookService.updateChapterContent(id, updateChapterDto.content, user.id);
        return {
        };
    }

    @Put(`${APIPrefix}/handbooks/chapters/:id/tryread`)
    @UseGuards(ActiveGuard)
    async updateChapterTryRead(@CurUser() user, @Param('id', MustIntPipe) id: number, @Body() updateChapterDto: UpdateHandbookChapterTryReadDto) {
        await this.handBookService.updateChapterTryRead(id, updateChapterDto.tryRead, user.id);
        return {
            tryRead: updateChapterDto.tryRead,
        };
    }

    @Delete(`${APIPrefix}/handbooks/chapters/:id`)
    @UseGuards(ActiveGuard)
    async deleteChapter(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        await this.handBookService.deleteChapter(id, user.id);
        return {
        };
    }

    @Get(`${APIPrefix}/handbooks/chapters/:id`)
    @UseGuards(ActiveGuard)
    async getChapter(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        const chapter = await this.handBookService.getChapter(id);
        if (!chapter) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (chapter.userID !== user.id) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }
        chapter.content = chapter.content || '';
        return {
            chapter,
        };
    }
}