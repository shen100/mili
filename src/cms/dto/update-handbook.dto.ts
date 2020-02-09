import {
    IsInt, MinLength, MaxLength, IsString, Min, Max, ValidateIf, IsBoolean, IsUrl,
} from 'class-validator';
import { HandBookConstants } from '../../constants/constants';

export class UpdateHandbookIntroduceDto {
    @MinLength(HandBookConstants.INTRODUCE_MIN_LENGTH, {
        message: '小册介绍不能为空',
    })
    @MaxLength(HandBookConstants.INTRODUCE_MAX_LENGTH, {
        message: '小册介绍不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly introduce: string;
}

export class CommitHandbookDto {
    @ValidateIf(o => o.name !== '' || o.isAllDone === true)
    @MinLength(HandBookConstants.TITLE_MIN_LENGTH, {
        message: '小册标题不能为空',
    })
    @MaxLength(HandBookConstants.TITLE_MAX_LENGTH, {
        message: '小册标题不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly name: string;

    @ValidateIf(o => o.summary !== '' || o.isAllDone === true)
    @MinLength(HandBookConstants.SUMMARY_MIN_LENGTH, {
        message: '小册摘要不能为空',
    })
    @MaxLength(HandBookConstants.SUMMARY_MAX_LENGTH, {
        message: '小册摘要不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly summary: string;

    @ValidateIf(o => o.authorIntro !== '' || o.isAllDone === true)
    @MinLength(HandBookConstants.AUTHOR_MIN_LENGTH, {
        message: '作者简介不能为空',
    })
    @MaxLength(HandBookConstants.AUTHOR_MAX_LENGTH, {
        message: '作者简介不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly authorIntro: string;

    @ValidateIf(o => o.price !== 0 || o.isAllDone === true)
    @IsInt()
    @Min(0, {
        message: '价格不能为负数',
    })
    @Max(HandBookConstants.MAX_PRICE, {
        message: '价格不能超过 $constraint1 元',
    })
    readonly price: number;

    @ValidateIf(o => o.coverURL !== '')
    @IsUrl({
        protocols: ['https'],
        require_protocol: true,
    })
    readonly coverURL: string;

    @IsInt()
    @Min(0, {
        message: '无效的时间戳',
    })
    readonly completionAt: number;

    @IsBoolean()
    readonly isAllDone: boolean;

    @IsBoolean()
    readonly isAgree: boolean;
}