import {
    Controller, Post, Body, UseGuards, Get, Query, Param, Delete, Res,
} from '@nestjs/common';
import * as _ from 'lodash';
import { ErrorCode } from '../constants/error';
import { MyHttpException } from '../common/exception/my-http.exception';
import { CurUser } from '../common/decorators/user.decorator';
import { MustIntPipe } from '../common/pipes/must-int.pipe';
import { ConfigService } from '../config/config.service';
import { ActiveGuard } from '../common/guards/active.guard';
import { CreateHandBookDto } from './dto/create-handbook.dto';
import { HandBookService } from './handbook.service';
import { UploadService } from './upload.service';

@Controller()
export class HandBookController {
    constructor(
        private readonly configService: ConfigService,
        private readonly handBookService: HandBookService,
        private readonly uploadService: UploadService,
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
        const chapter = await this.handBookService.createChapter(user.id, handBook.id);
        res.redirect(`/handbooks/${handBook.id}/chapter/${chapter.id}/edit.html`);
    }

    @Get('/handbooks/:id/chapter/:chapterID/edit.html')
    @UseGuards(ActiveGuard)
    async edit(@CurUser() user, @Param('id', MustIntPipe) id: number, @Res() res) {
        const [ handBook, chapters, uploadPolicy ] = await Promise.all([
            this.handBookService.basic(id),
            this.handBookService.chapters(id),
            this.uploadService.requestPolicy(),
        ]);

        res.render('pages/handbook/editHandbook', {
            user,
            handBook,
            chapters,
            uploadPolicy,
        });
    }
}