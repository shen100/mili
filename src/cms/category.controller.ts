import {
    Controller, Get, Query, Post, UseGuards, Param, Delete,
} from '@nestjs/common';

import { APIPrefix } from '../constants/constants';
import { CategoryConstants } from '../constants/constants';
import { CategoryService } from './category.service';
import { Category } from '../entity/category.entity';
import { ActiveGuard } from '../core/guards/active.guard';
import { CurUser } from '../core/decorators/user.decorator';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';

@Controller()
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) {}

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

    @Get(`${APIPrefix}/categories`)
    async all() {
        const categories: Array<Category> = await this.categoryService.all();
        return categories;
    }

    @Get('/api/v1/categories/search')
    async search(@Query('name') name: string) {
        if (!name || name.length > CategoryConstants.CATEGORY_MAX_LENGTH) {
            return [];
        }
        name = decodeURIComponent(name);
        const result = await this.categoryService.searchCategories(name, 1, 20);
        return result.list;
    }
}