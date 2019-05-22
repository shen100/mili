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
        const { CommentTypeArticle, CommentTypeChapter } = CommentConstants;
        return [CommentTypeArticle, CommentTypeChapter].indexOf(commentType) >= 0;
    }

    @Get(`${APIPrefix}/comments/likes/:articleID`)
    async likes(@CurUser() user, @Param('articleID', MustIntPipe) articleID: number) {
        const likes = await this.commentService.userLikesInArticle(articleID, user.id);
        return { likes };
    }

    @Get(`${APIPrefix}/comments/:articleID`)
    async comments(@Param('articleID', MustIntPipe) articleID: number,
                   @Query('commentType') commentType: string,
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
            if (createCommentDto.articleID !== parentComment.articleID) {
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
                isArticleExist = await this.articleService.isExist(createCommentDto.articleID);
            } else if (commentType === CommentTypeChapter) {
                isArticleExist = await this.bookService.isChapterExist(createCommentDto.articleID);
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