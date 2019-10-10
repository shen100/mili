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
import { ListResult } from '../entity/listresult.entity';
import { ArticleService } from './article.service';
import { Tag } from '../entity/tag.entity';

@Controller()
export class TagController {
    private readonly sortArr = ['popular', 'newest'];

    constructor(
        private readonly tagService: TagService,
        private readonly articleService: ArticleService,
    ) {}

    /**
     * 标签管理页面
     */
    @Get('/tags')
    @UseGuards(ActiveGuard)
    async tagView(@Res() res) {
        res.render('pages/tag/tag');
    }

    /**
     * 标签详情页面
     */
    @Get('/tags/:id')
    async tagDetailView(@CurUser() user, @Param('id', MustIntPipe) id: number, @Res() res) {
        const [tag, isFollowed] = await Promise.all([
            this.tagService.detail(id),
            user ? this.tagService.isFollowed(id, user.id) : Promise.resolve(false),
        ]);
        if (!tag) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        res.render('pages/tag/tagDetail', {
            isFollowed,
            tag,
        });
    }

    /**
     * 用户关注的标签
     */
    @Get(`${APIPrefix}/tags/users/:userID/follow`)
    async userFollowTags(@CurUser() user, @Param('userID', MustIntPipe) userID: number, @Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        const listResult: ListResult<Tag> = await this.tagService.userFollowTags(userID, page, pageSize);
        if (!user) {
            listResult.list.forEach((tag: any) => tag.isFollowed = false);
            return listResult;
        }
        if (user.id === userID) {
            listResult.list.forEach((tag: any) => tag.isFollowed = true);
            return listResult;
        }
        return this.addPropertyIsFollowed(listResult, user.id);
    }

    /**
     * 全部标签
     */
    @Get(`${APIPrefix}/tags`)
    async list(@CurUser() user, @Query('sort') sort: string, @Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        if (this.sortArr.indexOf(sort) < 0) {
            sort = this.sortArr[0];
        }
        const listResult: ListResult<Tag> = await this.tagService.list(page, pageSize, sort);
        if (!user) {
            listResult.list.forEach((tag: any) => tag.isFollowed = false);
            return listResult;
        }
        return this.addPropertyIsFollowed(listResult, user.id);
    }

    /**
     * 根据关键词搜索标签
     */
    @Get(`${APIPrefix}/tags/search`)
    async search(@CurUser() user, @Query('sort') sort: string, @Query('q') q: string,
                 @Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        q = q ? decodeURIComponent(q) : '';
        q = q.trim();
        if (!q) {
            return { list: [], count: 0, page: 1, pageSize };
        }
        const listResult: ListResult<Tag> = await this.tagService.search(q, page, pageSize, sort);
        if (!user) {
            listResult.list.forEach((tag: any) => tag.isFollowed = false);
            return listResult;
        }
        return this.addPropertyIsFollowed(listResult, user.id);
    }

    private async addPropertyIsFollowed(listResult: ListResult<Tag>, userID: number) {
        const tagIDs: number[] = listResult.list.map(tag => tag.id);
        const followedTags = await this.tagService.tagsFilterByFollowerID(tagIDs, userID);
        const tagMap = {};
        followedTags.forEach(t => tagMap[t.tagID] = true);
        listResult.list.forEach((tag: any) => tag.isFollowed = !!tagMap[tag.id]);
        return listResult;
    }

    /**
     * 标签下的文章
     */
    @Get(`${APIPrefix}/tags/:id/articles`)
    async articles(@Param('id', MustIntPipe) id: number, @Query('page', ParsePagePipe) page: number,
                   @Query('sort') sort: string) {
        const pageSize = 20;
        if (this.sortArr.indexOf(sort) < 0) {
            sort = this.sortArr[0];
        }
        const listResult = await this.articleService.listInTag(id, page, pageSize, sort);
        return listResult;
    }

    /**
     * 关注标签
     */
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

    @Post(`${APIPrefix}/tags`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async create(@Body() createArticleDto: CreateTagDto) {
        await this.tagService.create(createArticleDto);
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
}