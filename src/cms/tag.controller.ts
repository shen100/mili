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
import { ListResult } from '../entity/interface';

@Controller()
export class TagController {
    constructor(
        private readonly tagService: TagService,
    ) {}

    @Get('/tags')
    async tagView(@Res() res) {
        res.render('pages/tag/tag');
    }

    @Get(`${APIPrefix}/tags/search`)
    async search(@Query('q') q: string) {
        if (q) {
            q = decodeURIComponent(q);
        }
        const listResult = await this.tagService.list(1, 20, 'hot', q);
        return listResult.list;
    }

    @Get(`${APIPrefix}/tags`)
    async list(@CurUser() user, @Query('type') type: string,
               @Query('order') order: string, @Query('q') q: string,
               @Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        if (q) {
            q = decodeURIComponent(q);
        }
        let listResult: ListResult;
        if (type === 'all') {
            listResult = await this.tagService.list(page, pageSize, order, q);
        } else {
            if (!user) {
                throw new MyHttpException({
                    errorCode: ErrorCode.Forbidden.CODE,
                });
            }
            listResult = await this.tagService.subscribedList(user.id, page, pageSize, order, q);
        }
        if (user) {
            const tags = listResult.list.map(tag => tag.id);
            const followedTags = await this.tagService.tagsFilterByFollowerID(tags, user.id);
            const tagMap = {};
            followedTags.forEach(followedTag => {
                tagMap[followedTag.tagID] = true;
            });
            listResult.list.forEach((tag: any) => {
                tag.isFollowed = !!tagMap[tag.id];
            });
        } else {
            listResult.list.forEach((tag: any) => {
                tag.isFollowed = false;
            });
        }
        return listResult;
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