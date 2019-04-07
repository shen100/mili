import * as _ from 'lodash';
import * as marked from 'marked';
import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { Repository, Not, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment, CommentContentType, CommentStatus } from '../entity/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NO_PARENT, ErrorCode } from '../config/constants';
import { recentTime } from '../utils/viewfilter';
import { MyHttpException } from '../common/exception/my-http.exception';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) {}

    async findOne(commentID: number, select) {
        const comment = await this.commentRepository.findOne({
            id: commentID,
        }, {
            select,
        });
        return comment;
    }

    async isExist(id: number, articleID?: number) {
        const conditions = { id, articleID };
        if (!articleID) {
            delete conditions.articleID;
        }
        const comment = await this.commentRepository.findOne(conditions, {
            select: ['id', 'articleID'],
        });
        return comment !== null;
    }

    async list(articleID: number, authorID: number, dateOrderASC: boolean, page: number) {
        const limit: number = 20;
        const self = this;
        async function findComments(rootIDs: number[]) {
            const condition = {
                articleID,
                rootID: rootIDs ? In(rootIDs) : NO_PARENT,
                deletedAt: null,
                userID: authorID,
                status: Not(CommentStatus.VerifyFail),
            };
            if (!articleID) {
                delete condition.articleID;
            }
            if (!authorID) {
                delete condition.userID;
            }
            const query = {
                select: {
                    id: true,
                    createdAt: true,
                    htmlContent: true,
                    parentID: true,
                    rootID: true,
                    user: {
                        id: true,
                        username: true,
                        avatarURL: true,
                    },
                    likeCount: true,
                } as any,
                relations: ['user'],
                where: condition,
                order: {
                    createdAt: dateOrderASC ? 'ASC' : 'DESC',
                },
                skip: (page - 1) * limit,
                take: limit,
            };
            if (rootIDs) {
                delete query.take;
            }
            let count: number = 0;
            let commentArr;
            if (!rootIDs) {
                [commentArr, count] = await Promise.all([
                    self.commentRepository.find(query as any),
                    self.commentRepository.count(condition),
                ]);
                return {
                    comments: commentArr,
                    totalCount: count,
                };
            }
            commentArr = await self.commentRepository.find(query as any);
            return {
                comments: commentArr,
                totalCount: count,
            };
        }

        const result = await findComments(null);
        const comments = result.comments || [];
        const totalCount = result.totalCount || 0;
        let subResult;
        if (comments.length) {
            const commentIDs = _.map(comments, 'id');
            subResult = await findComments(commentIDs);
        }
        const obj = {
            comments,
            subComments: subResult && subResult.comments || [],
            page,
            pageSize: limit,
            totalCount,
        };
        obj.comments = obj.comments.map(comment => {
            return {
                ...comment,
                createdAtLabel: recentTime(comment.createdAt, 'YYYY.MM.DD HH:mm'),
            };
        });
        obj.subComments = obj.subComments.map(comment => {
            return {
                ...comment,
                createdAtLabel: recentTime(comment.createdAt, 'YYYY.MM.DD HH:mm'),
            };
        });
        return obj;
    }

    async create(createCommentDto: CreateCommentDto, userID: number) {
        const comment = new Comment();
        comment.articleID = createCommentDto.articleID;
        comment.contentType = CommentContentType.HTML;
        comment.htmlContent = createCommentDto.content;
        comment.parentID = createCommentDto.parentID || NO_PARENT;
        comment.rootID = createCommentDto.rootID || NO_PARENT;
        comment.status = CommentStatus.Verifying;
        comment.userID = userID;
        comment.createdAt = new Date();
        comment.updatedAt = comment.createdAt;
        comment.commentCount = 0;

        await this.commentRepository.manager.connection.transaction(async manager => {
            const sql = `UPDATE articles SET comment_count = comment_count + 1 WHERE id = ${comment.articleID}`;
            const commentRepository = manager.getRepository(Comment);
            await commentRepository.save(comment);
            await manager.query(sql);
        });
        return comment;
    }

    async delete(commentID: number, userID: number) {
        const comment = await this.findOne(commentID, ['id', 'articleID', 'parentID', 'rootID']);
        if (!comment) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        if (comment.userID !== userID) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }
        await this.commentRepository.manager.connection.transaction(async manager => {
            let sql1 = `DELETE FROM comments WHERE id = ${commentID}`;
            let sql2 = `DELETE FROM userlikecomments WHERE comment_id = ${commentID}`;
            if (!comment.parentID) {
                sql1 = `DELETE FROM comments WHERE id = ${commentID} or root_id = ${commentID}`;
                sql2 = `DELETE FROM userlikecomments WHERE comment_id = ${commentID} or root_id = ${commentID}`;
            }
            const deleteResult = await manager.query(sql1);
            await manager.query(sql2);
            const sql3 = `UPDATE articles SET comment_count = comment_count - ${deleteResult.affectedRows} WHERE id = ${comment.articleID}`;
            await manager.query(sql3);
        });
    }

    // articleID是个冗余字段，为了方便查询用户在某篇文章下点过赞的所有评论
    async like(commentID: number, userID: number) {
        const comment = await this.findOne(commentID, ['id', 'articleID', 'parentID', 'rootID']);
        if (!comment) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
            });
        }
        if (comment.userID !== userID) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }
        const articleID = comment.articleID;
        const parentID = comment.parentID || NO_PARENT;
        const rootID = comment.rootID || NO_PARENT;
        const sql = `SELECT comment_id, user_id FROM userlikecomments
            WHERE comment_id = ${commentID} AND user_id = ${userID}`;
        let result = await this.commentRepository.manager.query(sql);
        result = result || [];
        if (result.length) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '已经赞过此评论',
            });
        }
        await this.commentRepository.manager.connection.transaction(async manager => {
            const sql2 = `INSERT INTO userlikecomments (comment_id, user_id, created_at, article_id, parent_id, root_id)
                VALUES(${commentID}, ${userID}, "${moment(new Date()).format('YYYY.MM.DD HH:mm:ss')}", ${articleID},
                ${parentID}, ${rootID})`;
            const sql3 = `UPDATE comments SET like_count = like_count + 1 WHERE id = ${commentID}`;
            await manager.query(sql2);
            await manager.query(sql3);
        });
    }

    async deleteLike(commentID: number, userID: number) {
        const sql = `SELECT comment_id, user_id FROM userlikecomments
            WHERE comment_id = ${commentID} AND user_id = ${userID}`;
        let result = await this.commentRepository.manager.query(sql);
        result = result || [];
        if (result.length <= 0) {
            throw new MyHttpException({
                errorCode: ErrorCode.ParamsError.CODE,
                message: '您还没有赞过此评论哦',
            });
        }
        await this.commentRepository.manager.connection.transaction(async manager => {
            const sql2 = `DELETE FROM userlikecomments
                WHERE comment_id = ${commentID} AND user_id = ${userID}`;
            const sql3 = `UPDATE comments SET like_count = like_count - 1 WHERE id = ${commentID}`;
            await manager.query(sql2);
            await manager.query(sql3);
        });

        return result;
    }

    async userLikesInArticle(articleID: number, userID: number) {
        const sql = `SELECT comment_id as commentID FROM userlikecomments
            WHERE article_id = ${articleID} AND user_id = ${userID}`;
        let result = await this.commentRepository.manager.query(sql);
        result = result || [];
        return result;
    }
}