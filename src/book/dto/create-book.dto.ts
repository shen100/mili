import {
    MaxLength, IsString, MinLength, IsEnum, IsUrl,
} from 'class-validator';
import { BookConstants } from '../../constants/book';
import { ArticleContentType } from '../../entity/article.entity';

export class CreateBookDto {
    @MinLength(1, {
        message: '名称不能为空',
    })
    @MaxLength(BookConstants.MAX_TITLE_LENGTH, {
        message: '名称不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly name: string;

    @MinLength(1, {
        message: '摘要不能为空',
    })
    @MaxLength(BookConstants.MAX_SUMMARY_LENGTH, {
        message: '摘要不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly summary: string;

    @IsEnum(ArticleContentType, {
        message: '无效的内容格式',
    })
    readonly contentType: number;

    @IsUrl({
        protocols: ['https'],
        require_protocol: true,
    }, {
        message: '封面图片不能为空',
    })
    readonly coverURL: string;
}