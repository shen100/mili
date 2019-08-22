import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

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

    @Column('int')
    order: number;
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

    @Column('varchar', { length: 1000 })
    htmlContent: string;

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
}
