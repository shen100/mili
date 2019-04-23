import * as _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Category } from '../entity/category.entity';
import { Article } from '../entity/article.entity';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async hot(): Promise<Array<Category>> {
        const categories: Array<Category> = await this.categoryRepository.find({
                select: {
                    id: true,
                    name: true,
                },
            });
        return categories;
    }

    // 随机返回文章
    async randomCategories(page: number, pageSize: number) {
        const [list, count] = await Promise.all([
            this.categoryRepository.find({
                select: {
                    id: true,
                    name: true,
                    followerCount: true,
                    articleCount: true,
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.categoryRepository.count(),
        ]);
        return {
            list,
            count,
            page,
            pageSize,
        };
    }

    async searchCategories(keyword: string, page: number, pageSize: number) {
        const condition = {
            name: Like(`%${keyword}%`),
        };
        const [list, count] = await Promise.all([
            this.categoryRepository.find({
                select: {
                    id: true,
                    name: true,
                },
                where: condition,
                skip: (page - 1) * pageSize,
                take: pageSize,
            } as any),
            this.categoryRepository.count(condition),
        ]);
        return {
            list,
            count,
            page,
            pageSize,
        };
    }
}