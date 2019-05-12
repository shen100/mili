import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { ArticleService } from './article.service';
import { ListResult } from '../entity/interface';

@Injectable()
export class RecommendService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly articleService: ArticleService,
    ) {}

    async recommendUsers(): Promise<Array<User>> {
        return await this.userRepository.find({
            select: {
                id: true,
                username: true,
                avatarURL: true,
                introduce: true,
            },
            take: 3,
            order: {
                articleCount: 'DESC',
            },
        });
    }

    async recommendUsersWithRecentUpdate(page: number, pageSize: number): Promise<ListResult> {
        const [users, count] = await this.userRepository.findAndCount({
            select: {
                id: true,
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: {
                articleCount: 'DESC',
                id: 'DESC',
            },
        });
        const userIDArr = users.map(user => user.id);
        const list = await this.articleService.usersRecentArticles(userIDArr, 3);
        return {
            list,
            count,
            page,
            pageSize,
        };
    }
}