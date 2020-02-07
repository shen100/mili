import {
    IsString,
    MinLength,
    MaxLength,
    IsInt,
    ValidateIf,
} from 'class-validator';
import { BookConstants } from '../../constants/book';

export class CreateBookChapterDto {
    @MinLength(1, {
        message: '章节标题不能为空',
    })
    @MaxLength(BookConstants.MAX_CHAPTER_TITLE_LENGTH, {
        message: '章节标题不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly name: string;

    @IsInt({
        message: '无效的bookID',
    })
    readonly bookID: number;

    // 传了 parentChapterID 字段的话，才对 parentChapterID 进行检验
    @ValidateIf(obj => {
        return obj && typeof obj.parentChapterID !== 'undefined';
    })
    @IsInt({
        message: '无效的id',
    })
    readonly parentChapterID: number;
}