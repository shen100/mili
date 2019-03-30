import {
    Controller, Post, Body, UseGuards,
} from '@nestjs/common';
import * as _ from 'lodash';
import { ArticleService } from './article.service';
import { ErrorCode } from '../config/constants';
import { MyHttpException } from '../common/exception/my-http.exception';
import { CurUser } from '../common/decorators/user.decorator';
import { ActiveGuard } from '../common/guards/active.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller()
export class CommentController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly commentService: CommentService,
    ) {}

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

        await this.commentService.create(createCommentDto, user.id);

        return {
        };
    }

}