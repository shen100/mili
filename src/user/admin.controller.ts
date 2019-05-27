import {
    Controller,
    Put,
    Body,
    UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { ConfigService } from '../config/config.service';
import { UpdateUserStatusDto } from './dto/update-userstatus.dto';
import * as util from 'util';
import { RolesGuard } from '../core/guards/roles.guard';
import { Roles } from '../core/decorators/roles.decorator';
import { UserRole, User } from '../entity/user.entity';
import { RedisService } from '../redis/redis.service';
import { ActiveGuard } from '../core/guards/active.guard';
import { CurUser } from '../core/decorators/user.decorator';

@Controller('admin/users')
@UseGuards(ActiveGuard, RolesGuard)
export class AdminController {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) {}

    @Put('status')
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async updateStatus(@CurUser() user: User, @Body() updateUserStatusDto: UpdateUserStatusDto) {
        const userID = updateUserStatusDto.userID;
        const status = updateUserStatusDto.status;
        const cacheKey = util.format(this.redisService.cacheKeys.user, userID);
        await Promise.all([
            this.userService.updateStatus(userID, status, user.role),
            this.redisService.delCache(cacheKey),
        ]);
        return {};
    }
}