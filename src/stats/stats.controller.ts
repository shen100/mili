import * as _ from 'lodash';
import {
    Controller, Req, Query, Get,
} from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {

    constructor(
        private readonly statsService: StatsService,
    ) {}

    @Get('usertrack')
    async userTrack(@Req() req, @Query() query: any) {
        const data = _.pick(query, ['platform', 'clientID', 'osName', 'osVersion',
            'language', 'country', 'deviceModel', 'deviceWidth', 'deviceHeight',
            'referrer', 'url', 'browserName', 'browserVersion', 'ip', 'ua',
        ]);
        data.ip = req.ip;
        await this.statsService.userTrack(data);
        return {};
    }
}