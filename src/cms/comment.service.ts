import * as _ from 'lodash';
import * as marked from 'marked';
import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { Repository, Not, In, LessThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment,
    CommentContentType,
    CommentStatus,
    ChapterComment,
} from '../entity/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NO_PARENT } from '../constants/constants';
import { ErrorCode } from '../constants/error';
import { recentTime } from '../utils/viewfilter';
import { MyHttpException } from '../core/exception/my-http.exception';

import {
    CommentConstants,
} from '../constants/comment';

const {
    LikeArticleCommentTable,
    LikeChapterCommentTable,
    ArticleCommentTable,
    ChapterCommentTable,
} = CommentConstants;

const commentListSelect = {
    id: true,
    createdAt: true,
    htmlContent: true,
    parentID: true,
    rootID: true,
    latest: true,
    user: {
        id: true,
        username: true,
        avatarURL: true,
        job: true,
        company: true,
    },
    likedCount: true,
    commentCount: true,
};

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,

        @InjectRepository(ChapterComment)
        private readonly chapterCommentRepository: Repository<ChapterComment>,
    ) {}

    // async findOne(commentType: string, commentID: number, select) {
    //     let comment;
    //     if (commentType === CommentTypeArticle) {
    //         comment = await this.commentRepository.findOne({
    //             id: commentID,
    //         }, {
    //             select,
    //         });
    //     } else if (commentType === CommentTypeChapter) {
    //         comment = await this.chapterCommentRepository.findOne({
    //             id: commentID,
    //         }, {
    //             select,
    //         });
    //     }
    //     return comment;
    // }

    // async getParent(commentType: string, id: number, fields = []) {
    //     if (commentType === CommentTypeArticle) {
    //         return await this.commentRepository.findOne({
    //             select: fields,
    //             where: {
    //                 id,
    //             },
    //         });
    //     }
    //     return await this.chapterCommentRepository.findOne({
    //         select: fields,
    //         where: {
    //             id,
    //         },
    //     });
    // }

    async articleComments(userID: number, articleID: number, lastCommentID: number, limit: number) {
        let comments: Comment[] = await this.commentRepository.find({
            select: commentListSelect,
            relations: ['user'],
            where: lastCommentID ? {
                articleID,
                parentID: NO_PARENT,
                id: LessThan(lastCommentID),
            } : {
                articleID,
                parentID: NO_PARENT,
            },
            order: { id: 'DESC' },
            take: limit,
        });
        comments = comments || [];
        let allCommentIDs = [];
        const parentIDArr: number[] = [];
        const subIDMap = {};
        // 一级评论
        const parentComments = comments.map(comment => {
            allCommentIDs.push(comment.id);
            const latest = JSON.parse(comment.latest);
            const tempSubIDs = [];
            latest.forEach(data => {
                subIDMap[data.id] = data.id;
                tempSubIDs.push(data.id);
                parentIDArr.push(data.pid);
            });
            return {
                ...comment,
                userLiked: false,
                subIDs: tempSubIDs,
                comments: [],
                createdAtLabel: recentTime(comment.createdAt, 'YYYY.MM.DD'),
            };
        });
        let subCommentIDArr = [];
        parentComments.map(pComment => subCommentIDArr = subCommentIDArr.concat(pComment.subIDs));
        allCommentIDs = allCommentIDs.concat(subCommentIDArr);
        const [subAndParentComments, likeComments] = await Promise.all([
            this.articleSubCommentByIDs(subCommentIDArr.concat(parentIDArr)),
            userID ? this.commentsFilterByUserLiked(allCommentIDs, userID) : Promise.resolve([]),
        ]);
        const subAndParentCommentMap = {};
        subAndParentComments.map(s => {
            subAndParentCommentMap[s.id] = s;
        });
        subAndParentComments.map(comment => {
            if (subIDMap[comment.id]) {
                subAndParentCommentMap[comment.id].parent = subAndParentCommentMap[comment.parentID];
            }
        });
        const userLikeCommentMap = {};
        likeComments.map(c => userLikeCommentMap[c.commentID] = true);
        parentComments.map(comment => {
            comment.userLiked = !!userLikeCommentMap[comment.id];
            comment.comments = comment.subIDs.map(id => subAndParentCommentMap[id]);
            comment.comments.map(subC => subC.userLiked = !!userLikeCommentMap[subC.id]);
        });
        return parentComments;
    }

    async articleSubComments(userID: number, commentID: number, lastSubCommentID: number, limit: number) {
        let comments = await this.commentRepository.find({
            select: commentListSelect,
            relations: ['user'],
            where: { rootID: commentID, id: LessThan(lastSubCommentID) },
            order: { id: 'DESC' },
            take: limit,
        });
        comments = comments || [];
        const subCommentIDs = [];
        const tempComments = comments.map(comment => {
            subCommentIDs.push(comment.id);
            return {
                ...comment,
                userLiked: false,
                createdAtLabel: recentTime(comment.createdAt, 'YYYY.MM.DD'),
            };
        });
        const likeComments = await (userID ? this.commentsFilterByUserLiked(subCommentIDs, userID) : Promise.resolve([]));
        const userLikeCommentMap = {};
        likeComments.map(c => userLikeCommentMap[c.commentID] = true);
        tempComments.map(comment => {
            comment.userLiked = !!userLikeCommentMap[comment.id];
        });
        return tempComments;
    }

    async articleSubCommentByIDs(ids: number[]) {
        let comments = await this.commentRepository.find({
            select: commentListSelect,
            relations: ['user'],
            where: { id: In(ids) },
            order: { id: 'DESC' },
        });
        comments = comments || [];
        const result = comments.map(comment => {
            return {
                ...comment,
                createdAtLabel: recentTime(comment.createdAt, 'YYYY.MM.DD'),
            };
        });
        return result;
    }

    // async create(commentType: string, createCommentDto: CreateCommentDto, userID: number) {
    //     let comment: Comment;
    //     if (commentType === CommentTypeArticle) {
    //         comment = new Comment();
    //     } else if (commentType === CommentTypeChapter) {
    //         comment = new ChapterComment();
    //     }
    //     comment.articleID = createCommentDto.commentTo;
    //     comment.contentType = CommentContentType.HTML;
    //     comment.htmlContent = createCommentDto.content;
    //     comment.parentID = createCommentDto.parentID || NO_PARENT;
    //     comment.rootID = createCommentDto.rootID || NO_PARENT;
    //     comment.status = CommentStatus.Verifying;
    //     comment.userID = userID;
    //     comment.createdAt = new Date();
    //     comment.updatedAt = comment.createdAt;
    //     comment.commentCount = 0;

    //     await this.commentRepository.manager.connection.transaction(async manager => {
    //         let sql = `UPDATE articles SET comment_count = comment_count + 1 WHERE id = ${comment.articleID}`;
    //         if (commentType === CommentTypeChapter) {
    //             sql = `UPDATE book_chapters SET comment_count = comment_count + 1 WHERE id = ${comment.articleID}`;
    //         }
    //         let commentRepository: any = manager.getRepository(Comment);
    //         if (commentType === CommentTypeChapter) {
    //             commentRepository = manager.getRepository(ChapterComment);
    //         }
    //         const commentData: any = { ...comment };
    //         if (commentType === CommentTypeChapter) {
    //             commentData.bookID = createCommentDto.bookID;
    //         }
    //         await commentRepository.save(commentData);
    //         await manager.query(sql);
    //         if (commentType === CommentTypeChapter) {
    //             await manager.query('UPDATE books SET comment_count = comment_count + 1 WHERE id = ?', [createCommentDto.bookID]);
    //         }
    //     });
    //     return comment;
    // }

    // async delete(commentType: string, commentID: number, userID: number) {
    //     const userLikeTable = userLikeTableMap[commentType];
    //     const commentTable = commentTableMap[commentType];
    //     const articleTable = articleTableMap[commentType];

    //     const comment = await this.findOne(commentType, commentID, ['id', 'articleID', 'parentID', 'rootID']);
    //     if (!comment) {
    //         throw new MyHttpException({
    //             errorCode: ErrorCode.ParamsError.CODE,
    //         });
    //     }
    //     if (comment.userID !== userID) {
    //         throw new MyHttpException({
    //             errorCode: ErrorCode.Forbidden.CODE,
    //         });
    //     }
    //     await this.commentRepository.manager.connection.transaction(async manager => {
    //         let sql1 = `DELETE FROM ${commentTable} WHERE id = ${commentID}`;
    //         let sql2 = `DELETE FROM ${userLikeTable} WHERE comment_id = ${commentID}`;
    //         if (!comment.parentID) {
    //             sql1 = `DELETE FROM ${commentTable} WHERE id = ${commentID} or root_id = ${commentID}`;
    //             sql2 = `DELETE FROM ${userLikeTable} WHERE comment_id = ${commentID} or root_id = ${commentID}`;
    //         }
    //         const deleteResult = await manager.query(sql1);
    //         await manager.query(sql2);
    //         const sql3 = `UPDATE ${articleTable} SET comment_count = comment_count - ${deleteResult.affectedRows} WHERE id = ${comment.articleID}`;
    //         await manager.query(sql3);
    //     });
    // }

    /**
     * 点赞
     */
    async like(c: new () => Comment | ChapterComment, commentID: number, userID: number) {
        let userLikeTable: string;
        let commentTable: string;
        let commentRepository: Repository<Comment> | Repository<ChapterComment>;

        if (c === Comment) {
            userLikeTable = LikeArticleCommentTable;
            commentTable = ArticleCommentTable;
            commentRepository = this.commentRepository;
        } else if (c === ChapterComment) {
            userLikeTable = LikeChapterCommentTable;
            commentTable = ChapterCommentTable;
            commentRepository = this.chapterCommentRepository;
        }

        const sql1 = `SELECT id FROM ${commentTable} WHERE id = ?`;
        const commentData = await commentRepository.manager.query(sql1, [commentID]) || [];
        if (commentData.length <= 0) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }

        const sql2 = `SELECT comment_id, user_id FROM ${userLikeTable}
            WHERE comment_id = ? AND user_id = ?`;
        const result = await commentRepository.manager.query(sql2, [commentID, userID]) || [];
        if (result.length) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '已经赞过此评论',
            });
        }
        await commentRepository.manager.connection.transaction(async manager => {
            const sql3 = `INSERT INTO ${userLikeTable} (comment_id, user_id, created_at) VALUES (?, ?, ?)`;
            const sql4 = `UPDATE ${commentTable} SET liked_count = liked_count + 1 WHERE id = ?`;
            await manager.query(sql3, [commentID, userID, new Date()]);
            await manager.query(sql4, [commentID]);
        });
    }

    /**
     * 取消点赞
     */
    async deleteLike(c: new () => Comment | ChapterComment, commentID: number, userID: number) {
        let userLikeTable: string;
        let commentTable: string;
        let commentRepository: Repository<Comment> | Repository<ChapterComment>;
        if (c === Comment) {
            userLikeTable = LikeArticleCommentTable;
            commentTable = ArticleCommentTable;
            commentRepository = this.commentRepository;
        } else if (c === ChapterComment) {
            userLikeTable = LikeChapterCommentTable;
            commentTable = ChapterCommentTable;
            commentRepository = this.chapterCommentRepository;
        }
        const sql = `SELECT comment_id, user_id FROM ${userLikeTable}
                WHERE comment_id = ? AND user_id = ?`;
        const likeData = await commentRepository.manager.query(sql, [commentID, userID]) || [];
        if (likeData.length <= 0) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '您还没有赞过此评论哦',
            });
        }
        await commentRepository.manager.connection.transaction(async manager => {
            const sql1 = `DELETE FROM ${userLikeTable} WHERE comment_id = ? AND user_id = ?`;
            const sql2 = `UPDATE ${commentTable} SET liked_count = liked_count - 1 WHERE id = ?`;
            await manager.query(sql1, [commentID, userID]);
            await manager.query(sql2, [commentID]);
        });
    }

    /**
     * 给定一组评论id，根据 userID 来过滤被用户赞过的的评论
     */
    async commentsFilterByUserLiked(commentIDs: number[], userID: number) {
        if (!commentIDs || commentIDs.length <= 0) {
            return [];
        }
        const sql = `SELECT user_id as userID, comment_id as commentID FROM like_article_comments
            WHERE user_id = ? AND comment_id IN (?)`;
        return await this.commentRepository.manager.query(sql, [userID, commentIDs]);
    }
}