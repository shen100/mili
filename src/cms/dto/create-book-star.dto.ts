import {
    IsInt, MaxLength, IsString, ValidateIf, Min, Max,
} from 'class-validator';
import { BookConstants } from '../../constants/book';

export class CreateBookStarDto {
    @IsInt({
        message: '无效的图书id',
    })
    readonly bookID: number;

    @ValidateIf(obj => {
        return obj && typeof obj.content !== 'undefined';
    })
    @MaxLength(BookConstants.MAX_CONTENT_LENGTH, {
        message: '评价内容不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly content: string;

    @IsInt()
    @Min(BookConstants.MIN_STAR_VALUE, {
        message: '无效的评分',
    })
    @Max(BookConstants.MAX_STAR_VALUE, {
        message: '无效的评分',
    })
    readonly star: number;
}