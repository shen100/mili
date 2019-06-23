import {
    IsInt, MinLength, MaxLength, IsString, Min, Max,
} from 'class-validator';
import { HandbookConstants } from '../../constants/constants';

export class UpdateHandbookIntroduceDto {
    @MinLength(HandbookConstants.INTRODUCE_MIN_LENGTH, {
        message: '小册介绍不能为空',
    })
    @MaxLength(HandbookConstants.INTRODUCE_MAX_LENGTH, {
        message: '小册介绍不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly introduce: string;
}

export class CommitHandbookDto {
    @MinLength(HandbookConstants.SUMMARY_MIN_LENGTH, {
        message: '小册摘要不能为空',
    })
    @MaxLength(HandbookConstants.SUMMARY_MAX_LENGTH, {
        message: '小册摘要不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly summary: string;

    @MinLength(HandbookConstants.AUTHOR_MIN_LENGTH, {
        message: '作者简介不能为空',
    })
    @MaxLength(HandbookConstants.AUTHOR_MAX_LENGTH, {
        message: '作者简介不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly authorIntroduce: string;

    @IsInt()
    @Min(0, {
        message: '价格不能为负数',
    })
    @Max(HandbookConstants.MAX_PRICE, {
        message: '价格不能超过 $constraint1 元',
    })
    readonly price: number;
}