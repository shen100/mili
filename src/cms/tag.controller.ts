import {
    Controller, Post, UseGuards, Body, Res, Get, Query, Param, Delete,
} from '@nestjs/common';
import { APIPrefix } from '../constants/constants';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { ActiveGuard } from '../core/guards/active.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { Roles } from '../core/decorators/roles.decorator';
import { UserRole } from '../entity/user.entity';
import { ParsePagePipe } from '../core/pipes/parse-page.pipe';
import { CurUser } from '../core/decorators/user.decorator';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import { MustIntPipe } from '../core/pipes/must-int.pipe';

@Controller()
export class TagController {
    constructor(
        private readonly tagService: TagService,
    ) {}

    @Get('/tag')
    async tagView(@Res() res) {
        res.render('pages/tag/tag');
    }

    @Get(`${APIPrefix}/tags/all`)
    async all(@Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        return await this.tagService.list(page, pageSize);
    }

    @Get(`${APIPrefix}/tags/subscribed`)
    @UseGuards(ActiveGuard)
    async subscribed(@CurUser() user, @Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        return await this.tagService.subscribedList(user.id, page, pageSize);
    }

    @Post(`${APIPrefix}/tags/:id/follow`)
    @UseGuards(ActiveGuard)
    async follow(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        const tagExists: boolean = await this.tagService.isExists(id);
        if (!tagExists) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        await this.tagService.addFollower(id, user.id);
        return {};
    }

    @Delete(`${APIPrefix}/tags/:id/follow`)
    @UseGuards(ActiveGuard)
    async cancelFollow(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        const tagExists: boolean = await this.tagService.isExists(id);
        if (!tagExists) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        await this.tagService.removeFollower(id, user.id);
        return {};
    }

    @Post(`${APIPrefix}/tags`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async create(@Body() createArticleDto: CreateTagDto) {
        await this.tagService.create(createArticleDto);
        return {};
    }
}