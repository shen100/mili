import * as _ from 'lodash';
import * as marked from 'marked';
import * as moment from 'moment';
import * as striptags from 'striptags';
import { Injectable } from '@nestjs/common';
import { Repository, Not, Like, In } from 'typeorm';
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
        return await this.topicRepository.create({
            name: createTopicDto.name,
            order: createTopicDto.order,
        });
    }

    async list() {
        return await this.topicRepository.find({
            order: {
                order: 'ASC',
            },
        });
    }
}