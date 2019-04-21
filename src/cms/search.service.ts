import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not } from 'typeorm';
import { Article, ArticleStatus } from '../entity/article.entity';

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
    ) {}

    async searchArticle(keyword: string, page: number, pageSize: number) {
        const articles = this.articleRepository.find({
            select: {
                id: true,
                name: true,
                createdAt: true,
                summary: true,
                commentCount: true,
                user: {
                    id: true,
                    username: true,
                },
            },
            relations: ['user'],
            where: {
                name: Like(`%${keyword}%`),
                deletedAt: null,
                status: Not(ArticleStatus.VerifyFail),
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return articles;
    }
}