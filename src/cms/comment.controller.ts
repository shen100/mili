import {
    Controller, Post, UseGuards, Get, Param, Delete, Query, Body,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ErrorCode } from '../constants/error';
import { MyHttpException } from '../core/exception/my-http.exception';
import { CurUser } from '../core/decorators/user.decorator';
import { ActiveGuard } from '../core/guards/active.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { ShouldIntPipe } from '../core/pipes/should-int.pipe';
import { APIPrefix } from '../constants/constants';
import { BookService } from './book.service';
import { BookChapterComment, BoilingPointComment, ArticleComment } from '../entity/comment.entity';
import { clampNumber } from '../utils/common';
import { BoilingPointService } from '../boilingpoint/boilingpoint.service';
import { CommentConstants } from '../constants/comment';

const {
    SourceArticle,
    SourceBookChapter,
    SourceBoilingPoint,
} = CommentConstants;

@Controller()
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
        private readonly articleService: ArticleService,
        private readonly bookService: BookService,
        private readonly boilingPointService: BoilingPointService,
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

    /**
     * 创建评论
     */
    @Post(`${APIPrefix}/comments/:source`)
    @UseGuards(ActiveGuard)
    async create(@CurUser() user, @Param('source') source: string, @Body() createCommentDto: CreateCommentDto) {
        if (!this.isValidSource(source)) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        const CommentClass = this.getCommentClass(source);
        let isSourceExistPromise: Promise<boolean>;
        if (source === SourceArticle) {
            isSourceExistPromise = this.articleService.isExist(createCommentDto.sourceID);
        } else if (source === SourceBoilingPoint) {
            isSourceExistPromise = this.boilingPointService.isExist(createCommentDto.sourceID);
        } else if (source === SourceBookChapter) {
            isSourceExistPromise = this.bookService.isChapterExist(createCommentDto.sourceID);
        }

        const [isSourceExist, parent] = await Promise.all([
            isSourceExistPromise,
            createCommentDto.parentID ? this.commentService.getParent(CommentClass, createCommentDto.parentID) : Promise.resolve(null),
        ]);

        if (!isSourceExist) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '无效的sourceID',
            });
        }

        if (createCommentDto.parentID) {
            if (!parent) {
                throw new MyHttpException({
                    errorCode: ErrorCode.ParamsError.CODE,
                    message: '无效的parentID',
                });
            }
            if (createCommentDto.sourceID !== parent.sourceID) {
                throw new MyHttpException({
                    errorCode: ErrorCode.ParamsError.CODE,
                    message: '无效的sourceID',
                });
            }
            if (parent.rootID && createCommentDto.rootID !== parent.rootID) {
                throw new MyHttpException({
                    errorCode: ErrorCode.ParamsError.CODE,
                    message: '无效的rootID',
                });
            }
            if (!parent.rootID && createCommentDto.rootID !== parent.id) {
                throw new MyHttpException({
                    errorCode: ErrorCode.ParamsError.CODE,
                    message: '无效的rootID',
                });
            }
        }

        const comment = await this.commentService.create(CommentClass, createCommentDto, user.id);
        return {
            comment,
        };
    }

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

    /**
     * 是否是有效的评论源
     */
    private isValidSource(source: string) {
        if ([SourceArticle, SourceBookChapter, SourceBoilingPoint].indexOf(source) >= 0) {
            return true;
        }
        return false;
    }

    /**
     * 得到评论实体类
     */
    private getCommentClass(source: string) {
        if (source === SourceArticle) {
            return ArticleComment;
        }
        if (source === SourceBookChapter) {
            return BookChapterComment;
        }
        if (source === SourceBoilingPoint) {
            return BoilingPointComment;
        }
        return null;
    }
}