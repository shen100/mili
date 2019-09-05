import {
    Controller, Get, UseGuards, Post, Body, Req,
} from '@nestjs/common';
import { OSSService } from './oss.service';
import { APIPrefix } from '../constants/constants';
import { ActiveGuard } from '../core/guards/active.guard';
import { ConfigService } from '../config/config.service';

@Controller()
export class CommonController {
    constructor(
        private readonly configService: ConfigService,
        private readonly ossService: OSSService,
    ) {}

    @Get(`${APIPrefix}/common/osspolicy`)
    @UseGuards(ActiveGuard)
    async ossPolicy() {
        const uploadPolicy = await this.ossService.requestPolicy();
        return {
            uploadPolicy,
        };
    }

    @Post(`${APIPrefix}/common/osscallback`)
    async ossCallback(@Body() body, @Req() req) {
        if (body['callback-token'] !== this.configService.aliyunOSS.callbackSecretToken) {
            return {
                Status: 'verdify not ok',
            };
        }
        console.log(JSON.stringify(body));
        return {
            Status: 'OK',
        };
    }
}