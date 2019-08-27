import {
    Controller, Get, Res, Param, UseGuards,
} from '@nestjs/common';
import { OSSService } from './oss.service';
import { APIPrefix } from '../constants/constants';
import { ActiveGuard } from '../core/guards/active.guard';

@Controller()
export class CommonController {
    constructor(
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
}