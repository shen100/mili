import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleContentType } from './article.entity';

@Entity({name: 'settings'})
export class Settings {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { name: 'editor_type' })
    editorType: ArticleContentType;
}