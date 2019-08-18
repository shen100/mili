import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTrack } from '../entity/stats.entity';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { CodeStatsController } from './codestats.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UserTrack])],
    controllers: [
        CodeStatsController,
        StatsController,
    ],
    providers: [StatsService],
})
export class StatsModule {}