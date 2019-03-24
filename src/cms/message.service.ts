import { Injectable } from '@nestjs/common';
import { PostMsg } from 'entity/postmsg.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(PostMsg)
        private readonly postMsgRepository: Repository<PostMsg>,
    ) {}

    async postMsgList(userID: number, page: number, limit: number) {
        return await this.postMsgRepository.find({
            select: {
                id: true,
                createdAt: true,
                author: {
                    id: true,
                    username: true,
                    avatarURL: true,
                },
                article: {
                    id: true,
                    name: true,
                    browseCount: true,
                    commentCount: true,
                    likeCount: true,
                },
                status: true,
            },
            relations: ['author', 'article'],
            where: {
                authorID: userID,
            },
            order: {
                createdAt: 'DESC',
            },
            skip: (page - 1) * limit,
            take: limit,
        });
    }
}