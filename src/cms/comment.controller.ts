import {
    Controller, Post, UseGuards, Get, Param, Delete, Query,
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
import { APIPrefix } from '../constants/constants';
import { BookService } from './book.service';
import { ChapterComment, BoilingPointComment, ArticleComment } from '../entity/comment.entity';
import { clampNumber } from '../utils/common';

@Controller()
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
    ) {}

    /**
     * 一级评论列表
     */
    @Get(`${APIPrefix}/comments/:source/:sourceID/:lastCommentID?`)
    async comments(@CurUser() user, @Param('source') source: string, @Param('sourceID', MustIntPipe) sourceID: number,
                   @Param('lastCommentID', ShouldIntPipe) lastCommentID: number,
                   @Query('limit', ShouldIntPipe) limit: number) {
        limit = clampNumber(limit, 1, 100);
        const userID: number = user && user.id || undefined;
        const CommentClass = this.getCommentClass(source);
        if (!CommentClass) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '无效的source',
            });
        }
        const comments = await this.commentService.comments(CommentClass, sourceID, lastCommentID, userID, limit);
        return {
            list: comments,
        };
    }

    /**
     * 子评论列表
     */
    @Get(`${APIPrefix}/comments/:source/comment/:commentID/:lastSubCommentID`)
    async subComments(@CurUser() user, @Param('source') source: string, @Param('commentID', MustIntPipe) commentID: number,
                      @Param('lastSubCommentID', MustIntPipe) lastSubCommentID: number,
                      @Query('limit', ShouldIntPipe) limit: number) {
        limit = clampNumber(limit, 1, 100);
        const userID: number = user && user.id || undefined;
        const CommentClass = this.getCommentClass(source);
        if (!CommentClass) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '无效的source',
            });
        }
        const subComments = await this.commentService.subComments(CommentClass, commentID, lastSubCommentID, userID, limit);
        return {
            list: subComments,
        };
    }

    // @Post(`${APIPrefix}/comments`)
    // @UseGuards(ActiveGuard)
    // async create(@CurUser() user, @Query('commentType') commentType: string, @Body() createCommentDto: CreateCommentDto) {
    //     if (!this.isValidCommentType(commentType)) {
    //         throw new MyHttpException({
    //             errorCode: ErrorCode.NotFound.CODE,
    //         });
    //     }
    //     if (createCommentDto.parentID) {
    //         const parentComment = await this.commentService.getParent(commentType, createCommentDto.parentID, ['id', 'articleID', 'rootID']);
    //         if (!parentComment) {
    //             throw new MyHttpException({
    //                 errorCode: ErrorCode.ParamsError.CODE,
    //                 message: '无效的parentID',
    //             });
    //         }
    //         if (createCommentDto.commentTo !== parentComment.articleID) {
    //             throw new MyHttpException({
    //                 errorCode: ErrorCode.ParamsError.CODE,
    //                 message: '无效的articleID',
    //             });
    //         }
    //         if (parentComment.rootID && createCommentDto.rootID !== parentComment.rootID) {
    //             throw new MyHttpException({
    //                 errorCode: ErrorCode.ParamsError.CODE,
    //                 message: '无效的rootID',
    //             });
    //         }
    //         if (!parentComment.rootID && createCommentDto.rootID !== parentComment.id) {
    //             throw new MyHttpException({
    //                 errorCode: ErrorCode.ParamsError.CODE,
    //                 message: '无效的rootID',
    //             });
    //         }
    //     } else {
    //         const { CommentTypeArticle, CommentTypeChapter } = CommentConstants;
    //         let isArticleExist = false;
    //         if (commentType === CommentTypeArticle) {
    //             isArticleExist = await this.articleService.isExist(createCommentDto.commentTo);
    //         } else if (commentType === CommentTypeChapter) {
    //             isArticleExist = await this.bookService.isChapterExist(createCommentDto.commentTo);
    //         }
    //         if (!isArticleExist) {
    //             throw new MyHttpException({
    //                 errorCode: ErrorCode.ParamsError.CODE,
    //                 message: '无效的articleID',
    //             });
    //         }
    //     }
    //     const comment = await this.commentService.create(commentType, createCommentDto, user.id);
    //     return {
    //         comment,
    //     };
    // }

    /**
     * 点赞
     */
    @Post(`${APIPrefix}/comments/:source/comment/:commentID/like`)
    @UseGuards(ActiveGuard)
    async like(@CurUser() user, @Param('source') source: string, @Param('commentID', MustIntPipe) commentID: number) {
        const CommentClass = this.getCommentClass(source);
        if (!CommentClass) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '无效的source',
            });
        }
        await this.commentService.like(CommentClass, commentID, user.id);
        return {};
    }

    /**
     * 取消点赞
     */
    @Delete(`${APIPrefix}/comments/:source/comment/:commentID/like`)
    @UseGuards(ActiveGuard)
    async deleteLike(@CurUser() user, @Param('source') source: string, @Param('commentID', MustIntPipe) commentID: number) {
        const CommentClass = this.getCommentClass(source);
        if (!CommentClass) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '无效的source',
            });
        }
        await this.commentService.deleteLike(CommentClass, commentID, user.id);
        return {};
    }

    // @Delete(`${APIPrefix}/comments/:commentID`)
    // @UseGuards(ActiveGuard)
    // async delete(@CurUser() user, @Query('commentType') commentType: string, @Param('commentID', MustIntPipe) commentID: number) {
    //     if (!this.isValidCommentType(commentType)) {
    //         throw new MyHttpException({
    //             errorCode: ErrorCode.NotFound.CODE,
    //         });
    //     }
    //     await this.commentService.delete(commentType, commentID, user.id);
    //     return {};
    // }

    private getCommentClass(source: string) {
        if (source === 'article') {
            return ArticleComment;
        }
        if (source === 'chapter') {
            return ChapterComment;
        }
        if (source === 'boilingpoint') {
            return BoilingPointComment;
        }
        return null;
    }
}