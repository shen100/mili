import {
    Controller,
    UseGuards,
    Get,
    Res,
} from '@nestjs/common';
import { ActiveGuard } from '../core/guards/active.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { UserRole } from '../entity/user.entity';
import { AdminPageURL } from '../constants/constants';
import { Roles } from '../core/decorators/roles.decorator';

@Controller()
// @UseGuards(ActiveGuard, RolesGuard)
export class IndexController {
    constructor(
    ) {}

    @Get(`${AdminPageURL}`)
    // @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async adminIndex(@Res() res) {
        res.render('pages/admin/app');
    }
}