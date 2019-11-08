import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity({name: 'categories'})
export class Category {
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

    @Column('int')
    sequence: number;

    @Column('int', { name: 'parent_id' })
    parentID: number;

    @Column('int', { name: 'follower_count' })
    followerCount: number; // 有多少人关注

    @ManyToMany(type => User, user => user.followedCollections)
    followers: User[];

    @Column('int', { name: 'article_count' })
    articleCount: number; // 有多少人关注

    @Column('varchar', { length: 50 })
    pathname: string;
}