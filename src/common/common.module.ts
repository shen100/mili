import { Global, Module } from '@nestjs/common';
import { MyLoggerService } from './logger.service';
import { OSSService } from './oss.service';

@Global()
@Module({
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