import {
    IsString,
    IsInt,
    MinLength,
    MaxLength,
    Min,
    ValidateIf,
    IsUrl,
} from 'class-validator';
import { BoilingPointConstants } from '../../constants/boilingpoint';

export class EditTopicDto {
    // 传了id字段的话，才对id进行检验
    @ValidateIf(obj => {
        return obj && typeof obj.id !== 'undefined';
    })
    @IsInt({
        message: '无效的id',
    })
    id: number;

    @MinLength(1, {
        message: '名称不能为空',
    })
    @MaxLength(BoilingPointConstants.MAX_TOPIC_TITLE_LENGTH, {
        message: '名称不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly name: string;

    @IsUrl({
        protocols: ['https'],
        require_protocol: true,
    })
    readonly icon: string;

    @Min(1)
    @IsInt({
        message: '无效的序号',
    })
    readonly sequence: number;
}