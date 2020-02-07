import {
    Controller,
    UseGuards,
    Get,
    Res,
    Req,
} from '@nestjs/common';
import { ActiveGuard } from '../core/guards/active.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { UserRole } from '../entity/user.entity';
import { AdminPageURL } from '../constants/constants';
import { Roles } from '../core/decorators/roles.decorator';
import { MyLoggerService } from '../common/logger.service';

@Controller()
export class IndexController {
    constructor(
        private readonly logger: MyLoggerService,
    ) {}

    @Get(`${AdminPageURL}/*`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async adminIndex(@Req() req, @Res() res) {
        this.logger.info({
            data: {
                middleware: 'adminIndex',
                ip: req.clientIp,
            },
        });
        res.render('pages/admin/app', {
            adminPageURL: AdminPageURL,
        });
    }
}