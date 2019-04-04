import {
    Controller, Post, Body, UseGuards, Get, Query, Param,
} from '@nestjs/common';
import * as _ from 'lodash';
import { ArticleService } from './article.service';
import { ErrorCode } from '../config/constants';
import { MyHttpException } from '../common/exception/my-http.exception';
import { CurUser } from '../common/decorators/user.decorator';
import { ActiveGuard } from '../common/guards/active.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { strToPage } from '../utils/common';

@Controller()
export class CommentController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly commentService: CommentService,
    ) {}

    @Get('/api/v1/comments/article/:id')
    async comments(@Param('id') id: string, @Query('dateorder') dateorder: string,
                   @Query('author') author: string, @Query('page') pageStr: string) {
        const page: number = strToPage(pageStr);
        const articleID = parseInt(id, 10);
        const dateOrderASC = dateorder !== '1';
        const authorID = parseInt(author, 10);
        if (isNaN(articleID)) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '无效的参数',
            });
        }
        return await this.commentService.list(articleID, authorID, dateOrderASC, page);
    }

    @Post('/api/v1/comments/article')
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

        await this.commentService.create(createCommentDto, user.id);

        return {
        };
    }
}