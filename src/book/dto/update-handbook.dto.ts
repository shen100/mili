import {
    IsInt, MinLength, MaxLength, IsString, Min, Max, ValidateIf, IsBoolean, IsUrl,
} from 'class-validator';
import { HandBookConstants } from '../../constants/handbook';

export class UpdateHandBookIntroduceDto {
    @MaxLength(HandBookConstants.INTRODUCE_MAX_LENGTH, {
        message: '小册介绍不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly introduce: string;
}

export class UpdateHandBookDto {
    @MinLength(HandBookConstants.TITLE_MIN_LENGTH, {
        message: '小册标题不能为空',
    })
    @MaxLength(HandBookConstants.TITLE_MAX_LENGTH, {
        message: '小册标题不能超过 $constraint1 个字符',
    })
    @IsString({
        message: '小册标题不能为空',
    })
    readonly name: string;

    @MinLength(HandBookConstants.SUMMARY_MIN_LENGTH, {
        message: '小册摘要不能为空',
    })
    @MaxLength(HandBookConstants.SUMMARY_MAX_LENGTH, {
        message: '小册摘要不能超过 $constraint1 个字符',
    })
    @IsString({
        message: '小册摘要不能为空',
    })
    readonly summary: string;

    @MaxLength(HandBookConstants.AUTHOR_INTRO_MAX_LENGTH, {
        message: '作者简介不能超过 $constraint1 个字符',
    })
    @IsString({
        message: '无效的作者简介',
    })
    readonly authorIntro: string;

    @IsInt()
    @Min(0, {
        message: '无效的价格',
    })
    @Max(HandBookConstants.MAX_PRICE, {
        message: '价格不能超过 $constraint1 元',
    })
    readonly price: number; // 单位分

    @ValidateIf(o => o.coverURL !== '')
    @IsUrl({
        protocols: ['https'],
        require_protocol: true,
    })
    readonly coverURL: string;

    @IsInt()
    @Min(0, {
        message: '无效的完成时间',
    })
    readonly completionAt: number;

    @IsBoolean()
    readonly isAllDone: boolean;

    @IsBoolean()
    readonly isAgree: boolean;
}