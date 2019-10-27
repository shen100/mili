import {
    Controller, Post, Body, UseGuards, Get, Query, Param, Delete,
} from '@nestjs/common';
import * as _ from 'lodash';
import { ArticleService } from './article.service';
import { ErrorCode } from '../constants/error';
import { MyHttpException } from '../core/exception/my-http.exception';
import { CurUser } from '../core/decorators/user.decorator';
import { ActiveGuard } from '../core/guards/active.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { ShouldIntPipe } from '../core/pipes/should-int.pipe';
import { ParsePagePipe } from '../core/pipes/parse-page.pipe';
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
        const { CommentTypeArticle, CommentTypeChapter } = CommentConstants;
        return [CommentTypeArticle, CommentTypeChapter].indexOf(commentType) >= 0;
    }

    @Get(`${APIPrefix}/comments/likes/:articleID`)
    async likes(@CurUser() user, @Query('commentType') commentType: string, @Param('articleID', MustIntPipe) articleID: number) {
        if (!this.isValidCommentType(commentType)) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        const likes = await this.commentService.userLikesInArticle(commentType, articleID, user && user.id);
        return { likes };
    }

    @Get(`${APIPrefix}/comments/article/:articleID`)
    async articleComments(@CurUser() user, @Param('articleID', MustIntPipe) articleID: number) {
        const limit: number = 6;
        const userID: number = user && user.id || undefined;
        const comments = await this.commentService.articleComments(userID, articleID, 0, limit);
        return {
            list: comments,
        };
    }

    @Get(`${APIPrefix}/comments/article/:articleID/:lastCommentID`)
    async articleComments2(@CurUser() user, @Param('articleID', MustIntPipe) articleID: number,
                           @Param('lastCommentID', MustIntPipe) lastCommentID: number) {
        const limit: number = 20;
        const userID: number = user && user.id || undefined;
        const subComments = await this.commentService.articleComments(userID, articleID, lastCommentID, limit);
        return {
            list: subComments,
        };
    }

    @Get(`${APIPrefix}/comments/article/comment/:commentID/:lastSubCommentID`)
    async subComments(@CurUser() user, @Param('commentID', MustIntPipe) commentID: number,
                      @Param('lastSubCommentID', MustIntPipe) lastSubCommentID: number) {
        const limit: number = 5;
        const userID: number = user && user.id || undefined;
        const subComments = await this.commentService.articleSubComments(userID, commentID, lastSubCommentID, limit);
        return {
            list: subComments,
        };
    }

    @Post(`${APIPrefix}/comments`)
    @UseGuards(ActiveGuard)
    async create(@CurUser() user, @Query('commentType') commentType: string, @Body() createCommentDto: CreateCommentDto) {
        if (!this.isValidCommentType(commentType)) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (createCommentDto.parentID) {
            const parentComment = await this.commentService.getParent(commentType, createCommentDto.parentID, ['id', 'articleID', 'rootID']);
            if (!parentComment) {
                throw new MyHttpException({
                    errorCode: ErrorCode.ParamsError.CODE,
                    message: '无效的parentID',
                });
            }
            if (createCommentDto.commentTo !== parentComment.articleID) {
                throw new MyHttpException({
                    errorCode: ErrorCode.ParamsError.CODE,
                    message: '无效的articleID',
                });
            }
            if (parentComment.rootID && createCommentDto.rootID !== parentComment.rootID) {
                throw new MyHttpException({
                    errorCode: ErrorCode.ParamsError.CODE,
                    message: '无效的rootID',
                });
            }
            if (!parentComment.rootID && createCommentDto.rootID !== parentComment.id) {
                throw new MyHttpException({
                    errorCode: ErrorCode.ParamsError.CODE,
                    message: '无效的rootID',
                });
            }
        } else {
            const { CommentTypeArticle, CommentTypeChapter } = CommentConstants;
            let isArticleExist = false;
            if (commentType === CommentTypeArticle) {
                isArticleExist = await this.articleService.isExist(createCommentDto.commentTo);
            } else if (commentType === CommentTypeChapter) {
                isArticleExist = await this.bookService.isChapterExist(createCommentDto.commentTo);
            }
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

    @Delete(`${APIPrefix}/comments/:commentID`)
    @UseGuards(ActiveGuard)
    async delete(@CurUser() user, @Query('commentType') commentType: string, @Param('commentID', MustIntPipe) commentID: number) {
        if (!this.isValidCommentType(commentType)) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        await this.commentService.delete(commentType, commentID, user.id);
        return {};
    }

    @Post(`${APIPrefix}/comments/:commentID/like`)
    @UseGuards(ActiveGuard)
    async like(@CurUser() user, @Query('commentType') commentType: string, @Param('commentID', MustIntPipe) commentID: number) {
        if (!this.isValidCommentType(commentType)) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        await this.commentService.like(commentType, commentID, user.id);
        return {};
    }

    @Delete(`${APIPrefix}/comments/:commentID/like`)
    @UseGuards(ActiveGuard)
    async deleteLike(@CurUser() user, @Query('commentType') commentType: string, @Param('commentID', MustIntPipe) commentID: number) {
        if (!this.isValidCommentType(commentType)) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        await this.commentService.deleteLike(commentType, commentID, user.id);
        return {};
    }
}