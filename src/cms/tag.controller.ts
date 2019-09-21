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
    constructor(
        private readonly tagService: TagService,
        private readonly articleService: ArticleService,
    ) {}

    @Get('/tags')
    async tagView(@Res() res) {
        res.render('pages/tag/tag');
    }

    @Get('/tags/:id')
    async tagDetailView(@Res() res, @CurUser() user, @Param('id', MustIntPipe) id: number) {
        const [tag, isFollowed] = await Promise.all([
            this.tagService.detail(id),
            user ? this.tagService.isFollowed(user.id, id) : Promise.resolve(false),
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

    @Get(`${APIPrefix}/tags/:id/articles`)
    async articles(@Param('id', MustIntPipe) id: number, @Query('page', ParsePagePipe) page: number,
                   @Query('order') order: string) {
        const pageSize = 20;
        const listResult = await this.articleService.listInTag(id, order, page, pageSize);
        return listResult;
    }

    @Get(`${APIPrefix}/tags/search`)
    async search(@Query('q') q: string) {
        if (q) {
            q = decodeURIComponent(q);
        }
        const listResult = await this.tagService.list(1, 20, 'hot', q);
        return listResult.list;
    }

    /**
     * 关注的标签
     */
    @Get(`${APIPrefix}/tags/users/:userID/follow`)
    async userFollowTags(@CurUser() user, @Param('userID', MustIntPipe) userID: number, @Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        // 用户A访问用户B的个人中心，查出用户A关注了哪些标签
        const listResult: ListResult<Tag> = await this.tagService.userFollowTags(userID, page, pageSize);
        const tags = listResult.list.map(tag => tag.id);
        // 再查出这些标签中，有哪些是用户B也关注了的
        const followedTags = await this.tagService.tagsFilterByFollowerID(tags, user.id);
        const tagMap = {};
        followedTags.forEach(followedTag => {
            tagMap[followedTag.tagID] = true;
        });
        listResult.list.forEach((tag: any) => {
            tag.isFollowed = !!tagMap[tag.id];
        });
        return listResult;
    }

    @Get(`${APIPrefix}/tags`)
    async list(@CurUser() user, @Query('type') type: string,
               @Query('order') order: string, @Query('q') q: string,
               @Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        if (q) {
            q = decodeURIComponent(q);
        }
        let listResult: ListResult<Tag>;
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