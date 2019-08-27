import { Global, Module } from '@nestjs/common';
import { MyLoggerService } from './logger.service';
import { OSSService } from './oss.service';
import { CommonController } from './common.controller';

@Module({
    controllers: [
        CommonController,
    ],
    providers: [
        MyLoggerService,
        OSSService,
    ],
    exports: [
        MyLoggerService,
        OSSService,
    ],
})
export class CommonModule {}