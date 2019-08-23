import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    BoilingPoint,
    BoilingPointTopic,
} from '../entity/boilingpoint.entity';
import { UserModule } from '../user/user.module';
import { BoilingPointController } from './boilingpoint.controller';
import { BoilingPointService } from './boilingpoint.service';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            BoilingPoint,
            BoilingPointTopic,
        ]),
        UserModule,
    ],
    controllers: [
        BoilingPointController,
        TopicController,
    ],
    providers: [
        BoilingPointService,
        TopicService,
    ],
})
export class BoilingPointModule {}