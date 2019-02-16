import {
    Controller, Post, Body, Req, Put, UseGuards, Get, Query, Param, Render, Res,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { UserService } from '../user/user.service';
import { RedisService } from '../redis/redis.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UserScore } from '../entity/user.entity';
import { ConfigService } from '../config/config.service';
import { ActiveGuard } from '../common/guards/active.guard';
import { CurUser } from '../common/decorators/user.decorator';
import { strToPage } from '../utils/common';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { ErrorCode } from '../config/constants';
import { UploadService } from './upload.service';

@Controller()
export class EditorController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly uploadService: UploadService,
    ) {}

    @Get('/editor/drafts/new')
    @UseGuards(ActiveGuard)
    async createDraft(@CurUser() user, @Query() query, @Res() res) {
        const uploadPolicy = await this.uploadService.requestPolicy();
        if (query.editor === 'rich') {
            res.render('pages/editor/editRichDraft', {
                user,
                uploadPolicy,
            });
            return;
        }
        res.render('pages/editor/editMarkdownDraft', {
            user,
            uploadPolicy,
        });
    }
}