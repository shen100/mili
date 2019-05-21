import {
    Controller, Post, Body, UseGuards, Get, Query, Param, Delete,
} from '@nestjs/common';
import * as _ from 'lodash';
import { ArticleService } from './article.service';
import { ErrorCode } from '../constants/error';
import { MyHttpException } from '../common/exception/my-http.exception';
import { CurUser } from '../common/decorators/user.decorator';
import { ActiveGuard } from '../common/guards/active.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { MustIntPipe } from '../common/pipes/must-int.pipe';
import { ShouldIntPipe } from '../common/pipes/should-int.pipe';
import { ParsePagePipe } from '../common/pipes/parse-page.pipe';
import { APIPrefix, CommentConstants } from '../constants/constants';
import { BookService } from './book.service';

@Controller()
export class CommentController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly bookService: BookService,
        private readonly commentService: CommentService,
    ) {}

    private isValidCommentType(commentType: string) {
        const { CommentTypeNormal, CommentTypeChapter } = CommentConstants;
        return [CommentTypeNormal, CommentTypeChapter].indexOf(commentType) >= 0;
    }

    @Get(`${APIPrefix}/comments/likes/:articleID`)
    async likes(@CurUser() user, @Param('articleID', MustIntPipe) articleID: number) {
        const likes = await this.commentService.userLikesInArticle(articleID, user.id);
        return { likes };
    }

    @Get(`${APIPrefix}/:commentType/:articleID`)
    async comments(@Param('commentType') commentType: string,
                   @Param('articleID', MustIntPipe) articleID: number,
                   @Query('author', ShouldIntPipe) authorID: number,
                   @Query('page', ParsePagePipe) page: number) {
        if (!this.isValidCommentType(commentType)) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        return await this.commentService.list(commentType, articleID, {
            authorID,
            dateASC: true,
            page,
            pageSize: 20,
        });
    }

    @Post(`${APIPrefix}/:commentType`)
    @UseGuards(ActiveGuard)
    async create(@CurUser() user, @Param('commentType') commentType: string, @Body() createCommentDto: CreateCommentDto) {
        if (!this.isValidCommentType(commentType)) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (createCommentDto.parentID) {
            const isExists = await this.commentService.isExist(commentType, createCommentDto.parentID, createCommentDto.articleID);
            if (!isExists) {
                throw new MyHttpException({
                    errorCode: ErrorCode.ParamsError.CODE,
                    message: '无效的参数',
                });
            }
        } else {
            const { CommentTypeNormal, CommentTypeChapter } = CommentConstants;
            const isExist = {
                [CommentTypeNormal]: this.articleService.isExist,
                [CommentTypeChapter]: this.bookService.isChapterExist,
            };
            const isArticleExist = await isExist[commentType](createCommentDto.articleID);
            if (!isArticleExist) {
                throw new MyHttpException({
                    errorCode: ErrorCode.ParamsError.CODE,
                    message: '无效的articleID',
                });
            }
        }

        const comment = await this.commentService.create(commentType, createCommentDto, user.id);

        return {
            comment,
        };
    }

    @Delete('/api/v1/comments/:commentID')
    @UseGuards(ActiveGuard)
    async delete(@CurUser() user, @Param('commentID', MustIntPipe) commentID: number) {
        await this.commentService.delete(commentID, user.id);
        return {
        };
    }

    @Post('/api/v1/comments/:commentID/like')
    @UseGuards(ActiveGuard)
    async like(@CurUser() user, @Param('commentID', MustIntPipe) commentID: number) {
        await this.commentService.like(commentID, user.id);
        return {};
    }

    @Delete('/api/v1/comments/:commentID/like')
    @UseGuards(ActiveGuard)
    async deleteLike(@CurUser() user, @Param('commentID', MustIntPipe) commentID: number) {
        await this.commentService.deleteLike(commentID, user.id);
        return {};
    }
}