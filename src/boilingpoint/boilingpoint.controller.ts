import {
    Controller, Get, Res,
} from '@nestjs/common';
import { BoilingPointService } from './boilingpoint.service';

@Controller()
export class BoilingPointController {
    constructor(
        private readonly boilingPointService: BoilingPointService,
    ) {}

    @Get('/boiling.html')
    async recommend(@Res() res) {
    }
}