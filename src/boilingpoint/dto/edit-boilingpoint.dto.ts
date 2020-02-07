import {
    IsString,
    IsInt,
    MinLength,
    MaxLength,
    ValidateIf,
    ArrayMinSize,
    ArrayMaxSize,
    IsArray,
    IsUrl,
} from 'class-validator';
import { BoilingPointConstants } from '../../constants/boilingpoint';

export class EditBoilingPointDto {
    // 传了id字段的话，才检验id
    @ValidateIf(obj => {
        return obj && typeof obj.id !== 'undefined';
    })
    @IsInt({
        message: '无效的id',
    })
    id: number;

    @MinLength(1, {
        message: '内容不能为空',
    })
    @MaxLength(BoilingPointConstants.MAX_CONTENT_LENGTH, {
        message: '内容不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly htmlContent: string;

    // 传了imgs字段的话，才进行检验
    @ValidateIf(obj => {
        return obj && typeof obj.imgs !== 'undefined';
    })
    @ArrayMinSize(1, {
        message: '图片个数不能为0',
    })
    @ArrayMaxSize(BoilingPointConstants.MAX_IMAGE_COUNT, {
        message: '最多只能上传 $constraint1 个图片',
    })
    @IsArray({
        message: '无效的图片id',
    })
    @IsInt({
        each: true,
    })
    readonly imgs: number[];

    // 传了topicID字段的话，才检验topicID
    @ValidateIf(obj => {
        return obj && typeof obj.topicID !== 'undefined';
    })
    @IsInt({
        message: '无效的topicID',
    })
    topicID: number;
}