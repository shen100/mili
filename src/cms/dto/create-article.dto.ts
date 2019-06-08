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
    Validator,
    ValidateIf,
    IsUrl,
} from 'class-validator';
import { ArticleContentType } from '../../entity/article.entity';
import { Type } from 'class-transformer';
import { ArticleConstants } from '../../constants/constants';

class CategoryDto {
    @IsInt({
        message: '无效的分类id',
    })
    readonly id: number;
}

class TagDto {
    @IsInt({
        message: '无效的标签id',
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

    // 传了coverURL字段的话，才对coverURL进行检验
    @ValidateIf(obj => {
        return obj && typeof obj.coverURL !== 'undefined';
    })
    @IsUrl({
        protocols: ['https'],
        require_protocol: true,
    })
    readonly coverURL: string;

    @IsEnum(ArticleContentType, {
        message: '无效的内容格式',
    })
    readonly contentType: number;

    @ArrayMinSize(1, {
        message: '请选择分类',
    })
    @ArrayMaxSize(ArticleConstants.MAX_CATEGORY_COUNT, {
        message: '最多只能选择 $constraint1 个分类',
    })
    @IsArray({
        message: '请选择分类',
    })
    @ValidateNested({ each: true })
    @Type(() => CategoryDto)
    readonly categories: CategoryDto[];

    @ArrayMinSize(1, {
        message: '请添加标签',
    })
    @ArrayMaxSize(ArticleConstants.MAX_TAG_COUNT, {
        message: '最多只能添加 $constraint1 个标签',
    })
    @IsArray({
        message: '请添加标签',
    })
    @ValidateNested({ each: true })
    @Type(() => TagDto)
    readonly tags: TagDto[];
}