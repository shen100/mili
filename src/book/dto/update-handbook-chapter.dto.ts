import {
    IsInt, MinLength, MaxLength, IsString, IsBoolean,
} from 'class-validator';
import { HandbookConstants } from '../../constants/constants';

export class UpdateHandbookChapterNameDto {
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
    @MinLength(HandbookConstants.CHAPTER_CONTENT_MIN_LENGTH, {
        message: '章节内容不能为空',
    })
    @MaxLength(HandbookConstants.CHAPTER_CONTENT_MAX_LENGTH, {
        message: '章节内容不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly content: string;
}

export class UpdateHandbookChapterTryReadDto {
    @IsBoolean()
    readonly tryRead: boolean;
}