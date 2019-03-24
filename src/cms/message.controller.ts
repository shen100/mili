import {
    Controller, Get, Res, UseGuards, Query,
} from '@nestjs/common';
import { ActiveGuard } from '../common/guards/active.guard';
import { MessageService } from './message.service';
import { ParsePagePipe } from '../common/pipes/parse-page.pipe';
import { CurUser } from '../common/decorators/user.decorator';

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
        return await this.messageService.postMsgList(user.id, 1, pageSize);
    }
}