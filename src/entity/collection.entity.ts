import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Tree,
    ManyToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { User } from './user.entity';

export enum CollectionStatus {
    NotCollect = 1,
    Auditing = 2,
    Collected = 3,
}

@Entity({name: 'collections'})
export class Collection {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column('datetime', { name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column('datetime', { name: 'deleted_at', nullable: true })
    deletedAt: Date;

    @Column('varchar', { length: 200 })
    name: string;

    @Column('int', { name: 'article_count' })
    articleCount: number; // 收录的文章数

    @Column('int', { name: 'follower_count' })
    followerCount: number; // 有多少人关注此专题

    @Column('varchar', { length: 500 })
    announcement: string; // 专题公告

    @Column({ type: Boolean, name: 'allow_post' })
    allowPost: boolean; // 是否允许投稿

    @Column({ type: Boolean, name: 'post_must_audit' })
    postMustAudit: boolean; // 投稿是否需要审核

    @Column('varchar', { name: 'cover_url', length: 500 })
    coverURL: string; // 封面

    @ManyToMany(type => Article, article => article.collections)
    articles: Article[];

    @Column('int', { name: 'creator_id' })
    creatorID: number;

    @ManyToOne(type => User, user => user.collections)
    @JoinColumn({ name: 'creator_id' })
    creator: User;

    @ManyToMany(type => User, user => user.collections)
    admins: User[];

    @ManyToMany(type => User, user => user.followedCollections)
    followers: User[];

    @ManyToMany(type => User, user => user.contributeCollections)
    contributors: User[];
}