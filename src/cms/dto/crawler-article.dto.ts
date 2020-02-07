import {
    IsInt,
} from 'class-validator';
import { EditArticleDto } from './edit-article.dto';

export class CrawlerArticleDto extends EditArticleDto {
    @IsInt({
        message: '无效的crawlerID',
    })
    readonly crawlerID: number;
}