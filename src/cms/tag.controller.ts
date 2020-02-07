import {
    Controller, Post, UseGuards, Body, Res, Get, Query, Param, Delete, Put,
} from '@nestjs/common';
import { APIPrefix, AdminAPIPrefix } from '../constants/constants';
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
import { UpdateTagDto } from './dto/update-tag.dto';
import { ShouldIntPipe } from '../core/pipes/should-int.pipe';
import { clampNumber } from '../utils/common';

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
     * 标签列表(不带分类)
     */
    @Get(`${APIPrefix}/tags`)
    async list(@CurUser() user, @Query('sort') sort: string, @Query('page', ParsePagePipe) page: number,
               @Query('pageSize', ShouldIntPipe) pageSize: number) {
        pageSize = clampNumber(pageSize, 20, 100);
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
     * 所有标签(不带分类)
     */
    @Get(`${APIPrefix}/tags/all`)
    @UseGuards(ActiveGuard)
    async all() {
        return await this.tagService.all();
    }

    /**
     * 标签列表(带分类)
     */
    @Get(`${APIPrefix}/tags/with_categories`)
    async listWithCategories(@Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        const listResult: ListResult<Tag> = await this.tagService.listWithCategories(page, pageSize);
        console.log(JSON.stringify(listResult));
        return listResult;
    }

    /**
     * 分类下的标签
     */
    @Get(`${APIPrefix}/tags/category/:categoryID`)
    async listInCategory(@Param('categoryID', MustIntPipe) categoryID: number) {
        return await this.tagService.listInCategory(categoryID);
    }

    /**
     * 搜索分类下的标签
     */
    @Get(`${APIPrefix}/tags/category/:categoryID/search`)
    async searchInCategory(@Param('categoryID', MustIntPipe) categoryID: number, @Query('q') q: string) {
        q = decodeURIComponent(q || '');
        return await this.tagService.searchInCategory(categoryID, q);
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

    /**
     * 创建标签
     */
    @Post(`${AdminAPIPrefix}/tags`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async create(@Body() createArticleDto: CreateTagDto) {
        const tag: Tag = await this.tagService.create(createArticleDto);
        return { id: tag.id };
    }

    /**
     * 编辑标签
     */
    @Put(`${AdminAPIPrefix}/tags/:id`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async update(@Param('id', MustIntPipe) id: number, @Body() updateTagDto: UpdateTagDto) {
        if (id !== updateTagDto.id) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        await this.tagService.update(updateTagDto);
        return {};
    }

    /**
     * 取消关注标签
     */
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