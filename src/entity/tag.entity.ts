import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({name: 'tags'})
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at' })
    createdAt: Date;

    @Column('varchar', { length: 200 })
    name: string;

    @Column('int', { name: 'follower_count', default: 0 })
    followerCount: number; // 被多少人关注

    @Column('int', { name: 'article_count', default: 0 })
    articleCount: number;

    @Column('varchar', { name: 'icon_url', length: 500, nullable: true, default: null })
    iconURL: string;
}
