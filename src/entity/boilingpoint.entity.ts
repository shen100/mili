import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { BoilingPointComment } from './comment.entity';

@Entity({name: 'boilingpoint_topics'})
export class BoilingPointTopic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at' })
    createdAt: Date;

    @Column('datetime', { name: 'updated_at' })
    updatedAt: Date;

    @Column('varchar', { length: 200 })
    name: string;

    @Column('varchar', { length: 500 })
    icon: string;

    @Column('int')
    sequence: number;
}

@Entity({name: 'boilingpoints'})
export class BoilingPoint {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at' })
    createdAt: Date;

    @Column('int', { name: 'browse_count' })
    browseCount: number;

    @Column('int', { name: 'comment_count' })
    commentCount: number;

    @Column('int', { name: 'root_comment_count' })
    rootCommentCount: number; // 一级评论数

    @Column('int', { name: 'liked_count' })
    likedCount: number;

    @Column('varchar', { name: 'html_content', length: 2000 })
    htmlContent: string;

    @Column('varchar', { name: 'summary', length: 100 })
    summary: string;

    @Column('varchar', { length: 2000 })
    imgs: string;

    @Column('int', { name: 'topic_id' })
    topicID: number;

    @ManyToOne(type => BoilingPointTopic)
    @JoinColumn({ name: 'topic_id' })
    topic: BoilingPointTopic;

    @Column('int', { name: 'user_id' })
    userID: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(type => BoilingPointComment, comment => comment.boilingPoint)
    comments: BoilingPointComment[];
}

@Entity({name: 'boilingpoint_reports'})
export class BoilingPointReport {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at' })
    createdAt: Date;

    @Column('int', { name: 'boilingpoint_id' })
    boilingPointID: number;

    @Column('tinyint')
    reason: number; // 1、和话题不符 2、恶意攻击谩骂 3、广告营销 0、其它

    @Column('int', { name: 'reporter' })
    reporter: number; // 举报人
}