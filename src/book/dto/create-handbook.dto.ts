import {
    IsString,
    MinLength,
    MaxLength,
} from 'class-validator';
import { HandBookConstants } from '../../constants/book';

export class CreateHandBookDto {
    @MinLength(HandBookConstants.MIN_TITLE_LENGTH, {
        message: '标题不能为空',
    })
    @MaxLength(HandBookConstants.MAX_TITLE_LENGTH, {
        message: '标题不能超过 $constraint1 个字符',
    })
    @IsString({
        message: '标题不能为空',
    })
    readonly name: string;
}