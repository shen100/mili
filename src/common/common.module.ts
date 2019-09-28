import { Module } from '@nestjs/common';
import { MyLoggerService } from './logger.service';
import { OSSService } from './oss.service';
import { CommonController } from './common.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../entity/image.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Image,
        ]),
    ],
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