import {
    IsString,
    IsInt,
    MinLength,
    MaxLength,
    IsEnum,
    IsArray,
    ArrayMinSize,
    ArrayMaxSize,
    ValidateNested,
} from 'class-validator';
import { ArticleContentType } from '../../entity/article.entity';
import { Type } from 'class-transformer';

export class CategoryDto {
    @IsInt({
        message: '无效的分类id',
    })
    readonly id: number;
}

export class CreateArticleDto {
    @MinLength(1, {
        message: '名称不能为空',
    })
    @MaxLength(100, {
        message: '名称不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly name: string;

    @MinLength(4, {
        message: '文章内容过少，请认真请写',
    })
    @MaxLength(10000, {
        message: '内容不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly content: string;

    @IsEnum(ArticleContentType, {
        message: '无效的内容格式',
    })
    readonly contentType: number;

    @ArrayMinSize(1, {
        message: '请选择分类',
    })
    @ArrayMaxSize(5, {
        message: '最多只能选择 $constraint1 个分类',
    })
    @IsArray({
        message: '请选择分类',
    })
    @ValidateNested({ each: true })
    @Type(() => CategoryDto)
    readonly categories: CategoryDto[];
}