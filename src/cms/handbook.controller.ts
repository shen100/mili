import {
    Controller, Post, Body, UseGuards, Get, Query, Param, Delete, Res,
} from '@nestjs/common';
import * as _ from 'lodash';
import { ErrorCode } from '../config/constants';
import { MyHttpException } from '../common/exception/my-http.exception';
import { CurUser } from '../common/decorators/user.decorator';
import { MustIntPipe } from '../common/pipes/must-int.pipe';

@Controller()
export class HandbookController {
    constructor(
    ) {}

    @Get('/handbooks.html')
    async list(@CurUser() user, @Res() res) {
        const data = {
            categories: [
                {
                    name: '前端',
                },
                {
                    name: '后台',
                },
                {
                    name: '移动开发',
                },
                {
                    name: '区块链',
                },
                {
                    name: '通用',
                },
            ],
        };
        res.render('pages/handbook/handbooks.njk', data);
    }
}