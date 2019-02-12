import {
    IsInt,
} from 'class-validator';
import { CreateArticleDto } from './create-article.dto';

export class UpdateArticleDto  extends CreateArticleDto {
    @IsInt({
        message: '无效的id',
    })
    readonly id: number;
}