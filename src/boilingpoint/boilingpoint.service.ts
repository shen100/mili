import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BoilingPoint } from '../entity/boilingpoint.entity';
import { EditBoilingPointDto } from './dto/edit-boilingpoint.dto';
import { ListResult } from '../entity/listresult.entity';

@Injectable()
export class BoilingPointService {
    constructor(
        @InjectRepository(BoilingPoint)
        private readonly boilingPointRepository: Repository<BoilingPoint>,
    ) {}

    async listByTopic(topicID: number, page: number): Promise<ListResult<BoilingPoint>> {
        const pageSize = 20;
        const [list, count] = await this.boilingPointRepository.findAndCount({
            where: {
                topicID,
            },
            order: {
                createdAt: 'DESC',
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return {
            list,
            count,
            page,
            pageSize,
        };
    }

    async create(editBoilingPointDto: EditBoilingPointDto, userID: number) {
        const now = new Date();
        return await this.boilingPointRepository.insert({
            htmlContent: editBoilingPointDto.htmlContent,
            imgs: editBoilingPointDto.imgs && editBoilingPointDto.imgs.length ? editBoilingPointDto.imgs.join(',') : '',
            createdAt: now,
            commentCount: 0,
            browseCount: 0,
            userID,
        });
    }
}
