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
import { RolesGuard } from '../core/guards/roles.guard';
import { Roles } from '../core/decorators/roles.decorator';
import { UserRole } from '../entity/user.entity';
import { CreateHandBookDto } from './dto/create-handbook.dto';

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

    /**
     * 创建小册的页面
     */
    @Get('/handbooks/new')
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async createView(@CurUser() user, @Res() res) {
        const uploadPolicy = await this.ossService.requestPolicy();
        res.render('pages/handbook/editHandbook', {
            siteName: this.configService.server.siteName,
            companyName: this.configService.server.companyName,
            user,
            uploadPolicy,
        });
    }

    @Get('/handbooks/:id')
    async detailView(@CurUser() user, @Res() res) {
        res.render('pages/handbook/handbookDetail.njk', {
            handbooks: [
                {},
                {},
                {},
                {},
            ],
        });
    }

    /**
     * 编辑小册章节的页面
     */
    @Get('/handbooks/:handbookID/chapter/:chapterID/edit')
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async edit(@CurUser() user, @Param('handbookID', MustIntPipe) handbookID: number, @Param('chapterID') chapterID: string, @Res() res) {
        const uploadPolicy = await this.ossService.requestPolicy();
        res.render('pages/handbook/editHandbook', {
            siteName: this.configService.server.siteName,
            companyName: this.configService.server.companyName,
            user,
            uploadPolicy,
        });
    }

    @Get(`${APIPrefix}/handbooks/chapters/:id`)
    @UseGuards(ActiveGuard)
    async getHandBook(@Param('id', MustIntPipe) id: number) {
        return await this.handBookService.basic(id);
    }

    @Get(`${APIPrefix}/handbooks/:id`)
    @UseGuards(ActiveGuard)
    async getChapter(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        // let isQueryChapger = true;
        // let theChapterID;
        // if (chapterID === 'introduce') {
        //     isQueryChapger = false;
        // } else {
        //     theChapterID = parseInt(chapterID, 10);
        //     if (isNaN(theChapterID) || theChapterID <= 0) {
        //         throw new MyHttpException({
        //             errorCode: ErrorCode.NotFound.CODE,
        //         });
        //     }
        // }
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

    @Get(`${APIPrefix}/handbooks/:id/chapters`)
    @UseGuards(ActiveGuard)
    async getChapters(@Param('id', MustIntPipe) id: number) {
        return await this.handBookService.getChapters(id);
    }

    /**
     * 用户已购买的小册
     */
    @Get(`${APIPrefix}/handbooks/users/:userID/buy`)
    async userBuyHandBooks(@CurUser() user) {
        return {
            list: [
                {},
                {},
                {},
                {},
            ],
            count: 4,
            page: 1,
            pageSize: 20,
        };
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

    /**
     * 创建小册
     */
    @Post(`${APIPrefix}/handbooks`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async create(@CurUser() user, @Body() createHandBookDto: CreateHandBookDto) {
        const createResult = await this.handBookService.create(user.id, createHandBookDto);
        return {
            id: createResult.id,
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
}