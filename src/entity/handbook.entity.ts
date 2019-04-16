import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({name: 'handbooks'})
export class Handbook {
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

    @Column('varchar', { name: 'avatar_url', length: 500 })
    coverURL: string; // 封面图片

    @Column('int', { name: 'word_count' })
    wordCount: number; // 小册一共写了多少字

    @Column('int', { name: 'comment_count' })
    commentCount: number;

    @Column('int', { name: 'user_id' })
    userID: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('int', { name: 'category_id' })
    categoryID: number;
}