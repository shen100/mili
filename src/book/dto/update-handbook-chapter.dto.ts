import {
    MinLength, MaxLength, IsString, IsBoolean,
} from 'class-validator';
import { HandBookConstants } from '../../constants/handbook';

export class UpdateHandBookChapterDto {
    @MinLength(1, {
        message: '章节标题不能为空',
    })
    @MaxLength(HandBookConstants.CHAPTER_NAME_MAX_LENGTH, {
        message: '章节标题不能超过 $constraint1 个字符',
    })
    @IsString({
        message: '章节标题不能为空',
    })
    readonly name: string;
}

export class UpdateHandBookChapterContentDto {
    @MaxLength(HandBookConstants.CHAPTER_CONTENT_MAX_LENGTH, {
        message: '章节内容不能超过 $constraint1 个字符',
    })
    @IsString({
        message: '无效的章节内容',
    })
    readonly content: string;
}

export class UpdateHandBookChapterTryReadDto {
    @IsBoolean()
    readonly tryRead: boolean;
}