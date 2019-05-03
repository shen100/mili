import {
    Controller, Get, Res, Query,
} from '@nestjs/common';
import { RecommendService } from './recommend.service';
import { ParsePagePipe } from '../common/pipes/parse-page.pipe';
import { CurUser } from '../common/decorators/user.decorator';
import { UserService } from '../user/user.service';

@Controller()
export class RecommendController {
    constructor(
        private readonly recommendService: RecommendService,
        private readonly userService: UserService,
    ) {}

    @Get('/recommendations/users')
    async users(@Res() res) {
        res.render('pages/recommendations/users');
    }

    @Get('/api/v1/recommendations/users')
    async likes(@CurUser() user, @Query('page', ParsePagePipe) page: number) {
        const result = await this.recommendService.recommendUsersWithRecentUpdate(page, 24);

        result.list.forEach((userData: any) => {
            userData.isSelf = false;
        });
        if (user) {
            const users = result.list.map(u => u.id);
            const followedUsers = await this.userService.findUsersFilterByfollowerID(user.id, users);
            const userMap = {};
            followedUsers.forEach(followedUser => {
                userMap[followedUser.userID] = true;
            });
            result.list.forEach((userData: any) => {
                userData.isFollowed = !!userMap[userData.id];
                userData.isSelf = user.id === userData.id;
            });
        }
        return result;
    }
}