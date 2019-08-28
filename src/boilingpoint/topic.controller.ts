import {
    Controller, Get,
} from '@nestjs/common';
import { APIPrefix } from '../constants/constants';
import { TopicService } from './topic.service';

@Controller()
export class TopicController {
    constructor(
        private readonly topicService: TopicService,
    ) {}

    @Get(`${APIPrefix}/boilingpoint/topics`)
    async list() {
        const topics = await this.topicService.list();
        return {
            topics,
        };
    }
}