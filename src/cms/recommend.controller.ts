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
    async usersView(@Res() res) {
        res.render('pages/recommendations/users');
    }

    @Get('/api/v1/recommendations/users')
    async users(@CurUser() user, @Query('page', ParsePagePipe) page: number) {
        const result = await this.recommendService.recommendUsersWithRecentUpdate(page, 24);
        if (user) {
            const users = result.list.map(u => u.id);
            const followedUsers = await this.userService.usersFilterByfollowerID(users, user.id);
            const userFollowedMap = {};
            followedUsers.forEach(followedUser => {
                userFollowedMap[followedUser.userID] = true;
            });
            result.list.forEach((userData: any) => {
                userData.isFollowed = !!userFollowedMap[userData.id];
                userData.isSelf = user.id === userData.id;
            });
        }
        return result;
    }
}