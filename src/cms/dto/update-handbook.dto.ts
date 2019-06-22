import {
    IsInt, MinLength, MaxLength, IsString,
} from 'class-validator';
import { HandbookConstants } from '../../constants/constants';

export class UpdateHandbookSummaryDto {
    @IsInt({
        message: '无效的id',
    })
    readonly id: number;

    @MinLength(HandbookConstants.SUMMARY_MIN_LENGTH, {
        message: '小册介绍不能为空',
    })
    @MaxLength(HandbookConstants.SUMMARY_MAX_LENGTH, {
        message: '小册介绍不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly summary: string;
}