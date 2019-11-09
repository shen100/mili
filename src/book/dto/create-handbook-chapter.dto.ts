import {
    IsString,
    MinLength,
    MaxLength,
} from 'class-validator';
import { HandbookConstants } from '../../constants/constants';

export class CreateHandbookChapterDto {
    @MinLength(1, {
        message: '名称不能为空',
    })
    @MaxLength(HandbookConstants.CHAPTER_NAME_MAX_LENGTH, {
        message: '名称不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly name: string;
}