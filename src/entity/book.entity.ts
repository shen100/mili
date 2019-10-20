import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { ArticleContentType } from './article.entity';
import { User } from './user.entity';

@Entity({name: 'book_categories'})
export class BookCategory {
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

    @Column('varchar', { length: 50 })
    pathname: string;
}

export enum BookStatus {
	// BookUnpublish 未发布
	BookUnpublish = 0,

	// BookPublished 已发布
	BookPublished = 1,
}

@Entity({name: 'books'})
export class Book {
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

    @Column('varchar', { length: 500, nullable: true, default: null })
    summary: string;

    @Column('int', { name: 'browse_count' })
    browseCount: number;

    @Column('int', { name: 'comment_count' })
    commentCount: number;

    @Column('int', { name: 'chapter_count' })
    chapterCount: number;

    @Column('int', { name: 'word_count' })
    wordCount: number;

    @Column('int', { name: 'study_user_count' })
    studyUserCount: number; // 已学习过此书的人数

    @Column('varchar', { name: 'cover_url', length: 200, nullable: true, default: null })
    coverURL: string;

    @Column('int')
    status: BookStatus;

    @Column('int', { name: 'star_user_count' })
    starUserCount: number; // 评价过图书的人数

    @Column('int', { name: 'star' })
    star: number;

    @Column('int', { name: 'one_star_count' })
    oneStarCount: number;

    @Column('int', { name: 'two_star_count' })
    twoStarCount: number;

    @Column('int', { name: 'three_star_count' })
    threeStarCount: number;

    @Column('int', { name: 'four_star_count' })
    fourStarCount: number;

    @Column('int', { name: 'five_star_count' })
    fiveStarCount: number;

    @Column('int', { name: 'total_star_count' })
    totalStarCount: number;

    @Column('text', { nullable: true, default: null })
    content: string;

    @Column('text', { name: 'html_content', nullable: true, default: null })
    htmlContent: string;

    @Column('int', { name: 'content_type' })
    contentType: ArticleContentType;

    @ManyToMany(type => BookCategory)
    @JoinTable({
        name: 'book_category',
        joinColumn: {
            name: 'book_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'book_category_id',
            referencedColumnName: 'id',
        },
    })
    categories: BookCategory[];

    @Column('int', { name: 'user_id' })
    userID: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}

@Entity({name: 'book_chapters'})
export class BookChapter {
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

    @Column('int', { name: 'word_count' })
    wordCount: number;

    @Column('int', { name: 'browse_count' })
    browseCount: number;

    @Column('int', { name: 'comment_count' })
    commentCount: number;

    @Column('text', { nullable: true, default: null })
    content: string;

    @Column('text', { name: 'html_content', nullable: true, default: null })
    htmlContent: string;

    @Column('int', { name: 'content_type' })
    contentType: ArticleContentType;

    @Column('int', { name: 'user_id' })
    userID: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('int', { name: 'parent_id' })
    parentID: number;

    @Column('int', { name: 'book_id' })
    bookID: number;

    @ManyToOne(type => Book)
    @JoinColumn({ name: 'book_id' })
    book: Book;
}

export enum BookStarStatus {
	// BookVerifying 审核中
	BookVerifying = 1,

	// BookVerifySuccess 审核通过
	BookVerifySuccess = 2,

	// BookVerifyFail 审核未通过
	BookVerifyFail = 3,
}

@Entity({name: 'book_stars'})
export class BookStar {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at' })
    createdAt: Date;

    @Column('varchar', { name: 'html_content', length: 200 })
    htmlContent: string;

    @Column('int')
    status: BookStarStatus;

    @Column('int', { name: 'star' })
    star: number;

    @Column('int', { name: 'book_id' })
    bookID: number;

    @Column('int', { name: 'user_id' })
    userID: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
