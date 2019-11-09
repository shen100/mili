import {
    IsString,
    MinLength,
    MaxLength,
    IsUrl,
    ArrayMinSize,
    ArrayMaxSize,
    IsInt,
    IsArray,
} from 'class-validator';
import { TagConstants } from '../../constants/tag';

export class CreateTagDto {
    @MinLength(TagConstants.MIN_TITLE_LENGTH, {
        message: '名称不能为空',
    })
    @MaxLength(TagConstants.MAX_TITLE_LENGTH, {
        message: '名称不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly name: string;

    @IsUrl({
        protocols: ['https'],
        require_protocol: true,
    }, {
        message: '图标不能为空',
    })
    readonly iconURL: string;

    @ArrayMinSize(1, {
        message: '请选择分类',
    })
    @ArrayMaxSize(TagConstants.MAX_CATEGORY_COUNT, {
        message: '最多只能选择 $constraint1 个分类',
    })
    @IsArray({
        message: '请选择分类',
    })
    @IsInt({
        each: true,
        message: '无效的分类',
    })
    readonly categories: number[];
}