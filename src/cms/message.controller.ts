import {
    Controller, Get, Res,
} from '@nestjs/common';

@Controller()
export class MessageController {
    constructor(
    ) {}

    @Get('/message')
    async index(@Res() res) {
        res.render('pages/messages');
    }
}