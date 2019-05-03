import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { ArticleService } from './article.service';

@Injectable()
export class RecommendService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly articleService: ArticleService,
    ) {}

    async recommendUsers() {
        return await this.userRepository.find({
            select: {
                id: true,
                username: true,
                avatarURL: true,
                introduce: true,
            },
            take: 3,
        });
    }

    async recommendUsersWithRecentUpdate(page: number, pageSize: number) {
        const [users, count] = await Promise.all([
            this.userRepository.find({
                select: {
                    id: true,
                    username: true,
                    avatarURL: true,
                    introduce: true,
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.userRepository.count(),
        ]);
        const list = [];
        for (const user of users) {
            const articles = await this.articleService.threeRecentArticles(user.id);
            list.push({
                ...user,
                introduce: '资深媒体人，思、史、诗皆是爱好，以业余的态度...',
                updates: articles,
            });
        }
        return {
            list,
            count,
            page,
            pageSize,
        };
    }
}