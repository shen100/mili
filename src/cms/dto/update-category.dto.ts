import {
    IsInt,
} from 'class-validator';

import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends CreateCategoryDto {
    @IsInt({
        message: '无效的id',
    })
    readonly id: number;
}