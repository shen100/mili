import {
    Controller, Post, Body, Get,
} from '@nestjs/common';
import { AdminAPIPrefix } from '../constants/constants';
import { CreateTopicDto } from './dto/create-topic.dto';
import { TopicService } from './topic.service';

@Controller()
export class TopicController {
    constructor(
        private readonly topicService: TopicService,
    ) {}

    @Post(`${AdminAPIPrefix}/boilingpoint/topics`)
    async create(@Body() createTopicDto: CreateTopicDto) {
        await this.topicService.create(createTopicDto);
        return {};
    }

    @Get(`${AdminAPIPrefix}/boilingpoint/topics`)
    async list() {
        const topics = await this.topicService.list();
        return {
            topics,
        };
    }
}