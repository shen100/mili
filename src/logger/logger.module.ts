import { Global, Module } from '@nestjs/common';
import { MyLoggerService } from './logger.service';

@Global()
@Module({
    providers: [ MyLoggerService ],
    exports: [ MyLoggerService ],
})
export class LoggerModule {}