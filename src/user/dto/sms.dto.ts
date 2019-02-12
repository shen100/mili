import {
    MinLength,
    IsString,
    IsMobilePhone,
} from 'class-validator';
import { ErrorCode } from '../../config/constants';

export class SMSDto {

    @IsMobilePhone('zh-CN', {
        message: '无效的手机号',
        context: {
            errorCode: ErrorCode.InvalidPhone.CODE,
        },
    })
    readonly phone: string;

    @MinLength(1, {
        message: 'geetest_challenge不能为空',
    })
    @IsString()
    readonly geetest_challenge: string;

    @MinLength(1, {
        message: 'geetest_validate不能为空',
    })
    @IsString()
    readonly geetest_validate: string;

    @MinLength(1, {
        message: 'geetest_seccode不能为空',
    })
    @IsString()
    readonly geetest_seccode: string;
}