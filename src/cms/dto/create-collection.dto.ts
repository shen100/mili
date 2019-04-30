import {
    IsString,
    IsInt,
    MinLength,
    MaxLength,
    ArrayMaxSize,
    IsBoolean,
    IsArray,
    IsUrl,
} from 'class-validator';
import { CollectionConstants } from '../../constants/constants';

export class CreateCollectionDto {
    @MinLength(1, {
        message: '名称不能为空',
    })
    @MaxLength(CollectionConstants.NAME_MAX_LENGTH, {
        message: `名称不能超过 ${CollectionConstants.NAME_MAX_LENGTH} 个字符`,
    })
    @IsString()
    readonly name: string;

    @MaxLength(CollectionConstants.URL_MAX_LENGTH, {
        message: `封面URL不能超过 ${CollectionConstants.URL_MAX_LENGTH} 个字符`,
    })
    @IsUrl()
    readonly coverURL: string;

    @MaxLength(CollectionConstants.ANNOUNCEMENT_MAX_LENGTH, {
        message: `专题公告不能超过 ${CollectionConstants.ANNOUNCEMENT_MAX_LENGTH} 个字符`,
    })
    @IsString()
    readonly announcement: string;

    @IsBoolean({
        message: '是否允许投稿有误',
    })
    readonly allowPost: boolean;

    @IsBoolean({
        message: '投稿是否需要审核有误',
    })
    readonly postMustAudit: boolean;

    @IsInt({
        each: true,
    })
    @ArrayMaxSize(CollectionConstants.ADMIN_MAX_COUNT, {
        message: `专题最多只能设置 ${CollectionConstants.ADMIN_MAX_COUNT} 个管理员`,
    })
    readonly admins: number[];
}