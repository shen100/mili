import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum TimelineType {
	PublishComment = 'publish_comment', // 发表了评论，对评论进行评论时，@原评论者
    PublishArticle = 'publish_article', // 发表了文章
    UpComment = 'up_comment', // 赞了评论
    LinkArticle = 'link_article', // 喜欢了文章
    FollowUser = 'follow_user', // 关注了作者
    Join = 'join', // 加入，即用户注册了
}

@Entity({name: 'articles'})
export class Timeline {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'date' })
    date: Date;

    @Column('varchar', { length: 200 })
    username: string;

    @Column('varchar', { length: 30 })
    type: TimelineType;

    @Column('varchar', { length: 200 })
    articleTitle: string;

}