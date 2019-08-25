import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BoilingPointTopic } from '../entity/boilingpoint.entity';
import { EditTopicDto } from './dto/edit-topic.dto';

@Injectable()
export class TopicService {
    constructor(
        @InjectRepository(BoilingPointTopic)
        private readonly topicRepository: Repository<BoilingPointTopic>,
    ) {}

    async create(editTopicDto: EditTopicDto) {
        const now = new Date();
        return await this.topicRepository.insert({
            name: editTopicDto.name,
            sequence: editTopicDto.sequence,
            createdAt: now,
            updatedAt: now,
        });
    }

    async basic(id: number): Promise<BoilingPointTopic> {
        return await this.topicRepository.findOne({
            where: {
                id,
            },
        });
    }

    async list() {
        return await this.topicRepository.find({
            order: {
                sequence: 'ASC',
            },
        });
    }

    async update(updateTopicDto: EditTopicDto) {
        return await this.topicRepository.update({
            id: updateTopicDto.id,
        }, {
            name: updateTopicDto.name,
            sequence: updateTopicDto.sequence,
            updatedAt: new Date(),
        });
    }
}