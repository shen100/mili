import { Entity, Column, PrimaryGeneratedColumn, Unique, Index } from 'typeorm';
import { ArticleContentType } from './article.entity';

@Entity({name: 'settings'})
export class Settings {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', { name: 'editor_type' })
    editorType: ArticleContentType;

    @Index({ unique: true })
    @Column('int', { name: 'user_id' })
    userID: number;
}