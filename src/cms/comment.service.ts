import * as _ from 'lodash';
import * as marked from 'marked';
import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { Repository, Not, In, LessThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment,
    CommentStatus,
    BookChapterComment,
    ArticleComment,
    BoilingPointComment,
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
    ArticleTable,
    BoilingPointTable,
    BookChapterTable,
    LikeArticleCommentTable,
    LikeBookChapterCommentTable,
    LikeBoilingPointCommentTable,
    ArticleCommentTable,
    BookChapterCommentTable,
    BoilingPointCommentTable,
    BookTable,
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
        @InjectRepository(ArticleComment)
        private readonly articleCommentRepository: Repository<ArticleComment>,

        @InjectRepository(BookChapterComment)
        private readonly bookChapterCommentRepository: Repository<BookChapterComment>,

        @InjectRepository(BoilingPointComment)
        private readonly boilingPointCommentRepository: Repository<BoilingPointComment>,
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

    async getParent(c: new () => Comment, id: number, fields: string[] = []) {
        const commentRepository = this.getCommentRepository(c);
        return await await (commentRepository as any).findOne({
            select: fields,
            where: {
                id,
            },
        });
    }

    /**
     * 一级评论列表
     */
    async comments(c: new () => Comment, sourceID: number, lastCommentID: number, userID: number, limit: number) {
        const commentRepository = this.getCommentRepository(c);
        const comments = await (commentRepository as any).find({
            select: commentListSelect,
            relations: ['user'],
            where: lastCommentID ? {
                sourceID,
                parentID: NO_PARENT, // 只查一级评论
                id: LessThan(lastCommentID),
            } : {
                sourceID,
                parentID: NO_PARENT,
            },
            order: { id: 'DESC' },
            take: limit,
        }) || [];

        // 一级评论id及子评论id
        const allCommentIDs = [];
        // 子评论的父评论id
        const parentIDArr: number[] = [];
        // 子评论id
        const subCommentIDArr: number[] = [];
        // 子评论id的map
        const subIDMap = {};
        // 一级评论
        const rootComments = comments.map(comment => {
            allCommentIDs.push(comment.id);
            const latest = JSON.parse(comment.latest);
            const tempSubIDs = [];
            latest.forEach(data => {
                allCommentIDs.push(data.id);
                subCommentIDArr.push(data.id);
                subIDMap[data.id] = data.id;
                parentIDArr.push(data.pid);
                tempSubIDs.push(data.id);
            });
            return {
                ...comment,
                userLiked: false,
                subIDs: tempSubIDs,
                comments: [],
                createdAtLabel: recentTime(comment.createdAt, 'YYYY.MM.DD'),
            };
        });
        const [subAndParentComments, likeComments] = await Promise.all([
            this.commentsByIDs(c, subCommentIDArr.concat(parentIDArr)),
            userID ? this.commentsFilterByUserLiked(c, allCommentIDs, userID) : Promise.resolve([]),
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
        likeComments.map(likeComment => userLikeCommentMap[likeComment.commentID] = true);
        rootComments.map(comment => {
            comment.userLiked = !!userLikeCommentMap[comment.id];
            comment.comments = comment.subIDs.map(id => subAndParentCommentMap[id]);
            comment.comments.map(subC => subC.userLiked = !!userLikeCommentMap[subC.id]);
        });
        return rootComments;
    }

    /**
     * 子评论列表
     */
    async subComments(c: new () => Comment, commentID: number, lastSubCommentID: number, userID: number, limit: number) {
        const commentRepository = this.getCommentRepository(c);
        const comments = await (commentRepository as any).find({
            select: commentListSelect,
            relations: ['user'],
            where: lastSubCommentID ? { rootID: commentID, id: LessThan(lastSubCommentID) } : { rootID: commentID },
            order: { id: 'DESC' },
            take: limit,
        }) || [];
        const subCommentIDs = [];
        const theComments = comments.map(comment => {
            subCommentIDs.push(comment.id);
            return {
                ...comment,
                userLiked: false,
                createdAtLabel: recentTime(comment.createdAt, 'YYYY.MM.DD'),
            };
        });
        const likeComments = await (userID ? this.commentsFilterByUserLiked(c, subCommentIDs, userID) : Promise.resolve([]));
        const userLikeCommentMap = {};
        likeComments.map(likeC => userLikeCommentMap[likeC.commentID] = true);
        theComments.map(comment => {
            comment.userLiked = !!userLikeCommentMap[comment.id];
        });
        return theComments;
    }

    /**
     * 根据给定的一组评论id来查询评论
     */
    async commentsByIDs(c: new () => Comment, ids: number[]) {
        const commentRepository = this.getCommentRepository(c);
        const comments = await (commentRepository as any).find({
            select: commentListSelect,
            relations: ['user'],
            where: { id: In(ids) },
            order: { id: 'DESC' },
        }) || [];
        const result = comments.map(comment => {
            return {
                ...comment,
                createdAtLabel: recentTime(comment.createdAt, 'YYYY.MM.DD'),
            };
        });
        return result;
    }

    async create(c: new () => Comment, createCommentDto: CreateCommentDto, userID: number) {
        const collectionTable = this.getCollectionTable(c);
        const sourceTable: string = this.getSourceTable(c);
        const commentTable = this.getCommentTable(c);
        const commentRepository = this.getCommentRepository(c);
        let id;

        await commentRepository.manager.connection.transaction(async manager => {
            const now = new Date();
            const commentSQL = `INSERT INTO ${commentTable} (source_id, html_content, parent_id, root_id,
                status, user_id, created_at, updated_at, comment_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            // commentSQL2 只是比 commentSQL 多增加个 collection_id 字段
            const commentSQL2 = `INSERT INTO ${commentTable} (source_id, html_content, parent_id, root_id,
                status, user_id, created_at, updated_at, comment_count, collection_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const commentSQLData = [
                createCommentDto.sourceID,
                createCommentDto.htmlContent,
                createCommentDto.parentID || NO_PARENT,
                createCommentDto.rootID || NO_PARENT,
                CommentStatus.VerifySuccess,
                userID,
                now,
                now,
                0,
            ];
            let sql = commentSQL;
            if (createCommentDto.collectionID) {
                sql = commentSQL2;
                commentSQLData.push(createCommentDto.collectionID);
            }
            const sql2 = `UPDATE ${sourceTable} SET comment_count = comment_count + 1 WHERE id = ${createCommentDto.sourceID}`;
            const result = await manager.query(sql);
            console.log();
            await manager.query(sql2);
            if (createCommentDto.collectionID) {
                await manager.query(`UPDATE ${collectionTable} SET comment_count = comment_count + 1 WHERE id = ?`, [createCommentDto.collectionID]);
            }
        });
        return id;
    }

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
    async like(c: new () => Comment, commentID: number, userID: number) {
        const userLikeTable: string = this.getUserLikeTable(c);
        const commentTable: string = this.getCommentTable(c);
        const commentRepository = this.getCommentRepository(c);

        const sql1 = `SELECT id FROM ${commentTable} WHERE id = ?`;
        const sql2 = `SELECT comment_id, user_id FROM ${userLikeTable}
            WHERE comment_id = ? AND user_id = ?`;

        let [commentData, userLikedData] = await Promise.all([
            commentRepository.manager.query(sql1, [commentID]),
            commentRepository.manager.query(sql2, [commentID, userID]),
        ]);
        commentData = commentData || [];
        userLikedData = userLikedData || [];
        if (commentData.length <= 0) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        if (userLikedData.length) {
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
    async deleteLike(c: new () => Comment, commentID: number, userID: number) {
        const userLikeTable: string = this.getUserLikeTable(c);
        const commentTable: string = this.getCommentTable(c);
        const commentRepository = this.getCommentRepository(c);

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
    async commentsFilterByUserLiked(c: new () => Comment, commentIDs: number[], userID: number) {
        if (!commentIDs || commentIDs.length <= 0) {
            return [];
        }
        const userLikeTable: string = this.getUserLikeTable(c);
        const commentRepository = this.getCommentRepository(c);
        const sql = `SELECT user_id as userID, comment_id as commentID FROM ${userLikeTable}
            WHERE user_id = ? AND comment_id IN (?)`;
        return await commentRepository.manager.query(sql, [userID, commentIDs]);
    }

    private getCommentRepository(c: new () => Comment): Repository<ArticleComment> |
            Repository<BookChapterComment> | Repository<BoilingPointComment> {
        let commentRepository: Repository<ArticleComment> | Repository<BookChapterComment> | Repository<BoilingPointComment>;
        if (c === ArticleComment) {
            commentRepository = this.articleCommentRepository;
        } else if (c === BookChapterComment) {
            commentRepository = this.bookChapterCommentRepository;
        } else if (c === BoilingPointComment) {
            commentRepository = this.boilingPointCommentRepository;
        }
        return commentRepository;
    }

    private getCollectionTable(c: new () => Comment): string {
        let collectionTable: string = '';
        if (c === BookChapterComment) {
            collectionTable = BookTable;
        }
        return collectionTable;
    }

    private getSourceTable(c: new () => Comment): string {
        let sourceTable: string;
        if (c === ArticleComment) {
            sourceTable = ArticleTable;
        } else if (c === BookChapterComment) {
            sourceTable = BookChapterTable;
        } else if (c === BoilingPointComment) {
            sourceTable = BoilingPointTable;
        }
        return sourceTable;
    }

    private getCommentTable(c: new () => Comment): string {
        let userLikeTable: string;
        if (c === ArticleComment) {
            userLikeTable = ArticleCommentTable;
        } else if (c === BookChapterComment) {
            userLikeTable = BookChapterCommentTable;
        } else if (c === BoilingPointComment) {
            userLikeTable = BoilingPointCommentTable;
        }
        return userLikeTable;
    }

    private getUserLikeTable(c: new () => Comment): string {
        let userLikeTable: string;
        if (c === ArticleComment) {
            userLikeTable = LikeArticleCommentTable;
        } else if (c === BookChapterComment) {
            userLikeTable = LikeBookChapterCommentTable;
        } else if (c === BoilingPointComment) {
            userLikeTable = LikeBoilingPointCommentTable;
        }
        return userLikeTable;
    }
}