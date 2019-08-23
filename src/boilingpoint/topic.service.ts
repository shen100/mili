import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BoilingPointTopic } from '../entity/boilingpoint.entity';
import { CreateTopicDto } from './dto/create-topic.dto';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(BoilingPointTopic)
        private readonly topicRepository: Repository<BoilingPointTopic>,
    ) {}

    async create(createTopicDto: CreateTopicDto) {
        const now = new Date();
        return await this.topicRepository.insert({
            name: createTopicDto.name,
            sequence: createTopicDto.sequence,
            createdAt: now,
            updatedAt: now,
        });
    }

    async list() {
        return await this.topicRepository.find({
            order: {
                sequence: 'ASC',
            },
        });
    }
}