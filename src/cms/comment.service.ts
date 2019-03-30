import * as _ from 'lodash';
import * as marked from 'marked';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment, CommentContentType, CommentStatus } from '../entity/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

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

    async create(createCommentDto: CreateCommentDto, userID: number) {
        const comment = new Comment();
        comment.contentType = createCommentDto.contentType;
        if (comment.contentType === CommentContentType.Markdown) {
            comment.content = createCommentDto.content;
            comment.htmlContent = marked(createCommentDto.content);
        } else {
            comment.htmlContent = createCommentDto.content;
        }
        comment.status = CommentStatus.Verifying;
        comment.userID = userID;
        comment.createdAt = new Date();
        comment.updatedAt = comment.createdAt;
        comment.commentCount = 0;
        return await this.commentRepository.save(comment);
    }
}