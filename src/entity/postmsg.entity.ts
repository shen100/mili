import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Article } from './article.entity';

export enum PostMsgStatus {
    NotProcess = 1, // 未处理
    Accept = 2, // 接受
    Reject = 3, // 拒绝
}

// 投稿消息
@Entity({name: 'post_message'})
export class PostMsg {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column('int', { name: 'author_id' })
    authorID: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'author_id' })
    author: User;

    @Column('int', { name: 'article_id' })
    articleID: number;

    @ManyToOne(type => Article)
    @JoinColumn({ name: 'article_id' })
    article: Article;

    @Column('int', { name: 'status' })
    status: PostMsgStatus;
}