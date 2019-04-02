import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
    OneToMany,
    ManyToOne,
    JoinTable,
    JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Comment } from './comment.entity';
import { User } from './user.entity';
import { Collection } from './collection.entity';

export enum ArticleStatus {
	Verifying = 1, // 审核中
	VerifySuccess = 2, // 审核通过
	VerifyFail = 3, // 审核未通过
}

export enum ArticleContentType {
	Markdown = 1,
	HTML = 2,
}

@Entity({name: 'articles'})
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at' })
    createdAt: Date;

    @Column('datetime', { name: 'updated_at' })
    updatedAt: Date;

    @Column('datetime', { name: 'deleted_at', nullable: true, default: null })
    deletedAt: Date;

    @Column('datetime', { name: 'last_comment_at', nullable: true, default: null })
    lastCommentAt: Date;

    @Column('varchar', { length: 200 })
    name: string;

    @Column('int', { name: 'browse_count' })
    browseCount: number;

    @Column('int', { name: 'comment_count' })
    commentCount: number;

    @Column('int', { name: 'collect_count' })
    collectCount: number;

    @Column('int', { name: 'like_count' })
    likeCount: number;

    @Column('int', { name: 'word_count' })
    wordCount: number;

    @Column('int', { name: 'hot' })
    hot: number;

    @Column('int')
    status: ArticleStatus;

    @Column('text', { nullable: true, default: null })
    content: string;

    @Column('text', { name: 'html_content', nullable: true, default: null })
    htmlContent: string;

    @Column('varchar', { length: 500, nullable: true, default: null })
    summary: string;

    @Column('varchar', { name: 'cover_url', length: 500, nullable: true, default: null })
    coverURL: string;

    @Column('int', { name: 'content_type' })
    contentType: ArticleContentType;

    @ManyToMany(type => Category)
    @JoinTable({
        name: 'article_category',
        joinColumn: {
            name: 'article_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'category_id',
            referencedColumnName: 'id',
        },
    })
    categories: Category[];

    @ManyToMany(type => Collection, collection => collection.articles)
    @JoinTable({
        name: 'article_collection',
        joinColumn: {
            name: 'article_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'collection_id',
            referencedColumnName: 'id',
        },
    })
    collections: Collection[];

    @OneToMany(type => Comment, comment => comment.article)
    comments: Comment[];

    @Column('int', { name: 'user_id' })
    userID: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
