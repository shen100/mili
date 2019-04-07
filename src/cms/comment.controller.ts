import {
    Controller, Post, Body, UseGuards, Get, Query, Param, Delete,
} from '@nestjs/common';
import * as _ from 'lodash';
import { ArticleService } from './article.service';
import { ErrorCode } from '../config/constants';
import { MyHttpException } from '../common/exception/my-http.exception';
import { CurUser } from '../common/decorators/user.decorator';
import { ActiveGuard } from '../common/guards/active.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { MustIntPipe } from '../common/pipes/must-int.pipe';
import { ShouldIntPipe } from '../common/pipes/should-int.pipe';
import { ParsePagePipe } from '../common/pipes/parse-page.pipe';

@Controller()
export class CommentController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly commentService: CommentService,
    ) {}

    @Get('/api/v1/comments/likes/:articleID')
    async likes(@CurUser() user, @Param('articleID', MustIntPipe) articleID: number) {
        const likes = await this.commentService.userLikesInArticle(articleID, user.id);
        return { likes };
    }

    @Get('/api/v1/comments/:articleID')
    async comments(@Param('articleID', MustIntPipe) articleID: number,
                   @Query('author', ShouldIntPipe) authorID: number, @Query('page', ParsePagePipe) page: number) {
        return await this.commentService.list(articleID, authorID, true, page);
    }

    @Post('/api/v1/comments')
    @UseGuards(ActiveGuard)
    async create(@CurUser() user, @Body() createCommentDto: CreateCommentDto) {
        if (createCommentDto.parentID) {
            const isExists = await this.commentService.isExist(createCommentDto.parentID, createCommentDto.articleID);
            if (!isExists) {
                throw new MyHttpException({
                    errorCode: ErrorCode.ParamsError.CODE,
                    message: '无效的参数',
                });
            }
        }
        const isArticleExist = await this.articleService.isExist(createCommentDto.articleID);
        if (!isArticleExist) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '无效的articleID',
            });
        }

        const comment = await this.commentService.create(createCommentDto, user.id);

        return {
            comment,
        };
    }

    @Post('/api/v1/comments/:commentID/like')
    @UseGuards(ActiveGuard)
    async like(@CurUser() user, @Param('commentID', MustIntPipe) commentID: number,
               @Query('articleID', MustIntPipe) articleID: number) {
        await this.commentService.like(commentID, user.id, articleID);
        return {
        };
    }

    @Delete('/api/v1/comments/:commentID/like')
    @UseGuards(ActiveGuard)
    async deleteLike(@CurUser() user, @Param('commentID', MustIntPipe) commentID: number) {
        await this.commentService.deleteLike(commentID, user.id);
        return {
        };
    }
}