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
import { UpdateHandbookChapterDto } from './dto/update-handbook-chapter.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { CreateHandbookChapterDto } from './dto/create-handbook-chapter.dto';

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
        res.redirect(`/handbooks/${handBook.id}/chapter/summary/edit`);
    }

    @Get('/handbooks/:handbookID/chapter/:chapterID/edit')
    @UseGuards(ActiveGuard)
    async edit(@CurUser() user, @Param('handbookID', MustIntPipe) handbookID: number, @Param('chapterID') chapterID: string, @Res() res) {
        let isQueryChapger = true;
        let theChapterID;
        if (chapterID === 'summary') {
            isQueryChapger = false;
        } else {
            theChapterID = parseInt(chapterID);
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
            user,
            handbook,
            chapters,
            chapter,
            uploadPolicy,
        });
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

    @Put(`${APIPrefix}/handbooks/chapters/title`)
    @UseGuards(ActiveGuard)
    async updateChapterTitle(@CurUser() user, @Body() updateChapterDto: UpdateHandbookChapterDto) {
        await this.handBookService.updateChapterTitle(updateChapterDto.id, updateChapterDto.name, user.id);
        return {
            name: updateChapterDto.name,
        };
    }
}