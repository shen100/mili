import {
    IsString,
    IsInt,
    MinLength,
    MaxLength,
    IsEnum,
    ValidateIf,
} from 'class-validator';
import { ArticleContentType } from '../../entity/article.entity';

export class CreateCommentDto {
    @IsInt({
        message: '无效的articleID',
    })
    readonly articleID: number;

    @ValidateIf(o => o.parentID !== undefined)
    @IsInt({
        message: '无效的parentID',
    })
    readonly parentID: number;

    @MinLength(1, {
        message: '评论内容不能为空',
    })
    @MaxLength(500, {
        message: '内容不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly content: string;
}