import {
    MinLength, MaxLength, IsString, IsBoolean,
} from 'class-validator';
import { HandBookConstants } from '../../constants/book';

export class UpdateHandbookChapterNameDto {
    @MinLength(1, {
        message: '名称不能为空',
    })
    @MaxLength(HandBookConstants.CHAPTER_NAME_MAX_LENGTH, {
        message: '名称不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly name: string;
}

export class UpdateHandbookChapterContentDto {
    @MinLength(HandBookConstants.CHAPTER_CONTENT_MIN_LENGTH, {
        message: '章节内容不能为空',
    })
    @MaxLength(HandBookConstants.CHAPTER_CONTENT_MAX_LENGTH, {
        message: '章节内容不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly content: string;
}

export class UpdateHandbookChapterTryReadDto {
    @IsBoolean()
    readonly tryRead: boolean;
}