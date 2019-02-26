import {
    Controller, Post, Body, UseGuards,
} from '@nestjs/common';
import { ActiveGuard } from '../common/guards/active.guard';
import { CurUser } from '../common/decorators/user.decorator';
import { APIPrefix } from '../config/constants';
import { DraftService } from './draft.service';
import { CreateDraftDto } from './dto/create-draft.dto';

@Controller()
export class DraftController {
    constructor(
        private readonly draftService: DraftService,
    ) {}

    @Post(`${APIPrefix}/drafts`)
    @UseGuards(ActiveGuard)
    async create(@CurUser() user, @Body() createDraftDto: CreateDraftDto) {
        if (!createDraftDto.name && !createDraftDto.content) {
            return {};
        }
        const createResult = await this.draftService.create(createDraftDto, user.id);
        return createResult;
    }
}