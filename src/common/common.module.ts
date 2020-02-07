import { Module } from '@nestjs/common';
import { OSSService } from './oss.service';
import { CommonController } from './common.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../entity/image.entity';
import { MyLoggerService } from './logger.service';

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