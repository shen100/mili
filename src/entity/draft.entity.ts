import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    ManyToOne,
    JoinTable,
    JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from './user.entity';
import { ArticleContentType } from './article.entity';

@Entity({name: 'drafts'})
export class Draft {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at' })
    createdAt: Date;

    @Column('datetime', { name: 'updated_at' })
    updatedAt: Date;

    @Column('datetime', { name: 'deleted_at', nullable: true, default: null })
    deletedAt: Date;

    @Column('varchar', { length: 200 })
    name: string;

    @Column('int', { name: 'word_count' })
    wordCount: number;

    @Column('text', { nullable: true, default: null })
    content: string;

    @Column('text', { name: 'html_content', nullable: true, default: null })
    htmlContent: string;

    @Column('int', { name: 'content_type' })
    contentType: ArticleContentType;

    @ManyToMany(type => Category)
    @JoinTable({
        name: 'draft_category',
        joinColumn: {
            name: 'draft_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'category_id',
            referencedColumnName: 'id',
        },
    })
    categories: Category[];

    @Column('int', { name: 'user_id' })
    userID: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}