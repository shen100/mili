import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BoilingPoint } from '../entity/boilingpoint.entity';
import { EditBoilingPointDto } from './dto/edit-boilingpoint.dto';

@Injectable()
export class BoilingPointService {
    constructor(
        @InjectRepository(BoilingPoint)
        private readonly boilingPointRepository: Repository<BoilingPoint>,
    ) {}

    async list(topicID: number) {
        return await this.boilingPointRepository.find({
            where: {
                topicID,
            },
        });
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
