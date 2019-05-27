import {
    Controller, Get, Res, UseGuards, Query,
} from '@nestjs/common';
import { ActiveGuard } from '../core/guards/active.guard';
import { MessageService } from './message.service';
import { ParsePagePipe } from '../core/pipes/parse-page.pipe';
import { CurUser } from '../core/decorators/user.decorator';
import { recentTime } from '../utils/viewfilter';
import moment = require('moment');

@Controller()
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
    ) {}

    @Get('/message')
    async index(@Res() res) {
        res.render('pages/messages');
    }

    @Get('/api/v1/messages/post')
    @UseGuards(ActiveGuard)
    async postMsgList(@CurUser() user, @Query('page', ParsePagePipe) page: number) {
        const pageSize: number = 20;
        const result = await this.messageService.postMsgList(user.id, 1, pageSize);
        result.list = result.list || [];
        result.list = result.list.map(item => {
            return {
                ...item,
                createdAtRecentLabel: recentTime(item.createdAt, 'YYYY.MM.DD HH:mm'),
                createdAtLabel: moment(item.createdAt).format('YYYY.MM.DD HH:mm'),
            };
        });
        return result;
    }
}