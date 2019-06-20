import {
    IsInt,
} from 'class-validator';
import { CreateHandbookChapterDto } from './create-handbook-chapter.dto';

export class UpdateHandbookChapterDto extends CreateHandbookChapterDto {
    @IsInt({
        message: '无效的id',
    })
    readonly id: number;
}