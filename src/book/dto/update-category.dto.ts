import {
    IsInt,
} from 'class-validator';
import { CreateBookCategoryDto } from './create-bookcategory.dto';

export class UpdateBookCategoryDto extends CreateBookCategoryDto {
    @IsInt({
        message: '无效的id',
    })
    readonly id: number;
}