import {
    IsInt, MinLength, MaxLength, IsString,
} from 'class-validator';
import { HandbookConstants } from '../../constants/constants';

export class UpdateHandbookChapterNameDto {
    @IsInt({
        message: '无效的id',
    })
    readonly id: number;

    @MinLength(1, {
        message: '名称不能为空',
    })
    @MaxLength(HandbookConstants.CHAPTER_NAME_MAX_LENGTH, {
        message: '名称不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly name: string;
}

export class UpdateHandbookChapterContentDto {
    @IsInt({
        message: '无效的id',
    })
    readonly id: number;

    @MinLength(HandbookConstants.CHAPTER_CONTENT_MIN_LENGTH, {
        message: '章节内容不能为空',
    })
    @MaxLength(HandbookConstants.CHAPTER_CONTENT_MAX_LENGTH, {
        message: '章节内容不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly content: string;
}