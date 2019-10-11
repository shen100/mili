import {
    IsInt,
} from 'class-validator';
import { CreateTagDto } from './create-tag.dto';

export class UpdateTagDto extends CreateTagDto {
    @IsInt({
        message: '无效的id',
    })
    readonly id: number;
}