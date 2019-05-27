import {
    IsString,
    MinLength,
    MaxLength,
    IsUrl,
} from 'class-validator';

export class CreateTagDto {
    @MinLength(1, {
        message: '名称不能为空',
    })
    @MaxLength(100, {
        message: '名称不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly name: string;

    @IsUrl({
        protocols: ['https'],
        require_protocol: true,
    })
    readonly iconURL: string;
}