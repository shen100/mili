import {
    MinLength,
    IsString,
    IsMobilePhone,
    Length,
} from 'class-validator';
import { ErrorCode } from '../../constants/error';
import { UserConstants } from '../../constants/constants';

export class SMSDto {

    @IsMobilePhone('zh-CN', {
        message: '无效的手机号',
        context: {
            errorCode: ErrorCode.InvalidPhone.CODE,
        },
    })
    readonly phone: string;

    @Length(UserConstants.USERNAME_MIN_LENGTH, UserConstants.USERNAME_MAX_LENGTH, {
        message: ErrorCode.InvalidUserName.MESSAGE,
        context: {
            errorCode: ErrorCode.InvalidUserName.CODE,
        },
    })
    @IsString({
        message: ErrorCode.InvalidUserName.MESSAGE,
        context: {
            errorCode: ErrorCode.InvalidUserName.CODE,
        },
    })
    readonly username: string;

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