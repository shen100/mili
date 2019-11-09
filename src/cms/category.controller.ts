import {
    Controller, Get, Query, Post, UseGuards, Param, Delete, Body, Put,
} from '@nestjs/common';

import { APIPrefix, AdminAPIPrefix } from '../constants/constants';
import { CategoryService } from './category.service';
import { Category } from '../entity/category.entity';
import { ActiveGuard } from '../core/guards/active.guard';
import { CurUser } from '../core/decorators/user.decorator';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import { RolesGuard } from '../core/guards/roles.guard';
import { Roles } from '../core/decorators/roles.decorator';
import { UserRole } from '../entity/user.entity';
import { CategoryConstants } from '../constants/category';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RedisService, cacheKeys } from '../redis/redis.service';

@Controller()
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly redisService: RedisService,
    ) {}

    @Get(`${APIPrefix}/categories`)
    async all() {
        const categories: Array<Category> = await this.categoryService.all();
        return categories;
    }

    @Get('/api/v1/categories/search')
    async search(@Query('name') name: string) {
        if (!name || name.length > CategoryConstants.MAX_TITLE_LENGTH) {
            return [];
        }
        name = decodeURIComponent(name);
        const result = await this.categoryService.searchCategories(name, 1, 20);
        return result.list;
    }

    @Post(`${AdminAPIPrefix}/categories`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        const createResult = await this.categoryService.create(createCategoryDto);
        await this.redisService.delCache(cacheKeys.categories);
        return {
            id: createResult.id,
        };
    }

    @Post('/api/v1/categories/:id/follow')
    @UseGuards(ActiveGuard)
    async follow(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        const categoryExists: boolean = await this.categoryService.isExists(id);
        if (!categoryExists) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        await this.categoryService.addFollower(id, user.id);
        return {};
    }

    @Put(`${AdminAPIPrefix}/categories/:id`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
    async update(@Body() updateCategoryDto: UpdateCategoryDto) {
        await this.categoryService.update(updateCategoryDto);
        await this.redisService.delCache(cacheKeys.categories);
        return {};
    }

    @Delete('/api/v1/categories/:id/follow')
    @UseGuards(ActiveGuard)
    async cancelFollow(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        const categoryExists: boolean = await this.categoryService.isExists(id);
        if (!categoryExists) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        await this.categoryService.removeFollower(id, user.id);
        return {};
    }
}