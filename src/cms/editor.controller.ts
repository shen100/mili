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

@Controller()
export class EditorController {
    constructor(
        private readonly articleService: ArticleService,
    ) {}

    @Get('/editor/drafts/new')
    @UseGuards(ActiveGuard)
    async createDraft(@CurUser() user, @Res() res) {
        res.render('pages/editor/createDraft', {
            user,
        });
    }
}