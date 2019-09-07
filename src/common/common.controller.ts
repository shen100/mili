import {
    Controller, Get, UseGuards, Post, Body, Req, Query,
} from '@nestjs/common';
import { OSSService } from './oss.service';
import { APIPrefix } from '../constants/constants';
import { ActiveGuard } from '../core/guards/active.guard';
import { ConfigService } from '../config/config.service';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import { Image } from '../entity/image.entity';

@Controller()
export class CommonController {
    constructor(
        private readonly configService: ConfigService,
        private readonly ossService: OSSService,
    ) {}

    @Get(`${APIPrefix}/common/oss/policy`)
    @UseGuards(ActiveGuard)
    async ossPolicy() {
        const uploadPolicy = await this.ossService.requestPolicy();
        return {
            uploadPolicy,
        };
    }

    @Post(`${APIPrefix}/common/oss/callback`)
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

    @Post(`${APIPrefix}/common/oss/createimg`)
    async createimg(@Body('path') path: string) {
        if (this.configService.env !== this.configService.DEVELOPMENT) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (!path) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        const imgData = await this.ossService.getImageInfo(path);
        if (!imgData) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        const img: Image = await this.ossService.createImage({
            ...imgData,
            url: this.configService.static.uploadImgURL + imgData.url,
        });
        return img;
    }
}