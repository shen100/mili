import {
    Controller, Get, Query,
} from '@nestjs/common';

import { CategoryConstants } from '../config/constants';
import { CategoryService } from './category.service';
import { Category } from 'entity/category.entity';

@Controller()
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) {}

    @Get('/api/v1/categories/hot')
    async hot() {
        const categories: Array<Category> = await this.categoryService.hot();
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