import {
    IsInt,
    IsEnum,
} from 'class-validator';
import { UserStatus } from '../../entity/user.entity';

export class UpdateUserStatusDto {
    @IsInt({
        message: '无效的userID',
    })
    readonly userID: number;

    @IsEnum(UserStatus, {
        message: '无效的用户状态',
    })
    readonly status: number;
}