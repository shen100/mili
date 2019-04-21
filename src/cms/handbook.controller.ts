import {
    Controller, Post, Body, UseGuards, Get, Query, Param, Delete, Res,
} from '@nestjs/common';
import * as _ from 'lodash';
import { ErrorCode } from '../config/constants';
import { MyHttpException } from '../common/exception/my-http.exception';
import { CurUser } from '../common/decorators/user.decorator';
import { MustIntPipe } from '../common/pipes/must-int.pipe';
import { ConfigService } from '../config/config.service';

@Controller()
export class HandbookController {
    constructor(
        private readonly configService: ConfigService,
    ) {}

    @Get('/handbooks')
    async list(@CurUser() user, @Res() res) {
        const data = {
            icp: this.configService.server.icp,
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
            handbooks: [
                {},
                {},
                {},
                {},
            ],
        };
        res.render('pages/handbook/handbooks.njk', data);
    }

    @Get('/handbooks/:id.html')
    async detail(@CurUser() user, @Res() res) {
        res.render('pages/handbook/handbookDetail.njk', {
            handbooks: [
                {},
                {},
                {},
                {},
            ],
        });
    }
}