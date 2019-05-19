import {
    IsString,
    MinLength,
    MaxLength,
    IsUrl,
    ValidateIf,
} from 'class-validator';

export class CreateHandBookDto {
    @MinLength(1, {
        message: '名称不能为空',
    })
    @MaxLength(100, {
        message: '名称不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly name: string;

    // 传了coverURL字段的话，才对coverURL进行检验
    @ValidateIf(obj => {
        return obj && typeof obj.coverURL !== 'undefined';
    })
    @IsUrl({
        protocols: ['https'],
        require_protocol: true,
    })
    readonly coverURL: string;
}