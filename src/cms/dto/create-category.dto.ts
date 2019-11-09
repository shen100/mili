import {
    IsString,
    MinLength,
    MaxLength,
    IsInt,
} from 'class-validator';
import { CategoryConstants } from '../../constants/category';

export class CreateCategoryDto {
    @MinLength(1, {
        message: '名称不能为空',
    })
    @MaxLength(CategoryConstants.MAX_TITLE_LENGTH, {
        message: '名称不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly name: string;

    @IsInt({
        message: '无效的顺序',
    })
    readonly sequence: number;

    @MinLength(1, {
        message: '路径不能为空',
    })
    @MaxLength(CategoryConstants.MAX_PATHNAME_LENGTH, {
        message: '路径不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly pathname: string;
}