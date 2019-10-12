import {
    IsString,
    MinLength,
    MaxLength,
    IsUrl,
} from 'class-validator';
import { TagConstants } from '../../constants/constants';

export class CreateTagDto {
    @MinLength(TagConstants.TAG_MIN_LENGTH, {
        message: '名称不能为空',
    })
    @MaxLength(TagConstants.TAG_MAX_LENGTH, {
        message: '名称不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly name: string;

    @IsUrl({
        protocols: ['https'],
        require_protocol: true,
    }, {
        message: '图标不能为空',
    })
    readonly iconURL: string;
}