import {
    IsString,
    IsInt,
    MinLength,
    MaxLength,
    IsEnum,
    ValidateIf,
} from 'class-validator';

export class CreateCommentDto {
    @ValidateIf(obj => {
        return obj && typeof obj.bookID !== 'undefined';
    })
    @IsInt({
        message: '无效的bookID',
    })
    readonly bookID: number;

    @IsInt({
        message: '无效的commentTo',
    })
    readonly commentTo: number;

    @ValidateIf(o => o.parentID !== undefined)
    @IsInt({
        message: '无效的parentID',
    })
    readonly parentID: number;

    @ValidateIf(o => o.rootID !== undefined)
    @IsInt({
        message: '无效的rootID',
    })
    readonly rootID: number;

    @MinLength(1, {
        message: '评论内容不能为空',
    })
    @MaxLength(500, {
        message: '内容不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly content: string;
}