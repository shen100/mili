import {
    Controller, Post, Body, Get, Put, Param,
} from '@nestjs/common';
import { AdminAPIPrefix } from '../constants/constants';
import { EditTopicDto } from './dto/edit-topic.dto';
import { TopicService } from './topic.service';
import { MustIntPipe } from '../core/pipes/must-int.pipe';

@Controller()
export class TopicAdminController {
    constructor(
        private readonly topicService: TopicService,
    ) {}

    /**
     * 编辑沸点话题
     */
    @Put(`${AdminAPIPrefix}/boilingpoint/topics/:id`)
    async update(@Body() editTopicDto: EditTopicDto, @Param('id', MustIntPipe) id: number) {
        editTopicDto.id = id;
        await this.topicService.update(editTopicDto);
        return {
        };
    }

    /**
     * 创建沸点话题
     */
    @Post(`${AdminAPIPrefix}/boilingpoint/topics`)
    async create(@Body() editTopicDto: EditTopicDto) {
        await this.topicService.create(editTopicDto);
        return {};
    }
}