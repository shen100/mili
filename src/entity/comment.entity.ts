import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Article } from './article.entity';
import { BoilingPoint } from './boilingpoint.entity';
import { BookChapter } from './book.entity';

export enum CommentStatus {
	Verifying = 1, // 审核中
	VerifySuccess = 2, // 审核通过
	VerifyFail = 3, // 审核未通过
}

export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at' })
    createdAt: Date;

    @Column('datetime', { name: 'updated_at' })
    updatedAt: Date;

    @Column('datetime', { name: 'deleted_at', nullable: true, default: null })
    deletedAt: Date;

    @Column('varchar', { name: 'html_content', length: 2000 })
    htmlContent: string;

    @Column('int')
    status: CommentStatus;

    @Column('int', { name: 'user_id' })
    userID: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('int', { name: 'parent_id' })
    parentID: number; // 直接父评论

    @Column('int', { name: 'root_id' })
    rootID: number; // 一级评论

    @Column('varchar', { name: 'latest', length: 100 })
    latest: string; // 最近的两条子评论

    @Column('int', { name: 'comment_count' })
    commentCount: number; // 子评论数

    @Column('int', { name: 'liked_count' })
    likedCount: number; // 点赞数

    @Column('int', { name: 'source_id' })
    sourceID: number;
}

@Entity({name: 'article_comments'})
export class ArticleComment extends Comment {
    @ManyToOne(type => Article, article => article.comments)
    @JoinColumn({name: 'source_id'})
    article: Article;
}

@Entity({name: 'book_chapter_comments'})
export class BookChapterComment extends Comment {
    @Column('int', { name: 'collection_id' })
    collectionID: number;

    @ManyToOne(type => BookChapter, chapter => chapter.comments)
    @JoinColumn({name: 'source_id'})
    chapter: BookChapter;
}

@Entity({name: 'boilingpoint_comments'})
export class BoilingPointComment extends Comment {
    @ManyToOne(type => BoilingPoint, boilingPoint => boilingPoint.comments)
    @JoinColumn({name: 'source_id'})
    boilingPoint: BoilingPoint;
}