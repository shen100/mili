import {
    Controller,
    Put,
    UseGuards,
    Param,
} from '@nestjs/common';

import { ConfigService } from '../config/config.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../entity/user.entity';
import { RedisService } from '../redis/redis.service';
import { ActiveGuard } from '../common/guards/active.guard';
import { ArticleService } from '../cms/article.service';

@Controller('admin/articles')
@UseGuards(ActiveGuard, RolesGuard)
export class AdminController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) {}

    @Put('allverifyfail/:userID')
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async allVerifyFail(@Param('userID') userID: number) {
        await Promise.all([
            this.articleService.allVerifyFail(userID),
        ]);
        return {
        };
    }
}