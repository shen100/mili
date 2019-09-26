import { Injectable } from '@nestjs/common';
import { PostMsg } from '../entity/postmsg.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(PostMsg)
        private readonly postMsgRepository: Repository<PostMsg>,
    ) {}

    async postMsgList(userID: number, page: number, pageSize: number) {
        const [list, count] = await Promise.all([
            this.postMsgRepository.find({
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
                        summary: true,
                        browseCount: true,
                        commentCount: true,
                        likedCount: true,
                    },
                    collection: {
                        id: true,
                        name: true,
                    },
                    status: true,
                },
                relations: ['author', 'article', 'collection'],
                where: {
                    userID,
                },
                order: {
                    createdAt: 'DESC',
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.postMsgRepository.count({
                userID,
            }),
        ]);
        return {
            list,
            count,
            page,
            pageSize,
        };
    }
}