import * as _ from 'lodash';
import * as marked from 'marked';
import { Injectable } from '@nestjs/common';
import { Repository, Not, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment, CommentContentType, CommentStatus } from '../entity/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NO_PARENT } from '../config/constants';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) {}

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

    async list(articleID: number, page: number) {
        const limit: number = 20;
        const self = this;
        async function findComments(parentIDs: number[]) {
            const condition = {
                articleID,
                parentID: parentIDs ? In(parentIDs) : NO_PARENT,
                deletedAt: null,
                status: Not(CommentStatus.VerifyFail),
            };
            const query = {
                select: {
                    id: true,
                    createdAt: true,
                    htmlContent: true,
                    user: {
                        id: true,
                        username: true,
                        avatarURL: true,
                    },
                } as any,
                relations: ['user'],
                where: condition,
                order: {
                    createdAt: 'DESC',
                },
                skip: (page - 1) * limit,
                take: limit,
            };
            let count: number = 0;
            let commentArr;
            if (!parentIDs) {
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
        return {
            comments,
            subComments: subResult.comments || [],
            page,
            pageSize: limit,
            totalCount,
        };
    }

    async create(createCommentDto: CreateCommentDto, userID: number) {
        const comment = new Comment();
        comment.contentType = CommentContentType.HTML;
        comment.htmlContent = createCommentDto.content;
        comment.status = CommentStatus.Verifying;
        comment.userID = userID;
        comment.createdAt = new Date();
        comment.updatedAt = comment.createdAt;
        comment.commentCount = 0;
        return await this.commentRepository.save(comment);
    }
}