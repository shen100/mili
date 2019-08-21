import {
    Controller,
    Put,
    UseGuards,
    Param,
} from '@nestjs/common';

import { RolesGuard } from '../core/guards/roles.guard';
import { Roles } from '../core/decorators/roles.decorator';
import { UserRole } from '../entity/user.entity';
import { ActiveGuard } from '../core/guards/active.guard';
import { ArticleService } from '../cms/article.service';
import { AdminAPIPrefix } from '../constants/constants';

@Controller()
@Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
@UseGuards(ActiveGuard, RolesGuard)
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService,
    ) {}

    @Put(`${AdminAPIPrefix}/articles/allverifyfail/:userID`)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async allVerifyFail(@Param('userID') userID: number) {
        await Promise.all([
            this.articleService.allVerifyFail(userID),
        ]);
        return {
        };
    }
}