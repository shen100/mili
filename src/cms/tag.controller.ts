import {
    Controller, Post, UseGuards, Body,
} from '@nestjs/common';
import { APIPrefix } from '../constants/constants';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { ActiveGuard } from '../core/guards/active.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { Roles } from '../core/decorators/roles.decorator';
import { UserRole } from '../entity/user.entity';

@Controller()
export class TagController {
    constructor(
        private readonly tagService: TagService,
    ) {}

    @Post(`${APIPrefix}/tags`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async create(@Body() createArticleDto: CreateTagDto) {
        await this.tagService.create(createArticleDto);
        return {};
    }
}