import {
    IsEnum,
} from 'class-validator';
import { ArticleContentType } from '../../entity/article.entity';
import { CreateDraftDto } from './create-draft.dto';

export class SwitchEditorDto extends CreateDraftDto {
    @IsEnum(ArticleContentType, {
        message: '无效的编辑器',
    })
    readonly editorType: number;
}
