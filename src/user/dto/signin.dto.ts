import {
    MinLength,
    IsString,
    Length,
    IsEnum,
} from 'class-validator';
import { ErrorCode, UserConstants } from '../../config/constants';

export enum SigninVerifyType {
	phone = 'phone',
	email = 'email',
}

export class SigninDto {

    @MinLength(1, {
        message: '手机号码/邮箱地址或密码不正确',
    })
    @IsString()
    readonly login: string;

    @Length(UserConstants.PASSWORD_MIN_LENGTH, UserConstants.PASSWORD_MAX_LENGTH, {
        message: ErrorCode.InvalidPassword.MESSAGE,
        context: {
            errorCode: ErrorCode.InvalidPassword.CODE,
        },
    })
    @IsString({
        message: ErrorCode.InvalidPassword.MESSAGE,
        context: {
            errorCode: ErrorCode.InvalidPassword.CODE,
        },
    })
    readonly password: string;

    @IsEnum(SigninVerifyType, {
        message: '无效的登录方式',
    })
    readonly verifyType: string;

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