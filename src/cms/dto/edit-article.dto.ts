import {
    IsString,
    IsInt,
    MinLength,
    MaxLength,
    IsEnum,
    IsArray,
    ArrayMinSize,
    ArrayMaxSize,
    ValidateIf,
    IsUrl,
} from 'class-validator';
import { ArticleContentType } from '../../entity/article.entity';
import { ArticleConstants } from '../../constants/article';

export class EditArticleDto {
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
    @MaxLength(ArticleConstants.CONTENT_MAX_LENGTH, {
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
        message: '请添加标签',
    })
    @ArrayMaxSize(ArticleConstants.MAX_TAG_COUNT, {
        message: '最多只能添加 $constraint1 个标签',
    })
    @IsArray({
        message: '请添加标签',
    })
    @IsInt({
        each: true,
    })
    readonly tags: number[];
}