import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({name: 'handbooks'})
export class HandBook {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at' })
    createdAt: Date;

    @Column('datetime', { name: 'updated_at' })
    updatedAt: Date;

    @Column('varchar', { length: 200 })
    name: string;

    @Column('text', { nullable: true, default: null })
    summary: string;

    @Column('varchar', { name: 'cover_url', length: 500 })
    coverURL: string; // 封面图片

    @Column('int', { name: 'word_count' })
    wordCount: number; // 小册一共写了多少字

    @Column('int', { name: 'sale_count' })
    saleCount: number;

    @Column('int', { name: 'comment_count' })
    commentCount: number;

    @Column('int', { name: 'user_id' })
    userID: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}

@Entity({name: 'handbook_chapters'})
export class HandBookChapter {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at' })
    createdAt: Date;

    @Column('datetime', { name: 'updated_at' })
    updatedAt: Date;

    @Column('varchar', { length: 200 })
    name: string;

    @Column('int', { name: 'browse_count' })
    browseCount: number;

    @Column('int', { name: 'comment_count' })
    commentCount: number;

    @Column('text', { nullable: true, default: null })
    content: string;

    @Column('int', { name: 'user_id' })
    userID: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('int', { name: 'book_id' })
    bookID: number;

    @ManyToOne(type => HandBook)
    @JoinColumn({ name: 'book_id' })
    book: HandBook;
}