import {
    IsString,
    MinLength,
    MaxLength,
    ValidateIf,
} from 'class-validator';
import { BookConstants } from '../../constants/book';
import { ArticleConstants } from '../../constants/article';

export class UpdateBookChapterDto {
    // 传了 name 字段的话，才对 name 进行检验
    @ValidateIf(obj => {
        return obj && typeof obj.name !== 'undefined';
    })
    @MinLength(1, {
        message: '章节名称不能为空',
    })
    @MaxLength(BookConstants.MAX_CHAPTER_TITLE_LENGTH, {
        message: '章节名称不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly name: string;

    // 传了 content 字段的话，才对 content 进行检验
    @ValidateIf(obj => {
        return obj && typeof obj.content !== 'undefined';
    })
    @MinLength(1, {
        message: '内容不能为空',
    })
    @MaxLength(ArticleConstants.CONTENT_MAX_LENGTH, {
        message: '内容不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly content: string;

    // 传了 htmlContent 字段的话，才对 htmlContent 进行检验
    @ValidateIf(obj => {
        return obj && typeof obj.htmlContent !== 'undefined';
    })
    @MinLength(1, {
        message: '内容不能为空',
    })
    @MaxLength(ArticleConstants.HTML_CONTENT_MAX_LENGTH, {
        message: '内容不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly htmlContent: string;
}