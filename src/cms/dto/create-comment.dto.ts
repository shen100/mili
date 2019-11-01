import {
    IsString,
    IsInt,
    MinLength,
    MaxLength,
    ValidateIf,
} from 'class-validator';
import { CommentConstants } from '../../constants/comment';

export class CreateCommentDto {
    @ValidateIf(obj => {
        return obj && typeof obj.collectionID !== 'undefined';
    })
    @IsInt({
        message: '无效的collectionID', // 如果是图书章节的评论，那么collectionID就是 图书id
    })
    readonly collectionID: number;

    @IsInt({
        message: '无效的sourceID',
    })
    readonly sourceID: number;

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

    @MinLength(CommentConstants.MinContentLength, {
        message: '评论内容过少哦',
    })
    @MaxLength(CommentConstants.MaxContentLength, {
        message: '评论不能超过 $constraint1 个字符',
    })
    @IsString()
    readonly htmlContent: string;
}